// 빌드 서버(UTC)와 브라우저 타임존이 달라 hydration 시 날짜가 어긋나지 않도록 KST로 고정한다.
const dateFormatter = new Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit"});

export const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    return dateFormatter.format(new Date(iso)).replace(/-/g, ".");
};
