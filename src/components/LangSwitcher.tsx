import * as React from "react";
import {LANGS} from "../i18n/stockLabels";
import {useLang} from "../contexts/LangContext";

const LangSwitcher = () => {
    const {lang, setLang} = useLang();
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const current = LANGS.find(({code}) => code === lang) ?? LANGS[0];

    React.useEffect(() => {
        if (!open) return;
        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Language"
                className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
            >
                <span>{current.flag}</span>
                <span>{current.label}</span>
            </button>
            {open && (
                <ul
                    role="listbox"
                    className="absolute right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                    {LANGS.map(({code, label, flag}) => (
                        <li key={code}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={lang === code}
                                onClick={() => {
                                    setLang(code);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                                    lang === code
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span>{flag}</span>
                                <span>{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LangSwitcher;
