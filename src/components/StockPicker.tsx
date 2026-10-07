import * as React from "react";
import {useMemo, useState} from "react";
import {MAX_RELATED_STOCKS} from "../lib/relatedPosts";
import {useLang} from "../contexts/LangContext";
import {boardEditorLabels, maxStocksReached, removeStockAriaLabel} from "../i18n/pageLabels";

export interface PickableStock {
    symbol: string | null;
    stock_name: string | null;
    market: string | null;
}

interface StockPickerProps {
    stocks: PickableStock[];
    value: string[];
    onChange: (symbols: string[]) => void;
}

const MAX_SUGGESTIONS = 10;

const StockPicker: React.FC<StockPickerProps> = ({stocks, value, onChange}) => {
    const {lang} = useLang();
    const [term, setTerm] = useState("");

    const bySymbol = useMemo(() => new Map(stocks.map((s) => [s.symbol, s])), [stocks]);

    const suggestions = useMemo(() => {
        const lower = term.toLowerCase().trim();
        if (!lower) return [];

        const rank = (s: PickableStock) => {
            const symbol = s.symbol?.toLowerCase() ?? "";
            if (symbol === lower) return 3;
            if (symbol.startsWith(lower)) return 2;
            if (s.stock_name?.toLowerCase().startsWith(lower)) return 1;
            return 0;
        };

        return stocks
            .filter(
                (s) =>
                    !!s.symbol &&
                    !value.includes(s.symbol) &&
                    (s.symbol.toLowerCase().includes(lower) || s.stock_name?.toLowerCase().includes(lower))
            )
            .sort((a, b) => rank(b) - rank(a))
            .slice(0, MAX_SUGGESTIONS);
    }, [term, stocks, value]);

    const isFull = value.length >= MAX_RELATED_STOCKS;

    const add = (symbol: string) => {
        if (isFull || value.includes(symbol)) return;
        onChange([...value, symbol]);
        setTerm("");
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {boardEditorLabels.relatedStocks[lang]} <span className="text-slate-400">({value.length}/{MAX_RELATED_STOCKS})</span>
            </p>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((symbol) => {
                        const stock = bySymbol.get(symbol);
                        return (
                            <span
                                key={symbol}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            >
                                {stock?.stock_name ?? symbol}
                                <span className="text-xs text-slate-400">{symbol}</span>
                                <button
                                    type="button"
                                    onClick={() => onChange(value.filter((s) => s !== symbol))}
                                    className="text-slate-400 hover:text-red-500"
                                    aria-label={removeStockAriaLabel(symbol, lang)}
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            <div className="relative">
                <input
                    type="text"
                    placeholder={isFull ? maxStocksReached(MAX_RELATED_STOCKS, lang) : boardEditorLabels.stockSearchPlaceholder[lang]}
                    value={term}
                    disabled={isFull}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (suggestions[0]?.symbol) add(suggestions[0].symbol);
                        }
                    }}
                    className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        {suggestions.map((s) => (
                            <li key={s.symbol}>
                                <button
                                    type="button"
                                    onClick={() => s.symbol && add(s.symbol)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30">
                                        {s.market}
                                    </span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{s.stock_name}</span>
                                    <span className="text-slate-400">{s.symbol}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StockPicker;
