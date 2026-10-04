import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {db} from "../firebase/client";
import {fetchRelatedSymbols} from "../lib/relatedPosts";
import I18nText from "./I18nText";
import AnimatedGradientBorder from "./AnimatedGradientBorder";
import {boardDetailLabels} from "../i18n/pageLabels";
import {getCurrency} from "../i18n/stockLabels";
import {useLang} from "../contexts/LangContext";

export interface RelatedStock {
    symbol: string;
    stock_name: string | null;
    market: string | null;
    recent_price: number | null;
    growth: number | null;
}

interface RelatedStocksProps {
    postId: string;
    // 빌드 시점 스냅샷. 종목 시세 정보는 정적 데이터에만 있어서 빌드 이후 연결된 종목은 코드만 표시된다.
    initialStocks: RelatedStock[];
}

const RelatedStocks: React.FC<RelatedStocksProps> = ({postId, initialStocks}) => {
    const {lang} = useLang();
    const [symbols, setSymbols] = useState<string[]>(initialStocks.map((s) => s.symbol));

    useEffect(() => {
        if (!db) return;
        fetchRelatedSymbols(db, postId).then(setSymbols).catch(() => {});
    }, [postId]);

    if (symbols.length === 0) return null;

    const bySymbol = new Map(initialStocks.map((s) => [s.symbol, s]));

    return (
        <section className="space-y-3 border-t border-slate-100 pt-8 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                <I18nText dict={boardDetailLabels.relatedStocks} lang={lang}/>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symbols.map((symbol) => {
                    const stock = bySymbol.get(symbol);
                    return (
                        <li key={symbol}>
                            <Link
                                to={`/stocks/${symbol}`}
                                className="animated-gradient-border flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 [--gradient-border-size:240px] dark:bg-slate-900/50"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        {stock?.market && (
                                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30">
                                                {stock.market}
                                            </span>
                                        )}
                                        <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                                            {stock?.stock_name ?? symbol}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">{symbol}</span>
                                </div>
                                {stock && (
                                    <div className="shrink-0 text-right text-sm">
                                        {stock.recent_price != null && (
                                            <div className="font-bold text-slate-900 dark:text-slate-100">
                                                {stock.recent_price.toLocaleString()}
                                                <span className="ml-0.5 text-xs font-medium text-slate-400">{getCurrency(stock.market, lang)}</span>
                                            </div>
                                        )}
                                        {stock.growth != null && (
                                            <div className={`text-xs font-semibold ${stock.growth > 0 ? "text-red-500" : stock.growth < 0 ? "text-blue-500" : "text-slate-500"}`}>
                                                {stock.growth > 0 ? "▲" : stock.growth < 0 ? "▼" : ""} {Math.abs(stock.growth).toFixed(2)}%
                                            </div>
                                        )}
                                    </div>
                                )}
                                <AnimatedGradientBorder/>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default RelatedStocks;
