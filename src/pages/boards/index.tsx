import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";

const BoardPage: React.FC<PageProps> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            게시판
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            투자 관련 정보 공유가 가능한 공간입니다.
                        </p>
                    </div>

                    <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900">
                        글쓰기
                    </button>
                </header>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="제목 또는 작성자 검색"
                            className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-700"
                        />
                        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900">
                            검색
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

                        <div className="grid grid-cols-12 gap-2 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <div className="col-span-6">제목</div>
                            <div className="col-span-2 text-center">작성자</div>
                            <div className="col-span-2 text-center">작성일</div>
                            <div className="col-span-2 text-center">조회수</div>
                        </div>

                        <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            게시글이 없습니다.
                        </div>
                    </div>
                </section>
            </main>

            <Ticker/>

            <Footer />
        </div>
    )
}

export default BoardPage

export const Head: HeadFC = () => <title>게시판</title>