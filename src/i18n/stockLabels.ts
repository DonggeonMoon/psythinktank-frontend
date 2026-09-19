export type Lang = "ko" | "en" | "ja" | "zh";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
    {code: "ko", label: "한국어", flag: "🇰🇷"},
    {code: "en", label: "EN", flag: "🇺🇸"},
    {code: "ja", label: "日本語", flag: "🇯🇵"},
    {code: "zh", label: "中文", flag: "🇨🇳"},
];

type Dict = Record<Lang, string>;

export const stockLabels = {
    recentPrice: {ko: "최근 종가", en: "Recent Closing Price", ja: "直近終値", zh: "最近收盘价"},
    growthRate: {ko: "성장률", en: "Growth Rate", ja: "成長率", zh: "增长率"},
    dividendPerShare: {ko: "주당 배당금", en: "Dividend per Share", ja: "1株配当", zh: "每股股息"},
    none: {ko: "없음", en: "N/A", ja: "なし", zh: "无"},
    npsHolding: {ko: "국민연금공단 보유", en: "NPS Holding", ja: "国民年金公団保有", zh: "韩国国民年金公团持股"},
    shareholderTrend: {ko: "주주 지분 변화 추이", en: "Shareholder Stake Trend", ja: "株主持分推移", zh: "股东持股变化趋势"},
    noChartData: {
        ko: "차트를 그릴 데이터가 없습니다.",
        en: "No data available to draw a chart.",
        ja: "チャートを描くデータがありません。",
        zh: "没有可用于绘制图表的数据。",
    },
    shareholderInfo: {ko: "주주 정보", en: "Shareholder Information", ja: "株主情報", zh: "股东信息"},
    baseDate: {ko: "기준일", en: "Date", ja: "基準日", zh: "基准日"},
    shareholderName: {ko: "주주명", en: "Shareholder", ja: "株主名", zh: "股东名称"},
    stake: {ko: "지분", en: "Stake", ja: "持分", zh: "股份"},
    stakePercent: {ko: "지분(%)", en: "Stake (%)", ja: "持分(%)", zh: "股份(%)"},
    noShareholderInfo: {
        ko: "등록된 주주 정보가 없습니다.",
        en: "No shareholder information registered.",
        ja: "登録された株主情報がありません。",
        zh: "没有已登记的股东信息。",
    },
    overview: {ko: "기업 개요", en: "Company Overview", ja: "企業概要", zh: "公司概况"},
    investorTrend: {ko: "주주 수 변화 추이", en: "Shareholder Count Trend", ja: "株主数推移", zh: "股东人数变化趋势"},
    investorCount: {ko: "주주 수", en: "Shareholders", ja: "株主数", zh: "股东人数"},
    avgPrice: {ko: "평균 단가", en: "Average Price", ja: "平均単価", zh: "平均成本价"},
    notFound: {ko: "종목 정보를 찾을 수 없습니다.", en: "Stock information not found.", ja: "銘柄情報が見つかりません。", zh: "未找到股票信息。"},
    krw: {ko: "원", en: "KRW", ja: "ウォン", zh: "韩元"},
} satisfies Record<string, Dict>;

export const rankLabel: Record<Lang, (n: number) => string> = {
    ko: (n) => `${n}위`,
    en: (n) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`,
    ja: (n) => `${n}位`,
    zh: (n) => `第${n}名`,
};

export const asOfDate = (date: string, lang: Lang): string => {
    switch (lang) {
        case "en":
            return `as of ${date}`;
        case "ja":
            return `${date}時点`;
        case "zh":
            return `截至${date}`;
        default:
            return `${date} 기준`;
    }
};
