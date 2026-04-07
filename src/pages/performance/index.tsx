import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {useEffect, useMemo, useState} from "react";
import Ticker from "../../components/Ticker";

type DataPoint = { label: string; y: number }
type YearPerformance = {
    year: number
    title: string
    note: string
    dataPoints: DataPoint[]
}

declare global {
    interface Window {
        CanvasJS?: any
    }
}

const PerformancePage: React.FC<PageProps> = () => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("theme")
        if (saved === "dark") {
            document.documentElement.classList.add("dark")
            setIsDark(true)
        }
    }, [])

    const datasets: YearPerformance[] = useMemo(
        () => [
            {
                year: 2019,
                title: "2019 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "2019년 추천주식 모두 차익실현 완료",
                dataPoints: [
                    { label: "일지테크", y: 70 },
                    { label: "ISC", y: 27 },
                    { label: "화신", y: 34 },
                    { label: "GH신소재", y: 51 },
                    { label: "HDC아이콘트롤스", y: 56 },
                    { label: "코스맥스엔비티", y: 28 },
                ],
            },
            {
                year: 2020,
                title: "2020 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "2020년 추천주식 모두 차익실현 완료",
                dataPoints: [
                    { label: "동우팜투테이블", y: 31.47 },
                    { label: "새로닉스", y: 70 },
                    { label: "한세실업", y: 54 },
                    { label: "한국토지신탁", y: 30 },
                    { label: "티에이치엔", y: 71.63 },
                    { label: "인터엠", y: 36.78 },
                    { label: "레이언스", y: 23.88 },
                    { label: "CJ프레시웨이", y: 86.43 },
                ],
            },
            {
                year: 2021,
                title: "2021 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "현재 4종목 보유중",
                dataPoints: [
                    { label: "코스맥스비티아이[보유중]", y: 0 },
                    { label: "알리코제약[보유중]", y: 0 },
                    { label: "남화토건", y: 48.22 },
                    { label: "KCI[보유중]", y: 0 },
                    { label: "우리넷[보유중]", y: 0 },
                    { label: "메카로", y: 22.34 },
                    { label: "브이원텍", y: 48.92 },
                    { label: "화성산업", y: 31.65 },
                ],
            },
            {
                year: 2022,
                title: "2022 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "현재 4종목 보유중",
                dataPoints: [
                    { label: "유신", y: 32.28 },
                    { label: "휴메딕스", y: 29.4 },
                    { label: "현대퓨처넷", y: 29.6 },
                    { label: "휴네시온[보유중]", y: 0 },
                    { label: "브이원텍", y: 31.55 },
                    { label: "SGC에너지[보유중]", y: 0 },
                    { label: "코웰패션", y: 50.42 },
                    { label: "세이브존I&C[보유중]", y: 0 },
                ],
            },
            {
                year: 2023,
                title: "2023 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "현재 3종목 보유중",
                dataPoints: [
                    { label: "사람인에이치알[보유중]", y: 0 },
                    { label: "CJ대한통운", y: 53.22 },
                    { label: "대상[보유중]", y: 0 },
                    { label: "모나리자[보유중]", y: 0 },
                    { label: "헥토파이낸셜", y: 33.57 },
                ],
            },
            {
                year: 2024,
                title: "2024 년 PSY THINKTANK 수익률(%)",
                fontColor: isDark ? "#ffffff" : "#0f172a",
                note: "현재 4종목 보유중",
                dataPoints: [
                    { label: "톱텍[보유중]", y: 0 },
                    { label: "엠투아이[보유중]", y: 0 },
                    { label: "회원공개[보유중]", y: 0 },
                    { label: "회원공개[보유중]", y: 0 },
                ],
            },
        ],
        []
    )

    useEffect(() => {
        const scriptId = "canvasjs-cdn"

        const renderAll = () => {
            if (!window.CanvasJS) return

            datasets.forEach((d) => {
                const containerId = `chart-${d.year}`
                const chart = new window.CanvasJS.Chart(containerId, {
                    animationEnabled: true,
                    backgroundColor: "transparent",
                    title: {
                        text: d.title,
                        fontSize: 18,
                    },
                    axisY: {
                        title: "%",
                        includeZero: true,
                    },
                    toolTip: {
                        shared: false,
                    },
                    data: [
                        {
                            type: "column",
                            dataPoints: d.dataPoints,
                        },
                    ],
                })

                chart.render()
            })
        }

        const existing = document.getElementById(scriptId) as HTMLScriptElement | null
        if (existing) {
            if (window.CanvasJS) renderAll()
            else existing.addEventListener("load", renderAll, { once: true })
            return
        }

        const script = document.createElement("script")
        script.id = scriptId
        script.src = "https://cdn.canvasjs.com/canvasjs.min.js"
        script.defer = true
        script.onload = renderAll
        document.body.appendChild(script)

        return () => {
            // 차트 라이브러리는 전역 로드라 굳이 제거 안 함
        }
    }, [datasets])

    const summary = useMemo(() => {
        const all = datasets.flatMap((d) => d.dataPoints.map((p) => p.y))
        const realized = all.filter((v) => v !== 0)
        const max = realized.length ? Math.max(...realized) : 0
        const avg = realized.length ? realized.reduce((a, b) => a + b, 0) / realized.length : 0
        const countYears = datasets.length
        return { max, avg, countYears }
    }, [datasets])

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        성과
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        연도별 추천 종목 수익률(%) 요약과 차트
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-xs text-slate-500 dark:text-slate-400">기간</div>
                        <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {datasets[0].year}-{datasets[datasets.length - 1].year}
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-xs text-slate-500 dark:text-slate-400">최대 단일 종목 수익률</div>
                        <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {summary.max ? `${summary.max.toFixed(2)}%` : "-"}
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-xs text-slate-500 dark:text-slate-400">평균(0 제외)</div>
                        <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {summary.avg ? `${summary.avg.toFixed(2)}%` : "-"}
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    {datasets.map((d) => (
                        <div
                            key={d.year}
                            className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
                        >
                            <div className="relative border-b border-slate-200 dark:border-slate-800">
                                <div className="px-6 py-4">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {d.year}년
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {d.note}
                                    </div>
                                </div>
                            </div>

                            <div className="relative px-4 py-4">
                                <div
                                    id={`chart-${d.year}`}
                                    className="w-full"
                                    style={{
                                        height: 320,
                                        maxWidth: 1200,
                                        margin: "0 auto",
                                    }}
                                />

                                <div className="pointer-events-none absolute left-6 top-6 rounded-md border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-300">
                                    {d.note}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <Ticker/>

            <Footer />
        </div>
    )
}

export default PerformancePage

export const Head: HeadFC = () => <title>성과</title>