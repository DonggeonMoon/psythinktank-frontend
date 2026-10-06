import * as React from "react";

const Ticker = () => {
    return (
        <section className="sticky bottom-0 z-40 overflow-hidden border-y border-slate-200 bg-slate-100 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div
                className="flex whitespace-nowrap"
                style={{
                    animation: "ticker 30s linear infinite",
                    width: "max-content",
                }}
            >
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-10 pr-10 text-sm text-slate-700 dark:text-slate-300"/>
                ))}
            </div>

            <style>
                {`
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}
            </style>
        </section>
    )
}

export default Ticker
