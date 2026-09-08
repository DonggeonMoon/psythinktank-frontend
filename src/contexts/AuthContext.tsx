import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
});

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

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
