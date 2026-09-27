import {useEffect} from "react";

interface SavedScroll {
    key: string;
    y: number;
}

/**
 * 히스토리 엔트리(location.key) 단위로 스크롤 위치를 저장해, 뒤로가기로 같은 엔트리에 돌아왔을 때만 복원한다.
 * 링크로 새로 진입하면 key가 달라지므로 복원하지 않는다.
 */
export const useScrollRestore = (storageKey: string, locationKey: string | undefined, pathname: string) => {
    useEffect(() => {
        const key = locationKey ?? "initial";

        let saved: SavedScroll | null = null;
        try {
            const raw = sessionStorage.getItem(storageKey);
            if (raw) saved = JSON.parse(raw) as SavedScroll;
        } catch {
        }

        let frame = 0;
        const handleScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                // 다른 페이지로 이동하며 발생하는 스크롤(맨 위로 초기화)이 저장값을 덮어쓰지 않도록 경로를 확인한다.
                if (window.location.pathname !== pathname) return;
                try {
                    sessionStorage.setItem(storageKey, JSON.stringify({key, y: window.scrollY}));
                } catch {
                }
            });
        };

        // Gatsby 기본 스크롤 처리와 persisted state 복원 렌더가 끝난 뒤에 적용되도록 한 프레임 미룬다.
        const restoreFrame = saved && saved.key === key
            ? requestAnimationFrame(() => window.scrollTo(0, saved!.y))
            : 0;

        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(frame);
            cancelAnimationFrame(restoreFrame);
        };
    }, [storageKey, locationKey, pathname]);
};
