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
                    <div key={i} className="flex items-center gap-10 pr-10 text-sm text-slate-700 dark:text-slate-300">
                        {/*<span>삼성전자 +0.40%</span>*/}
                        {/*<span>SK하이닉스 +1.12%</span>*/}
                        {/*<span>현대차 -0.35%</span>*/}
                        {/*<span>LG에너지솔루션 +0.88%</span>*/}
                        {/*<span>네이버 -0.21%</span>*/}
                        {/*<span>카카오 +0.57%</span>*/}
                        {/*<span>셀트리온 -0.66%</span>*/}
                        {/*<span>POSCO홀딩스 +0.19%</span>*/}
                        {/*<span>AAPL +1.25%</span>*/}
                        {/*<span>MSFT +0.62%</span>*/}
                        {/*<span>NVDA +2.10%</span>*/}
                        {/*<span>TSLA -0.85%</span>*/}
                        {/*<span>7203.T -1.02%</span>*/}
                        {/*<span>9984.T -0.36%</span>*/}
                    </div>
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
