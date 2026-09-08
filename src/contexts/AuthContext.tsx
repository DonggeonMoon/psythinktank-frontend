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
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";

interface UserProfile {
    nickname: string;
    role: "admin" | "member";
}

interface AuthContextValue {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, nickname: string) => Promise<void>;
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
                setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
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

    const signup = async (email: string, password: string, nickname: string) => {
        if (!auth || !db) throw new Error("Firebase가 초기화되지 않았습니다.");
        const firestore = db;

        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(firestore, "users", credential.user.uid), {
            email,
            nickname,
            role: "member",
            legacyUserId: null,
            createdAt: serverTimestamp(),
        });
        setProfile({ nickname, role: "member" });
    };

    const updateNickname = async (nickname: string) => {
        const currentUser = requireCurrentUser();
        if (!db) throw new Error("Firebase가 초기화되지 않았습니다.");

        await updateDoc(doc(db, "users", currentUser.uid), { nickname });
        setProfile((prev) => (prev ? { ...prev, nickname } : prev));
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
            value={{ user, profile, loading, login, logout, signup, updateNickname, changePassword, deleteAccount }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
