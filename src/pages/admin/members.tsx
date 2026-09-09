import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {navigate} from "gatsby";
import {
    collection,
    doc,
    type DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    type QueryConstraint,
    type QueryDocumentSnapshot,
    startAfter,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {db} from "../../firebase/client";
import {useAuth} from "../../contexts/AuthContext";
import {isStaffRole, ROLE_LABEL, type Role} from "../../lib/roles";

const PAGE_SIZE = 20;

interface MemberRow {
    uid: string;
    email: string;
    nickname: string;
    role: Role;
    createdAt: Timestamp | null;
}

const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const AdminMembersPage: React.FC<PageProps> = () => {
    const {user, profile, loading} = useAuth();
    const canView = !loading && !!user && isStaffRole(profile?.role);
    const canManageRoles = !loading && !!user && profile?.role === "admin";

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [cursors, setCursors] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [members, setMembers] = useState<MemberRow[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && (!user || !isStaffRole(profile?.role))) {
            navigate("/");
        }
    }, [loading, user, profile]);

    const fetchPage = async (targetPageIndex: number, term: string, cursorList: QueryDocumentSnapshot<DocumentData>[]) => {
        if (!db) return;
        setListLoading(true);
        try {
            const constraints: QueryConstraint[] = term
                ? [orderBy("nickname"), where("nickname", ">=", term), where("nickname", "<=", term + "")]
                : [orderBy("createdAt", "desc")];

            const startAfterDoc = targetPageIndex > 0 ? cursorList[targetPageIndex - 1] : undefined;
            if (startAfterDoc) constraints.push(startAfter(startAfterDoc));
            constraints.push(limit(PAGE_SIZE + 1));

            const snapshot = await getDocs(query(collection(db, "users"), ...constraints));
            const docs = snapshot.docs.slice(0, PAGE_SIZE);
            setHasNextPage(snapshot.docs.length > PAGE_SIZE);
            setMembers(
                docs.map((d) => {
                    const data = d.data();
                    return {
                        uid: d.id,
                        email: data.email,
                        nickname: data.nickname,
                        role: data.role,
                        createdAt: data.createdAt ?? null,
                    };
                })
            );
            if (docs.length > 0) {
                setCursors((prev) => {
                    const next = prev.slice(0, targetPageIndex);
                    next[targetPageIndex] = docs[docs.length - 1];
                    return next;
                });
            }
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (!canView) return;
        setPageIndex(0);
        setCursors([]);
        fetchPage(0, searchTerm, []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canView, searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchInput.trim());
    };

    const goToNextPage = () => {
        const next = pageIndex + 1;
        setPageIndex(next);
        fetchPage(next, searchTerm, cursors);
    };

    const goToPrevPage = () => {
        const prev = Math.max(0, pageIndex - 1);
        setPageIndex(prev);
        fetchPage(prev, searchTerm, cursors);
    };

    const handleRoleChange = async (uid: string, newRole: Role) => {
        if (!db || !canManageRoles) return;
        setActionMessage(null);
        try {
            await updateDoc(doc(db, "users", uid), {role: newRole});
            setMembers((prev) => prev.map((m) => (m.uid === uid ? {...m, role: newRole} : m)));
        } catch {
            setActionMessage("권한 변경에 실패했습니다.");
        }
    };

    if (loading || !canView) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">회원 관리</h1>

                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="닉네임으로 검색"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        검색
                    </button>
                </form>

                {actionMessage && <p className="text-sm text-red-600 dark:text-red-400">{actionMessage}</p>}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="hidden md:grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-[13px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                        <div className="col-span-3">닉네임</div>
                        <div className="col-span-4">이메일</div>
                        <div className="col-span-2">등급</div>
                        <div className="col-span-1">가입일</div>
                        <div className="col-span-2 text-right">관리</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {listLoading ? (
                            <div className="flex items-center justify-center py-16 text-sm text-slate-400">불러오는 중...</div>
                        ) : members.length === 0 ? (
                            <div className="flex items-center justify-center py-16 text-sm text-slate-400">검색 결과가 없습니다.</div>
                        ) : (
                            members.map((m) => (
                                <div
                                    key={m.uid}
                                    className="flex flex-col gap-1 px-6 py-4 text-sm text-slate-700 dark:text-slate-300 md:grid md:grid-cols-12 md:items-center md:gap-4"
                                >
                                    <div className="flex items-center justify-between gap-2 md:contents">
                                        <div className="truncate font-medium md:col-start-1 md:col-span-3 md:font-normal">{m.nickname}</div>
                                        <div className="md:col-start-11 md:col-span-2 md:text-right">
                                            {!canManageRoles || m.uid === user?.uid || m.role === "admin" ? (
                                                <span className="text-xs text-slate-300 dark:text-slate-600">-</span>
                                            ) : m.role === "member" ? (
                                                <button
                                                    onClick={() => handleRoleChange(m.uid, "manager")}
                                                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    승격
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleChange(m.uid, "member")}
                                                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    강등
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="truncate text-slate-500 dark:text-slate-400 md:col-start-4 md:col-span-4">{m.email}</div>
                                    <div className="md:col-start-8 md:col-span-2">{ROLE_LABEL[m.role]}</div>
                                    <div className="text-xs text-slate-400 md:col-start-10 md:col-span-1">{formatDate(m.createdAt)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageIndex === 0 || listLoading}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                        이전
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={!hasNextPage || listLoading}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                        다음
                    </button>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default AdminMembersPage;

export const Head: HeadFC = () => <title>회원 관리</title>;
