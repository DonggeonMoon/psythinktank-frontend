import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { navigate } from "gatsby";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import type { Role } from "../lib/roles";
import { PRIVACY_CONSENT_VERSION } from "../lib/privacyConsent";

interface UserProfile {
    nickname: string;
    role: Role;
    privacyConsentVersion: string | null;
}

interface AuthContextValue {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signup: (email: string, password: string, nickname: string) => Promise<void>;
    checkEmailAvailable: (email: string) => Promise<boolean>;
    checkNicknameAvailable: (nickname: string) => Promise<boolean>;
    updateNickname: (nickname: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: (currentPassword: string) => Promise<void>;
    agreeToPrivacyConsent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
    resetPassword: async () => {},
    signup: async () => {},
    checkEmailAvailable: async () => false,
    checkNicknameAvailable: async () => false,
    updateNickname: async () => {},
    changePassword: async () => {},
    deleteAccount: async () => {},
    agreeToPrivacyConsent: async () => {},
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const requireCurrentUser = () => {
    if (!auth?.currentUser || !auth.currentUser.email) {
        throw new Error("로그인이 필요합니다.");
    }
    return auth.currentUser;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 회원가입 중 닉네임/이메일 중복으로 Firestore 배치가 실패하면 방금 만든 Auth 계정을 되돌려야 하는데,
// 이 롤백 자체가 일시적인 네트워크 문제로 실패하면 프로필 없는 고아 계정이 영구히 남는다. 몇 차례 재시도해서 그 확률을 낮춘다.
const deleteUserWithRetry = async (user: User, attempts = 3) => {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            await deleteUser(user);
            return;
        } catch {
            if (attempt < attempts) await sleep(attempt * 500);
        }
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !db) return;
        const firestore = db;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const snapshot = await getDoc(doc(firestore, "users", firebaseUser.uid));
                const data = snapshot.exists() ? snapshot.data() : null;
                const userProfile: UserProfile | null = data
                    ? {
                          nickname: data.nickname,
                          role: data.role,
                          privacyConsentVersion: data.privacyConsent?.version ?? null,
                      }
                    : null;
                setProfile(userProfile);

                // 닉네임 중복확인 기능이 생기기 전에 가입한 계정은 nicknames/{nickname} 문서가 없어
                // 중복 검사에서 항상 "사용 가능"으로 잘못 나온다. 로그인할 때마다 누락 여부를 확인해
                // 없으면 채워 넣어(백필) 기존 계정도 점진적으로 중복 검사 대상에 포함시킨다.
                if (userProfile?.nickname) {
                    const nicknameRef = doc(firestore, "nicknames", userProfile.nickname);
                    getDoc(nicknameRef)
                        .then((nicknameSnapshot) => {
                            if (!nicknameSnapshot.exists()) {
                                return setDoc(nicknameRef, { uid: firebaseUser.uid });
                            }
                        })
                        .catch(() => {});
                }

                // 마이그레이션된 옛날 회원 등, 최신 버전의 개인정보 동의를 아직 안 받은 계정은
                // 동의 페이지로 보내 재동의를 받는다.
                if (
                    userProfile &&
                    userProfile.privacyConsentVersion !== PRIVACY_CONSENT_VERSION &&
                    window.location.pathname !== "/consent"
                ) {
                    navigate("/consent");
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase Auth가 초기화되지 않았습니다.");
        const { user: signedIn } = await signInWithEmailAndPassword(auth, email, password);
        if (signedIn.emailVerified || !db) return;

        // 마이그레이션된 기존 회원은 이메일 인증 이력이 없으므로 신규 가입자에게만 인증을 요구한다.
        const snapshot = await getDoc(doc(db, "users", signedIn.uid));
        if (snapshot.exists() && snapshot.data().legacyUserId != null) return;

        await sendEmailVerification(signedIn).catch(() => {});
        await signOut(auth);
        const error = new Error("이메일 인증이 필요합니다.") as Error & { code?: string };
        error.code = "auth/email-not-verified";
        throw error;
    };

    const logout = async () => {
        if (!auth) return;
        await signOut(auth);
    };

    const resetPassword = async (email: string) => {
        if (!auth) throw new Error("Firebase Auth가 초기화되지 않았습니다.");
        await sendPasswordResetEmail(auth, email);
    };

    const checkEmailAvailable = async (email: string) => {
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");
        const normalized = normalizeEmail(email);
        if (!normalized) return false;
        const snapshot = await getDoc(doc(db, "emails", normalized));
        return !snapshot.exists();
    };

    const checkNicknameAvailable = async (nickname: string) => {
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");
        const trimmed = nickname.trim();
        if (!trimmed) return false;
        const snapshot = await getDoc(doc(db, "nicknames", trimmed));
        return !snapshot.exists();
    };

    const signup = async (email: string, password: string, nickname: string) => {
        if (!auth || !db) throw new Error("Firebase가 초기화되지 않았습니다.");
        const firestore = db;
        const trimmedNickname = nickname.trim();

        const credential = await createUserWithEmailAndPassword(auth, email, password);

        try {
            const batch = writeBatch(firestore);
            batch.set(doc(firestore, "nicknames", trimmedNickname), { uid: credential.user.uid });
            batch.set(doc(firestore, "emails", normalizeEmail(email)), { uid: credential.user.uid });
            batch.set(doc(firestore, "users", credential.user.uid), {
                email,
                nickname: trimmedNickname,
                role: "member",
                legacyUserId: null,
                createdAt: serverTimestamp(),
                privacyConsent: { agreedAt: serverTimestamp(), version: PRIVACY_CONSENT_VERSION },
            });
            await batch.commit();
        } catch {
            await deleteUserWithRetry(credential.user);
            const error = new Error("닉네임 또는 이메일이 이미 사용 중입니다.") as Error & { code?: string };
            error.code = "signup/duplicate";
            throw error;
        }

        await sendEmailVerification(credential.user);
        await signOut(auth);
    };

    const updateNickname = async (nickname: string) => {
        const currentUser = requireCurrentUser();
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");
        const firestore = db;
        const trimmedNickname = nickname.trim();
        const previousNickname = profile?.nickname;

        if (previousNickname === trimmedNickname) return;

        try {
            const batch = writeBatch(firestore);
            batch.set(doc(firestore, "nicknames", trimmedNickname), { uid: currentUser.uid });
            if (previousNickname) {
                batch.delete(doc(firestore, "nicknames", previousNickname));
            }
            batch.update(doc(firestore, "users", currentUser.uid), { nickname: trimmedNickname });
            await batch.commit();
        } catch {
            const error = new Error("닉네임이 이미 사용 중입니다.") as Error & { code?: string };
            error.code = "nickname/already-in-use";
            throw error;
        }

        setProfile((prev) => (prev ? { ...prev, nickname: trimmedNickname } : prev));
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        const currentUser = requireCurrentUser();

        const credential = EmailAuthProvider.credential(currentUser.email as string, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
    };

    const agreeToPrivacyConsent = async () => {
        const currentUser = requireCurrentUser();
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");

        await updateDoc(doc(db, "users", currentUser.uid), {
            privacyConsent: { agreedAt: serverTimestamp(), version: PRIVACY_CONSENT_VERSION },
        });
        setProfile((prev) => (prev ? { ...prev, privacyConsentVersion: PRIVACY_CONSENT_VERSION } : prev));
    };

    const deleteAccount = async (currentPassword: string) => {
        const currentUser = requireCurrentUser();
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");

        const credential = EmailAuthProvider.credential(currentUser.email as string, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        const batch = writeBatch(db);
        batch.delete(doc(db, "users", currentUser.uid));
        batch.delete(doc(db, "emails", normalizeEmail(currentUser.email as string)));
        if (profile?.nickname) {
            batch.delete(doc(db, "nicknames", profile.nickname));
        }
        await batch.commit();
        await deleteUser(currentUser);
    };

    return (
        <AuthContext.Provider
            value={{ user, profile, loading, login, logout, resetPassword, signup, checkEmailAvailable, checkNicknameAvailable, updateNickname, changePassword, deleteAccount, agreeToPrivacyConsent }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
