import * as React from "react";
import {LANGS, type Lang} from "../i18n/stockLabels";

interface LangSwitcherProps {
    lang: Lang;
    onChange: (lang: Lang) => void;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({lang, onChange}) => (
    <div className="flex gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800">
        {LANGS.map(({code, label, flag}) => (
            <button
                key={code}
                type="button"
                onClick={() => onChange(code)}
                aria-pressed={lang === code}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    lang === code
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
                <span>{flag}</span>
                <span>{label}</span>
            </button>
        ))}
    </div>
);

export default LangSwitcher;
