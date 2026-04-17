import * as React from "react";
import { useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Ticker from "../../components/Ticker";

// 1. 확정된 데이터 구조 (stock_name, symbol, recent_price, growth, dividend, basis_date, share_history)
const DUMMY_STOCKS: Record<string, any> = {
    "005930": {
        stock_name: "삼성전자",
        market: "KOSPI",
        growth: -2.1,
        dividend: 1444,
        recent_price: 73200,
        basis_date: "2024-04-17",
        share_history: [
            { date: "2024-04-01", name: "국민연금", ratio: "7.85%" }
        ]
    },
    "000660": {
        stock_name: "SK하이닉스",
        market: "KOSPI",
        growth: 15.4,
        dividend: 1200,
        recent_price: 182000,
        basis_date: "2024-04-17",
        share_history: []
    },
    "247540": {
        stock_name: "에코프로비엠",
        market: "KOSDAQ",
        growth: -15.2,
        dividend: 450,
        recent_price: 248500,
        basis_date: "2024-04-17",
        share_history: [
            { date: "2024-03-05", name: "이동채", ratio: "18.2%" }
        ]
    },
    AAPL: {
        stock_name: "애플",
        market: "NASDAQ",
        growth: 12.5,
        dividend: 0.96,
        recent_price: 185.92,
        basis_date: "2024-04-16",
        share_history: []
    },
    TSLA: {
        stock_name: "테슬라",
        market: "NASDAQ",
        growth: 25.8,
        dividend: 0,
        recent_price: 175.45,
        basis_date: "2024-04-16",
        share_history: []
    },
    NVDA: {
        stock_name: "엔비디아",
        market: "NASDAQ",
        growth: 252.0,
        dividend: 0.16,
        recent_price: 875.28,
        basis_date: "2024-04-16",
        share_history: []
    },
    "BRK.B": {
        stock_name: "버크셔 해서웨이",
        market: "NYSE",
        growth: 14.8,
        dividend: 0,
        recent_price: 408.32,
        basis_date: "2024-04-16",
        share_history: [
            { date: "2024-02-14", name: "Warren Buffett", ratio: "15.1%" }
        ]
    },
    "7203": { stock_name: "토요타 자동차", market: "TSE", growth: 18.2, dividend: 75, recent_price: 3605, basis_date: "2024-04-17", share_history: [] },
    "7974": { stock_name: "닌텐도", market: "TSE", growth: 8.5, dividend: 211, recent_price: 8241, basis_date: "2024-04-17", share_history: [] },
    "6758": { stock_name: "소니 그룹", market: "TSE", growth: 4.2, dividend: 80, recent_price: 13050, basis_date: "2024-04-17", share_history: [] },
    "8035": {
        stock_name: "도쿄 일렉트론",
        market: "TSE",
        growth: 32.1,
        dividend: 393,
        recent_price: 38450,
        basis_date: "2024-04-17",
        share_history: [
            { date: "2024-01-20", name: "Custody Bank of Japan", ratio: "11.2%" }
        ]
    }
};

const StockDetailPage: React.FC<PageProps> = ({ params }) => {
    const { symbol } = params;
    const stock = DUMMY_STOCKS[String(symbol).toUpperCase()];

    const getCurrency = (market: string) => {
        if (market === 'KOSPI' || market === 'KOSDAQ') return '원';
        if (market === 'TSE') return '¥';
        return '$';
    };

    const formatValue = (val: number, market: string) => (
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{val.toLocaleString()}</span>
            <span className="text-slate-400 text-sm font-medium">{getCurrency(market)}</span>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header />
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10">
                {!stock ? (
                    <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                        <p className="text-xl font-semibold">"{symbol}" 정보를 찾을 수 없습니다.</p>
                        <p className="text-slate-500 text-sm">정확한 티커를 확인하거나 목록으로 돌아가주세요.</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
                        <header className="border-b border-slate-200 dark:border-slate-800 pb-8">
                            <div className="flex items-baseline gap-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wider 
                                    ${stock.market === 'TSE' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                                    {stock.market}
                                </span>
                                <h1 className="text-4xl font-extrabold tracking-tight">{stock.stock_name}</h1>
                                <span className="text-2xl text-slate-400 font-light">{symbol}</span>
                            </div>
                        </header>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-medium text-slate-500">최근 종가</p>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                        {stock.basis_date} 기준
                                    </span>
                                </div>
                                {formatValue(stock.recent_price, stock.market)}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-500 mb-2">성장률 (YoY)</p>
                                <div className={`text-3xl font-bold ${stock.growth > 0 ? "text-red-500" : stock.growth < 0 ? "text-blue-500" : ""}`}>
                                    {stock.growth > 0 ? "▲" : "▼"} {Math.abs(stock.growth)}%
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-500 mb-2">주당 배당금 (DPS)</p>
                                {stock.dividend > 0 ? (
                                    <div className="text-emerald-600 dark:text-emerald-400">
                                        {formatValue(stock.dividend, stock.market)}
                                    </div>
                                ) : (
                                    <div className="text-3xl font-bold text-slate-300 dark:text-slate-700 font-mono">N/A</div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-bold px-1">지분 변화 히스토리</h3>
                            {stock.share_history.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">변동일</th>
                                            <th className="px-6 py-4 font-semibold">주주명</th>
                                            <th className="px-6 py-4 text-right font-semibold">지분율</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {stock.share_history.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.date}</td>
                                                <td className="px-6 py-4 font-medium">{item.name}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-slate-100">{item.ratio}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
                                    등록된 지분 변동 이력이 없습니다.
                                </div>
                            )}
                        </section>

                    </div>
                )}
            </main>
            <Ticker />
            <Footer />
        </div>
    );
};

export default StockDetailPage;

export const Head: HeadFC = () => <title>종목 상세 정보 | PSY Thinktank</title>;