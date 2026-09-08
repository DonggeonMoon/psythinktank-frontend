import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    type User,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import type { Role } from "../lib/roles";

interface UserProfile {
    nickname: string;
    role: Role;
}

interface AuthContextValue {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, nickname: string) => Promise<void>;
    checkNicknameAvailable: (nickname: string) => Promise<boolean>;
    updateNickname: (nickname: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: (currentPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
    signup: async () => {},
    checkNicknameAvailable: async () => false,
    updateNickname: async () => {},
    changePassword: async () => {},
    deleteAccount: async () => {},
});

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
                const userProfile = snapshot.exists() ? (snapshot.data() as UserProfile) : null;
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
            batch.set(doc(firestore, "users", credential.user.uid), {
                email,
                nickname: trimmedNickname,
                role: "member",
                legacyUserId: null,
                createdAt: serverTimestamp(),
            });
            await batch.commit();
        } catch {
            await deleteUser(credential.user).catch(() => {});
            const error = new Error("닉네임이 이미 사용 중입니다.") as Error & { code?: string };
            error.code = "nickname/already-in-use";
            throw error;
        }

        setProfile({ nickname: trimmedNickname, role: "member" });
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
            value={{ user, profile, loading, login, logout, signup, checkNicknameAvailable, updateNickname, changePassword, deleteAccount }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
