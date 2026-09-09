import * as React from "react";
import type {HeadFC, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {useEffect, useMemo, useState} from "react";
import Ticker from "../../components/Ticker";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import {db} from "../../firebase/client";
import {useAuth} from "../../contexts/AuthContext";
import {isStaffRole} from "../../lib/roles";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

interface PerformanceEntry {
    id: string;
    year: number;
    stockName: string;
    returnRate: number;
}

interface YearGroup {
    year: number;
    dataPoints: { label: string; y: number }[];
}

const inputClass =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";

const PerformancePage: React.FC<PageProps> = () => {
    const {profile} = useAuth();
    const canManage = isStaffRole(profile?.role);

    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const updateIsDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        updateIsDark();

        const observer = new MutationObserver(updateIsDark);
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
        return () => observer.disconnect();
    }, []);

    const [entries, setEntries] = useState<PerformanceEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const [formYear, setFormYear] = useState("");
    const [formStock, setFormStock] = useState("");
    const [formRate, setFormRate] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadEntries = async () => {
        if (!db) return;
        const snapshot = await getDocs(query(collection(db, "performance"), orderBy("year", "asc")));
        setEntries(
            snapshot.docs.map((d) => {
                const data = d.data();
                return {
                    id: d.id,
                    year: data.year,
                    stockName: data.stockName,
                    returnRate: data.returnRate,
                };
            })
        );
        setLoading(false);
    };

    useEffect(() => {
        loadEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const yearGroups: YearGroup[] = useMemo(() => {
        const byYear = new Map<number, PerformanceEntry[]>();
        entries.forEach((e) => {
            const list = byYear.get(e.year) ?? [];
            list.push(e);
            byYear.set(e.year, list);
        });

        return Array.from(byYear.entries())
            .sort(([a], [b]) => a - b)
            .map(([year, list]) => ({
                year,
                dataPoints: list.map((e) => ({
                    label: e.returnRate === 0 ? `${e.stockName}[보유중]` : e.stockName,
                    y: e.returnRate,
                })),
            }));
    }, [entries]);

    const chartInstances = React.useRef<Map<string, Chart>>(new Map());

    useEffect(() => {
        const textColor = isDark ? "#f1f5f9" : "#0f172a"
        const gridColor = isDark ? "rgba(148, 163, 184, 0.15)" : "rgba(15, 23, 42, 0.08)"
        // 종목마다 겹치지 않는 색을 뽑기 위해 골든 앵글로 hue를 회전시킨다(종목 수와 무관하게 고르게 분산됨).
        const barColor = (i: number) => `hsl(${(i * 137.508) % 360} 65% ${isDark ? 60 : 48}%)`

        yearGroups.forEach((d) => {
            const containerId = `chart-${d.year}`
            const canvas = document.getElementById(containerId) as HTMLCanvasElement | null
            if (!canvas) return

            chartInstances.current.get(containerId)?.destroy()

            const chart = new Chart(canvas, {
                type: "bar",
                data: {
                    labels: d.dataPoints.map((p) => p.label),
                    datasets: [
                        {
                            label: `${d.year} 년 수익률(%)`,
                            data: d.dataPoints.map((p) => p.y),
                            backgroundColor: d.dataPoints.map((_, i) => barColor(i)),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {display: false},
                        title: {
                            display: true,
                            text: `${d.year} 년 PSY THINKTANK 수익률(%)`,
                            color: textColor,
                            font: {size: 18},
                        },
                    },
                    scales: {
                        x: {
                            ticks: {color: textColor, maxRotation: 0, minRotation: 0},
                            grid: {color: gridColor},
                        },
                        y: {
                            beginAtZero: true,
                            title: {display: true, text: "%", color: textColor},
                            ticks: {color: textColor},
                            grid: {color: gridColor},
                        },
                    },
                },
            })

            chartInstances.current.set(containerId, chart)
        })

        return () => {
            chartInstances.current.forEach((chart) => chart.destroy())
            chartInstances.current.clear()
        }
    }, [yearGroups, isDark])

    const summary = useMemo(() => {
        const realized = entries.map((e) => e.returnRate).filter((v) => v !== 0)
        const max = realized.length ? Math.max(...realized) : 0
        const avg = realized.length ? realized.reduce((a, b) => a + b, 0) / realized.length : 0
        return { max, avg }
    }, [entries])

    const resetForm = () => {
        setFormYear("");
        setFormStock("");
        setFormRate("");
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        if (!formYear) {
            window.alert("연도를 입력해주세요.");
            return;
        }
        if (!formStock.trim()) {
            window.alert("종목명을 입력해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                year: Number(formYear),
                stockName: formStock.trim(),
                returnRate: formRate === "" ? 0 : Number(formRate),
                updatedAt: serverTimestamp(),
            };

            if (editingId) {
                await updateDoc(doc(db, "performance", editingId), payload);
            } else {
                await addDoc(collection(db, "performance"), {
                    ...payload,
                    createdAt: serverTimestamp(),
                });
            }
            resetForm();
            await loadEntries();
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (entry: PerformanceEntry) => {
        setEditingId(entry.id);
        setFormYear(String(entry.year));
        setFormStock(entry.stockName);
        setFormRate(String(entry.returnRate));
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        if (!window.confirm("이 항목을 삭제하시겠습니까?")) return;

        await deleteDoc(doc(db, "performance", id));
        if (editingId === id) resetForm();
        await loadEntries();
    };

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
                            {yearGroups.length
                                ? `${yearGroups[0].year}-${yearGroups[yearGroups.length - 1].year}`
                                : "-"}
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

                {canManage && (
                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">실적 데이터 관리</h2>

                        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">연도</label>
                                <input
                                    type="number"
                                    value={formYear}
                                    onChange={(e) => setFormYear(e.target.value)}
                                    className={`${inputClass} w-24`}
                                    placeholder="2026"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">종목</label>
                                <input
                                    type="text"
                                    value={formStock}
                                    onChange={(e) => setFormStock(e.target.value)}
                                    className={`${inputClass} w-40`}
                                    placeholder="종목명"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">수익률(%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formRate}
                                    onChange={(e) => setFormRate(e.target.value)}
                                    className={`${inputClass} w-28`}
                                    placeholder="0=보유중"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                            >
                                {editingId ? "수정 저장" : "추가"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
                                >
                                    취소
                                </button>
                            )}
                        </form>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        <th className="py-2 pr-4">연도</th>
                                        <th className="py-2 pr-4">종목</th>
                                        <th className="py-2 pr-4">수익률</th>
                                        <th className="py-2 pr-4 text-right">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[...entries]
                                        .sort((a, b) => b.year - a.year)
                                        .map((entry) => (
                                            <tr key={entry.id}>
                                                <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{entry.year}</td>
                                                <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{entry.stockName}</td>
                                                <td className="py-2 pr-4 font-mono text-slate-700 dark:text-slate-300">{entry.returnRate}%</td>
                                                <td className="py-2 pr-4 text-right">
                                                    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
                                                        <button
                                                            onClick={() => startEdit(entry)}
                                                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                        >
                                                            수정
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                <section className="space-y-6">
                    {loading ? (
                        <p className="text-sm text-slate-400">불러오는 중...</p>
                    ) : yearGroups.length === 0 ? (
                        <p className="text-sm text-slate-400">등록된 성과 데이터가 없습니다.</p>
                    ) : (
                        yearGroups.map((d) => (
                            <div
                                key={d.year}
                                className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
                            >
                                <div className="relative border-b border-slate-200 dark:border-slate-800">
                                    <div className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {d.year}년
                                        </div>
                                    </div>
                                </div>

                                <div className="relative px-4 py-4">
                                    <div className="relative mx-auto" style={{maxWidth: 1200, height: 320}}>
                                        <canvas id={`chart-${d.year}`}/>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>

            <Ticker/>

            <Footer />
        </div>
    )
}

export default PerformancePage

export const Head: HeadFC = () => <title>성과</title>
