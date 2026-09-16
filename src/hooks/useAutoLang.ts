import {useEffect, useState} from "react";
import type {Lang} from "../i18n/stockLabels";

export const useAutoLang = () => {
    const [lang, setLang] = useState<Lang>("ko");

    useEffect(() => {
        const browserLang = navigator.language?.toLowerCase() ?? "";
        if (browserLang.startsWith("ja")) setLang("ja");
        else if (browserLang.startsWith("zh")) setLang("zh");
        else if (!browserLang.startsWith("ko")) setLang("en");
    }, []);

    return [lang, setLang] as const;
};
