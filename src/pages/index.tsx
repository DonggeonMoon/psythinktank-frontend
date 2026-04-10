import * as React from "react";
import {graphql, type HeadFC, type PageProps} from "gatsby";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Ticker from "../components/Ticker";

export const query = graphql`
  query {
    korea: allStocksKoreaJson(sort: { growth: DESC }) {
      nodes {
        symbol
        market
        stock_name
        growth
        dividend
        recent_price
        price_growth
        basis_date
      }
    }
    usa: allStocksUsaJson(sort: { growth: DESC }) {
      nodes {
        symbol
        market
        stock_name
        growth
        dividend
        recent_price
        price_growth
        basis_date
      }
    }
    japan: allStocksJapanJson(sort: { growth: DESC }) {
      nodes {
        symbol
        market
        stock_name
        growth
        dividend
        recent_price
        price_growth
        basis_date
      }
    }
  }
`;

interface StockNode {
    symbol: string;
    market: string;
    stock_name: string;
    growth: number;
    dividend: number;
    recent_price: number;
    price_growth: number;
    basis_date: string;
}

interface DataProps {
    korea: { nodes: StockNode[] };
    usa: { nodes: StockNode[] };
    japan: { nodes: StockNode[] };
}

const IndexPage: React.FC<PageProps<DataProps>> = ({data}) => {
    const [selectedCountry, setSelectedCountry] = React.useState<'KR' | 'US' | 'JP'>('KR');

    const displayData = React.useMemo(() => {
        switch (selectedCountry) {
            case 'US':
                return {nodes: data.usa.nodes, unit: '$'};
            case 'JP':
                return {nodes: data.japan.nodes, unit: '¥'};
            default:
                return {nodes: data.korea.nodes, unit: '원'};
        }
    }, [selectedCountry, data]);

    const lastUpdateDate = displayData.nodes.length > 0 ? displayData.nodes[0].basis_date : "-";

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-12">
                <section className="space-y-6">
                    <div
                        className="flex items-end justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                                    성장성 Top 50
                                </h2>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {selectedCountry === 'KR' ? '국내' : selectedCountry === 'US' ? '미국' : '일본'} 우량 기업 리스트입니다.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedCountry('KR')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    selectedCountry === 'KR'
                                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                        : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                            >
                                🇰🇷 국내
                            </button>
                            <button
                                onClick={() => setSelectedCountry('US')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    selectedCountry === 'US'
                                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                        : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                            >
                                🇺🇸 미국
                            </button>
                            <button
                                onClick={() => setSelectedCountry('JP')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    selectedCountry === 'JP'
                                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                        : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                            >
                                🇯🇵 일본
                            </button>
                        </div>
                    </div>

                    <div
                        className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden shadow-sm">
                        <div
                            className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/50 px-6 py-4 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1">순위</div>
                            <div className="col-span-3">기업명 / 티커</div>
                            <div className="col-span-2 text-right">성장률</div>
                            <div className="col-span-2 text-right">주당 배당금</div>
                            <div className="col-span-2 text-right">현재가 ({lastUpdateDate} 종가)</div>
                            <div className="col-span-2 text-right">연간 가격 증감률</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {displayData.nodes.length > 0 ? (
                                displayData.nodes.map((stock, index) => (
                                    <div key={stock.symbol}
                                         className="grid grid-cols-12 gap-4 px-6 py-5 text-sm items-center hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-all">
                                        <div
                                            className="col-span-1 font-mono font-bold text-slate-400 dark:text-slate-600">
                                            {index + 1}
                                        </div>
                                        <div className="col-span-3 flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {stock.stock_name}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-slate-400 font-mono tracking-tighter">
                                                    {stock.symbol}
                                                </span>
                                                <span
                                                    className="h-2 w-[1px] bg-slate-200 dark:bg-slate-700"/> {/* 구분선 */}
                                                <span
                                                    className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                                                    {stock.market}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="col-span-2 text-right font-black text-emerald-600 dark:text-emerald-500">
                                            +{Number(stock.growth).toFixed(2)}%
                                        </div>
                                        <div
                                            className="col-span-2 text-right font-mono font-medium text-slate-700 dark:text-slate-200">
                                            {stock.dividend.toLocaleString()}{displayData.unit}
                                        </div>
                                        <div
                                            className="col-span-2 text-right font-mono font-medium text-slate-700 dark:text-slate-200">
                                            {stock.recent_price ? stock.recent_price.toLocaleString() : '0'}{displayData.unit}
                                        </div>
                                        <div className="col-span-2 text-right font-semibold text-rose-500">
                                            {stock.price_growth}%
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-32 text-center text-slate-400 italic">데이터가 없습니다.</div>
                            )}
                        </div>
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