import * as React from "react";
import {graphql, type HeadFC, type PageProps} from "gatsby";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Ticker from "../components/Ticker";

export const query = graphql`
  query($symbol: String!) {
    stockDetail(symbol: { eq: $symbol }) {
      symbol
      market
      stock_name
      growth
      dividend
      recent_price
      basis_date
    }
    allShareholder(filter: { symbol: { eq: $symbol } }, sort: { date: DESC }) {
      nodes {
        id
        date
        holder_name
        value
      }
    }
  }
`;

interface StockDetailData {
    symbol: string;
    market: string;
    stock_name: string;
    growth: number | null;
    dividend: number | null;
    recent_price: number | null;
    basis_date: string | null;
}

interface ShareholderNode {
    id: string;
    date: string;
    holder_name: string;
    value: number;
}

interface DataProps {
    stockDetail: StockDetailData | null;
    allShareholder: { nodes: ShareholderNode[] };
}

const getCurrency = (market: string) => {
    if (market === "KOSPI" || market === "KOSDAQ") return "원";
    if (market === "TSE") return "¥";
    return "$";
};

const StockDetailPage: React.FC<PageProps<DataProps>> = ({data}) => {
    const stock = data.stockDetail;
    const shareholders = data.allShareholder.nodes;

    if (!stock) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1 p-10 text-center text-slate-500 dark:text-slate-400">
                    종목 정보를 찾을 수 없습니다.
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Header/>
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-12">
                <header className="border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div className="flex items-baseline gap-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wider bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                            {stock.market}
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight">{stock.stock_name}</h1>
                        <span className="text-2xl text-slate-400 font-light">{stock.symbol}</span>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-slate-500">최근 종가</p>
                            {stock.basis_date && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {stock.basis_date} 기준
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">
                                {stock.recent_price != null ? stock.recent_price.toLocaleString() : "N/A"}
                            </span>
                            {stock.recent_price != null && (
                                <span className="text-slate-400 text-sm font-medium">{getCurrency(stock.market)}</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-500 mb-2">성장률</p>
                        {stock.growth != null ? (
                            <div className={`text-3xl font-bold ${stock.growth > 0 ? "text-red-500" : stock.growth < 0 ? "text-blue-500" : ""}`}>
                                {stock.growth > 0 ? "▲" : stock.growth < 0 ? "▼" : ""} {Math.abs(stock.growth).toFixed(2)}%
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-slate-300 dark:text-slate-700 font-mono">N/A</div>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-500 mb-2">주당 배당금</p>
                        {stock.dividend != null && stock.dividend > 0 ? (
                            <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400">
                                <span className="text-3xl font-bold">{stock.dividend.toLocaleString()}</span>
                                <span className="text-sm font-medium">{getCurrency(stock.market)}</span>
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-slate-300 dark:text-slate-700 font-mono">N/A</div>
                        )}
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold px-1">주주 정보</h3>
                    {shareholders.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">기준일</th>
                                    <th className="px-6 py-4 font-semibold">주주명</th>
                                    <th className="px-6 py-4 text-right font-semibold">지분</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {shareholders.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.date}</td>
                                        <td className="px-6 py-4 font-medium">{item.holder_name}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-slate-100">
                                            {item.value.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
                            등록된 주주 정보가 없습니다.
                        </div>
                    )}
                </section>
            </main>
            <Ticker/>
            <Footer/>
        </div>
    );
};

export default StockDetailPage;

export const Head: HeadFC<DataProps> = ({data}) => (
    <title>{data.stockDetail ? `${data.stockDetail.stock_name} (${data.stockDetail.symbol})` : "종목 상세"} | PSY Thinktank</title>
);
