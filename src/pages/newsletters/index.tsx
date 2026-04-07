import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Ticker from "../../components/Ticker";

const NewsletterPage: React.FC<PageProps> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        회보
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        최신 및 지난 발행 회보를 읽을 수 있습니다.
                    </p>
                </header>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <div className="grid grid-cols-12 gap-2 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <div className="col-span-7">제목</div>
                            <div className="col-span-2 text-center">구분</div>
                            <div className="col-span-3 text-center">발행일</div>
                        </div>

                        <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            데이터 없음
                        </div>
                    </div>
                </section>
            </main>

            <Ticker/>

            <Footer />
        </div>
    )
}

export default NewsletterPage

export const Head: HeadFC = () => <title>회보</title>