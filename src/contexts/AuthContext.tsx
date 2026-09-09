import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { navigate } from "gatsby";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    type User,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
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
        await signInWithEmailAndPassword(auth, email, password);
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
            await deleteUser(credential.user).catch(() => {});
            const error = new Error("닉네임 또는 이메일이 이미 사용 중입니다.") as Error & { code?: string };
            error.code = "signup/duplicate";
            throw error;
        }

        setProfile({ nickname: trimmedNickname, role: "member", privacyConsentVersion: PRIVACY_CONSENT_VERSION });
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
        await deleteDoc(doc(db, "users", currentUser.uid));
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
