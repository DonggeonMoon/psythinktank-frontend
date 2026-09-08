import * as React from "react";
import {useMemo, useState} from "react";
import {graphql, type HeadFC, type PageProps} from "gatsby";
import {Link} from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";

export const query = graphql`
  query {
    allStockDetail(sort: { symbol: ASC }) {
      nodes {
        stock_name
        symbol
        market
      }
    }
  }
`;

interface Stock {
    stock_name: string;
    symbol: string;
    market: string;
}

interface DataProps {
    allStockDetail: { nodes: Stock[] };
}

const StockPage: React.FC<PageProps<DataProps>> = ({data}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const stocks = data.allStockDetail.nodes;

    const filteredStocks = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase().trim();

        if (!lowerSearch) return stocks;

        return stocks.filter(
            (stock) =>
                stock.stock_name.toLowerCase().includes(lowerSearch) ||
                stock.symbol.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, stocks]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            종목
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            원하는 종목을 찾을 수 있습니다.
                        </p>
                    </div>
                </header>

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <div
                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>

                            <input
                                type="text"
                                placeholder="종목명 또는 티커(예: TSLA) 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30 transition-all"
                            />
                        </div>
                    </div>

                    <div
                        className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">종목명</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">티커</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">시장</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredStocks.length > 0 ? (
                                filteredStocks.map((stock) => (
                                    <tr key={stock.symbol}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold">
                                            <Link
                                                to={`/stocks/${stock.symbol}`}
                                                className="block text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                            >
                                                {stock.stock_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                                    {stock.symbol}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${stock.market === 'KOSPI' || stock.market === 'KOSDAQ' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                                    stock.market === 'TSE' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                                                        'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                                    {stock.market}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-24">
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <svg
                                                className="w-12 h-12 mb-3 opacity-20"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                                />
                                            </svg>
                                            <p className="text-sm">데이터가 없습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Ticker/>
            <Footer/>
        </div>
    );
};

export default StockPage;

export const Head: HeadFC = () => <title>종목 탐색 | PSY Thinktank</title>;