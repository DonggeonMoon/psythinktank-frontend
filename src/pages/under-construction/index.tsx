import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Ticker from "../../components/Ticker";

const IndexPage: React.FC<PageProps> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-12">

                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            성장성 Top 50
                        </h2>

                        <div className="flex gap-2">
                            <button
                                className="px-4 py-1.5 text-sm rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                🇰🇷국내
                            </button>
                            <button
                                className="px-4 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                🇺🇸미국
                            </button>
                            <button
                                className="px-4 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                🇯🇵일본
                            </button>
                        </div>
                    </div>

                    <div
                        className="h-1000 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        데이터 없음
                    </div>
                </section>

            </main>

            <Ticker/>

            <Footer/>
        </div>
    )
}


export default IndexPage

export const Head: HeadFC = () => <title>PSY Thinktank</title>