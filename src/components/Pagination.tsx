import * as React from "react";
import {useMemo} from "react";
import I18nText from "./I18nText";
import {countSummary, paginationLabels} from "../i18n/pageLabels";
import type {Lang} from "../i18n/stockLabels";

interface PaginationProps {
    total: number;
    page: number;
    pageSize: number;
    onChange: (page: number) => void;
    lang: Lang;
}

const WINDOW_SIZE = 5;

const Pagination: React.FC<PaginationProps> = ({total, page, pageSize, onChange, lang}) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const pageNumbers = useMemo(() => {
        const start = Math.max(1, page - Math.floor(WINDOW_SIZE / 2));
        const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
        const adjustedStart = Math.max(1, end - WINDOW_SIZE + 1);
        return Array.from({length: end - adjustedStart + 1}, (_, i) => adjustedStart + i);
    }, [page, totalPages]);

    if (total === 0) return null;

    const from = String((page - 1) * pageSize + 1);
    const to = String(Math.min(page * pageSize, total));
    const totalLabel = total.toLocaleString();

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                <I18nText
                    dict={{
                        ko: countSummary(totalLabel, from, to, "ko"),
                        en: countSummary(totalLabel, from, to, "en"),
                        ja: countSummary(totalLabel, from, to, "ja"),
                        zh: countSummary(totalLabel, from, to, "zh"),
                    }}
                    lang={lang}
                />
            </p>

            <nav className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                    <I18nText dict={paginationLabels.prev} lang={lang}/>
                </button>

                {pageNumbers[0] > 1 && (
                    <span className="px-2 text-sm text-slate-400">…</span>
                )}

                {pageNumbers.map((n) => (
                    <button
                        type="button"
                        key={n}
                        onClick={() => onChange(n)}
                        className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                            n === page
                                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                : "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                    >
                        {n}
                    </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <span className="px-2 text-sm text-slate-400">…</span>
                )}

                <button
                    type="button"
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                    <I18nText dict={paginationLabels.next} lang={lang}/>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
