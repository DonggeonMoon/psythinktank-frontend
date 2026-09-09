import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link, navigate} from "gatsby";
import {collection, getDocs, limit, orderBy, query, Timestamp} from "firebase/firestore";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";
import {db} from "../../firebase/client";
import {useAuth} from "../../contexts/AuthContext";
import {BOARD_CATEGORY_LABEL, BoardCategory} from "../../lib/boardCategory";
import type {Role} from "../../lib/roles";
import RoleBadge from "../../components/RoleBadge";

interface Post {
    id: string;
    title: string;
    authorName: string;
    authorRole: Role | null;
    createdAt: Timestamp | null;
    views: number;
    notice: boolean;
    category: BoardCategory;
}

const CATEGORIES: BoardCategory[] = ["domestic", "overseas"];

const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const BoardPage: React.FC<PageProps> = () => {
    const {user} = useAuth();
    const [category, setCategory] = useState<BoardCategory>("domestic");
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        (async () => {
            const snapshot = await getDocs(
                query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50))
            );
            setPosts(
                snapshot.docs.map((d) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        title: data.title,
                        authorName: data.authorName,
                        authorRole: data.authorRole ?? null,
                        createdAt: data.createdAt ?? null,
                        views: data.views ?? 0,
                        notice: data.notice ?? false,
                        category: data.category ?? "domestic",
                    };
                })
            );
            setLoading(false);
        })();
    }, []);

    const handleWriteClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate(`/boards/write?category=${category}`);
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.category === category &&
            (!searchTerm ||
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const sortedPosts = [...filteredPosts].sort((a, b) => (a.notice === b.notice ? 0 : a.notice ? -1 : 1));

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">게시판</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">투자 관련 정보 공유가 가능한 공간입니다.</p>
                    </div>
                    <button
                        onClick={handleWriteClick}
                        className="self-end rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors sm:self-auto">
                        글쓰기
                    </button>
                </header>

                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                category === c
                                    ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            {BOARD_CATEGORY_LABEL[c]}
                        </button>
                    ))}
                </div>

                <section className="space-y-4">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="제목 또는 작성자 검색"
                                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-700"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-sm">
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-[13px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                            <div className="hidden md:block col-span-1">순번</div>
                            <div className="col-span-4 md:col-span-5">제목</div>
                            <div className="hidden md:block col-span-2 text-center">작성자</div>
                            <div className="hidden md:block col-span-2 text-center">작성일</div>
                            <div className="col-span-2 text-right">조회수</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                                    <p className="text-sm font-medium">불러오는 중...</p>
                                </div>
                            ) : sortedPosts.length > 0 ? (
                                sortedPosts.map((post, idx) => (
                                    <Link
                                        to={`/boards/${post.id}`}
                                        key={post.id}
                                        className={`grid grid-cols-6 md:grid-cols-12 gap-4 px-6 py-4 text-sm items-center transition-all duration-200 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 ${
                                            post.notice
                                                ? 'bg-amber-50/30 dark:bg-amber-900/10'
                                                : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="hidden md:block col-span-1 text-center font-mono text-xs text-slate-400 dark:text-slate-500">
                                            {post.notice ? "-" : sortedPosts.length - idx}
                                        </div>

                                        <div className="col-span-4 md:col-span-5 flex items-center gap-2 overflow-hidden">
                                            {post.notice && (
                                                <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                    공지
                                                </span>
                                            )}
                                            <span className={`truncate ${post.notice ? "font-semibold text-slate-900 dark:text-white" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors"}`}>
                                                {post.title}
                                            </span>
                                        </div>

                                        <div className="hidden md:flex col-span-2 items-center justify-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 truncate">
                                            <span className="truncate">{post.authorName}</span>
                                            <RoleBadge role={post.authorRole}/>
                                        </div>

                                        <div className="hidden md:block col-span-2 text-center text-slate-400 dark:text-slate-500 text-xs">
                                            {formatDate(post.createdAt)}
                                        </div>

                                        <div className="col-span-2 text-right font-mono text-slate-600 dark:text-slate-400">
                                            {(post.views ?? 0).toLocaleString()}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <p className="text-sm font-medium">등록된 게시글이 없습니다.</p>
                                    <p className="text-xs mt-1 opacity-70">첫 번째 게시글의 주인공이 되어보세요!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Ticker />
            <Footer />
        </div>
    )
}

export default BoardPage;

export const Head: HeadFC = () => <title>게시판</title>;
