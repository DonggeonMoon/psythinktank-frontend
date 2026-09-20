import {useCallback, useEffect, useState} from "react";

type Storage = "session" | "local";

const getStorage = (kind: Storage) => (kind === "local" ? window.localStorage : window.sessionStorage);

/**
 * SSR 하이드레이션 불일치를 피하려고 초기 렌더는 initial로 두고, 마운트 직후 저장된 값을 복원한다.
 * 저장은 값을 바꾸는 시점에만 하므로 복원 전에 initial이 저장값을 덮어쓰지 않는다.
 */
export const usePersistedState = <T,>(key: string, initial: T, kind: Storage = "session") => {
    const [value, setValue] = useState<T>(initial);

    useEffect(() => {
        try {
            const raw = getStorage(kind).getItem(key);
            if (raw !== null) setValue(JSON.parse(raw) as T);
        } catch {
        }
    }, [key, kind]);

    const set = useCallback((next: T) => {
        setValue(next);
        try {
            getStorage(kind).setItem(key, JSON.stringify(next));
        } catch {
        }
    }, [key, kind]);

    return [value, set] as const;
};
