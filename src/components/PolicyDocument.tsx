import * as React from "react";
import Header from "./Header";
import Footer from "./Footer";
import I18nText from "./I18nText";
import {useLang} from "../contexts/LangContext";
import type {Lang} from "../i18n/stockLabels";

interface PolicyDocumentProps {
    title: Record<Lang, string>;
    body: Record<Lang, string>;
}

const PolicyDocument: React.FC<PolicyDocumentProps> = ({title, body}) => {
    const {lang} = useLang();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
                <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    <I18nText dict={title} lang={lang}/>
                </h1>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <I18nText dict={body} lang={lang}/>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default PolicyDocument;
