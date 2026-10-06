import * as React from "react";
import {Link} from "gatsby";
import I18nText from "./I18nText";
import {useLang} from "../contexts/LangContext";
import {policyLabels} from "../i18n/pageLabels";

const policyLinks = [
    {to: "/terms/", label: policyLabels.termsOfService},
    {to: "/privacy/", label: policyLabels.privacyPolicy, emphasized: true},
    {to: "/disclaimer/", label: policyLabels.investmentDisclaimer},
];

const Footer = () => {
    const year: number = new Date().getFullYear()
    const {lang} = useLang()

    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div
                className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 dark:text-slate-400 md:flex-row"
            >
                <div className="flex flex-col items-center gap-2 md:items-start">
                    <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                        {policyLinks.map(({to, label, emphasized}) => (
                            <Link
                                key={to}
                                to={to}
                                className={`hover:text-slate-900 dark:hover:text-slate-100 ${emphasized ? "font-semibold text-slate-800 dark:text-slate-200" : ""}`}
                            >
                                <I18nText dict={label} lang={lang}/>
                            </Link>
                        ))}
                    </nav>
                    <div className="text-center md:text-left">
                        ⓒ {year} PSY Thinktank. All rights reserved.
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <span>Provided by</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">dgmoonlabs</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
