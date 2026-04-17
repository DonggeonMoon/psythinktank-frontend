import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Link } from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";
import {useState} from "react";

interface Post {
    id: string;
    title: string;
    author: string;
    date: string;
    views: number;
    notice: boolean;
}

const DUMMY_DATA: Post[] = [
    // { id: "1", title: "게시판 이용 수칙 및 가이드 (필독)", author: "운영자", date: "2026.04.01", views: 10240, notice: true },
    // { id: "2", title: "시스템 점검 안내 (04/20)", author: "운영자", date: "2026.04.18", views: 450, notice: true },
    // { id: "3", title: "2026년 반도체 시장 전망 공유", author: "반도체장인", date: "2026.04.18", views: 1250, notice: false },
    // { id: "4", title: "나스닥 선물 변동성 대응 전략", author: "글로벌거시", date: "2026.04.17", views: 890, notice: false },
    // { id: "5", title: "초보자를 위한 배당주 투자 가이드", author: "꾸준함이답", date: "2026.04.16", views: 3200, notice: false },
];

const BoardPage: React.FC<PageProps> = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const posts = DUMMY_DATA || [];
    const sortedPosts = [...posts].sort((a, b) => (a.notice === b.notice ? 0 : a.notice ? -1 : 1));

    const handleSearch = () => {
        console.log(`'${searchTerm}' 검색 실행`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">게시판</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">투자 관련 정보 공유가 가능한 공간입니다.</p>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors">
                        글쓰기
                    </button>
                </header>

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
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="shrink-0 rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-all">
                            검색
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-sm">
                        <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-[13px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                            <div className="col-span-1">순번</div>
                            <div className="col-span-5">제목</div>
                            <div className="col-span-2 text-center">작성자</div>
                            <div className="col-span-2 text-center">작성일</div>
                            <div className="col-span-2 text-right">조회수</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedPosts.length > 0 ? (
                                sortedPosts.map((post) => (
                                    <Link
                                        to={`/boards/${post.id}`}
                                        key={post.id}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center transition-all duration-200 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 ${
                                            post.notice
                                                ? 'bg-amber-50/30 dark:bg-amber-900/10'
                                                : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="col-span-1 text-center font-mono text-xs text-slate-400 dark:text-slate-500">
                                            {post.notice ? "-" : post.id}
                                        </div>

                                        <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                                            {post.notice && (
                                                <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                    공지
                                                </span>
                                            )}
                                            <span className={`truncate ${post.notice ? "font-semibold text-slate-900 dark:text-white" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors"}`}>
                                                {post.title}
                                            </span>
                                        </div>

                                        <div className="col-span-2 text-center font-medium text-slate-600 dark:text-slate-400 truncate">
                                            {post.author}
                                        </div>

                                        <div className="col-span-2 text-center text-slate-400 dark:text-slate-500 text-xs">
                                            {post.date}
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