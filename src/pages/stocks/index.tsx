import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";

const StockPage: React.FC<PageProps> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        종목
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        원하는 종목을 찾을 수 있습니다.
                    </p>
                </header>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <label className="sr-only" htmlFor="stockSearch">
                                종목 검색
                            </label>
                            <input
                                id="stockSearch"
                                type="text"
                                placeholder="종목명 - 티커 검색 (예: 삼성전자, AAPL)"
                                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-700"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900">
                                검색
                            </button>
                            <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                초기화
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <div className="grid grid-cols-12 gap-2 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <div className="col-span-5">종목</div>
                            <div className="col-span-3">티커</div>
                            <div className="col-span-2 text-right">등락율</div>
                            <div className="col-span-2 text-right">거래량</div>
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


export default StockPage

export const Head: HeadFC = () => <title>종목</title>