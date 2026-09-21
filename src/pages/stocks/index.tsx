import * as React from "react";
import {useMemo} from "react";
import {graphql, type HeadFC, type PageProps} from "gatsby";
import {Link} from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";
import I18nText from "../../components/I18nText";
import LangSwitcher from "../../components/LangSwitcher";
import {countSummary, stocksPageLabels} from "../../i18n/pageLabels";
import {useAutoLang} from "../../hooks/useAutoLang";
import {usePersistedState} from "../../hooks/usePersistedState";

export const query = graphql`
  query {
    allStockDetail(sort: { symbol: ASC }) {
      nodes {
        stock_name
        symbol
        market
        nps_holding
      }
    }
  }
`;

interface Stock {
    stock_name: string | null;
    symbol: string | null;
    market: string;
    nps_holding: boolean | null;
}

interface DataProps {
    allStockDetail: { nodes: Stock[] };
}

const PAGE_SIZE = 30;

const StockPage: React.FC<PageProps<DataProps>> = ({data}) => {
    const [lang, setLang] = useAutoLang();
    const [searchTerm, setSearchTerm] = usePersistedState("stocks:searchTerm", "");
    const [npsOnly, setNpsOnly] = usePersistedState("stocks:npsOnly", false);
    const [currentPage, setCurrentPage] = usePersistedState("stocks:page", 1);
    const stocks = data.allStockDetail.nodes;

    const filteredStocks = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase().trim();

        const symbolMatchRank = (symbol: string | null) => {
            const lowerSymbol = symbol?.toLowerCase() ?? "";
            if (lowerSymbol === lowerSearch) return 3;
            if (lowerSymbol.startsWith(lowerSearch)) return 2;
            if (lowerSymbol.includes(lowerSearch)) return 1;
            return 0;
        };

        return stocks
            .filter(
                (stock) =>
                    (!npsOnly || stock.nps_holding) &&
                    (!lowerSearch ||
                        stock.stock_name?.toLowerCase().includes(lowerSearch) ||
                        stock.symbol?.toLowerCase().includes(lowerSearch))
            )
            .sort((a, b) => symbolMatchRank(b.symbol) - symbolMatchRank(a.symbol));
    }, [searchTerm, npsOnly, stocks]);

    const totalPages = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const pagedStocks = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredStocks.slice(start, start + PAGE_SIZE);
    }, [filteredStocks, safePage]);

    const pageNumbers = useMemo(() => {
        const windowSize = 5;
        const start = Math.max(1, safePage - Math.floor(windowSize / 2));
        const end = Math.min(totalPages, start + windowSize - 1);
        const adjustedStart = Math.max(1, end - windowSize + 1);
        return Array.from({length: end - adjustedStart + 1}, (_, i) => adjustedStart + i);
    }, [safePage, totalPages]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">

                <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            <I18nText dict={stocksPageLabels.title} lang={lang}/>
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <I18nText dict={stocksPageLabels.subtitle} lang={lang}/>
                        </p>
                    </div>
                    <LangSwitcher lang={lang} onChange={setLang}/>
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
                                placeholder={stocksPageLabels.searchPlaceholder[lang]}
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30 transition-all"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap select-none">
                            <input
                                type="checkbox"
                                checked={npsOnly}
                                onChange={(e) => {
                                    setNpsOnly(e.target.checked);
                                    setCurrentPage(1);
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                            />
                            <I18nText dict={stocksPageLabels.npsFilterLabel} lang={lang}/>
                        </label>
                    </div>

                    <div
                        className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center"><I18nText dict={stocksPageLabels.colName} lang={lang}/></th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center"><I18nText dict={stocksPageLabels.colTicker} lang={lang}/></th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center"><I18nText dict={stocksPageLabels.colMarket} lang={lang}/></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {pagedStocks.length > 0 ? (
                                pagedStocks.map((stock) => (
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
                                        <td className="px-6 py-4 text-center">
                                                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                                    {stock.symbol}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
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
                                            <p className="text-sm"><I18nText dict={stocksPageLabels.noData} lang={lang}/></p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {filteredStocks.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                <I18nText
                                    dict={{
                                        ko: countSummary(filteredStocks.length.toLocaleString(), String((safePage - 1) * PAGE_SIZE + 1), String(Math.min(safePage * PAGE_SIZE, filteredStocks.length)), "ko"),
                                        en: countSummary(filteredStocks.length.toLocaleString(), String((safePage - 1) * PAGE_SIZE + 1), String(Math.min(safePage * PAGE_SIZE, filteredStocks.length)), "en"),
                                        ja: countSummary(filteredStocks.length.toLocaleString(), String((safePage - 1) * PAGE_SIZE + 1), String(Math.min(safePage * PAGE_SIZE, filteredStocks.length)), "ja"),
                                        zh: countSummary(filteredStocks.length.toLocaleString(), String((safePage - 1) * PAGE_SIZE + 1), String(Math.min(safePage * PAGE_SIZE, filteredStocks.length)), "zh"),
                                    }}
                                    lang={lang}
                                />
                            </p>

                            <nav className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                                    disabled={safePage === 1}
                                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <I18nText dict={stocksPageLabels.prev} lang={lang}/>
                                </button>

                                {pageNumbers[0] > 1 && (
                                    <span className="px-2 text-sm text-slate-400">…</span>
                                )}

                                {pageNumbers.map((page) => (
                                    <button
                                        type="button"
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                                            page === safePage
                                                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                                : "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                                    <span className="px-2 text-sm text-slate-400">…</span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                                    disabled={safePage === totalPages}
                                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <I18nText dict={stocksPageLabels.next} lang={lang}/>
                                </button>
                            </nav>
                        </div>
                    )}
                </section>
            </main>

            <Ticker/>
            <Footer/>
        </div>
    );
};

export default StockPage;

export const Head: HeadFC = () => <title>종목 검색</title>;