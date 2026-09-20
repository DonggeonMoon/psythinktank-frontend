import {useEffect, useState} from "react";
import {LANGS, type Lang} from "../i18n/stockLabels";

const STORAGE_KEY = "lang";

const isLang = (value: string | null): value is Lang => LANGS.some(({code}) => code === value);

export const useAutoLang = () => {
    const [lang, setLangState] = useState<Lang>("ko");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (isLang(saved)) {
                setLangState(saved);
                return;
            }
        } catch {
        }
        const browserLang = navigator.language?.toLowerCase() ?? "";
        if (browserLang.startsWith("ja")) setLangState("ja");
        else if (browserLang.startsWith("zh")) setLangState("zh");
        else if (!browserLang.startsWith("ko")) setLangState("en");
    }, []);

    const setLang = (next: Lang) => {
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
        }
    };

    return [lang, setLang] as const;
};
