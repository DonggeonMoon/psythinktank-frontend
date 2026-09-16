import * as React from "react";
import type {Lang} from "../i18n/stockLabels";

interface I18nTextProps {
    dict: Record<Lang, React.ReactNode>;
    lang: Lang;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

/**
 * Renders all four language variants in the DOM at once (so build-time static
 * HTML always contains every language for crawlers) and hides the inactive
 * ones with CSS instead of conditionally rendering only the selected one.
 */
const I18nText: React.FC<I18nTextProps> = ({dict, lang, className, as = "span"}) => {
    const Tag = as as React.ElementType;
    return (
        <>
            {(Object.keys(dict) as Lang[]).map((code) => (
                <Tag key={code} lang={code} className={[className, code === lang ? "" : "hidden"].filter(Boolean).join(" ")}>
                    {dict[code]}
                </Tag>
            ))}
        </>
    );
};

export default I18nText;
