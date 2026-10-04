import * as React from "react";
import {useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {useLang} from "../contexts/LangContext";
import I18nText from "../components/I18nText";
import type {Lang} from "../i18n/stockLabels";
import {commonAuthLabels, findPasswordLabels} from "../i18n/authLabels";

const FindPasswordPage: React.FC<PageProps> = () => {
    const {resetPassword} = useAuth();
    const {lang} = useLang();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<Record<Lang, string> | null>(null);
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await resetPassword(email.trim());
        } catch (err) {
            const code = (err as { code?: string })?.code;
            if (code === "auth/invalid-email") {
                setError(findPasswordLabels.invalidEmail);
                setSubmitting(false);
                return;
            }
            // 존재하지 않는 이메일이어도 동일하게 "발송 완료"로 처리한다 (가입 여부 노출 방지).
        }

        setSent(true);
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-sm px-4 py-20">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 text-center">
                    <I18nText dict={findPasswordLabels.title} lang={lang}/>
                </h1>
                <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <I18nText dict={findPasswordLabels.subtitle} lang={lang}/>
                </p>

                {sent ? (
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                <I18nText dict={findPasswordLabels.sent} lang={lang}/>
                            </p>
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                <I18nText dict={commonAuthLabels.spamNotice} lang={lang}/>
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-block rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            <I18nText dict={findPasswordLabels.backToLogin} lang={lang}/>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                <I18nText dict={commonAuthLabels.email} lang={lang}/>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error[lang]}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            {submitting ? findPasswordLabels.submitting[lang] : findPasswordLabels.submit[lang]}
                        </button>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/login" className="text-slate-900 dark:text-slate-100 hover:underline">
                                <I18nText dict={findPasswordLabels.backToLogin} lang={lang}/>
                            </Link>
                        </p>
                    </form>
                )}
            </main>

            <Footer/>
        </div>
    );
};

export default FindPasswordPage;

export const Head: HeadFC = () => <title>비밀번호 찾기</title>;
