import * as React from "react";
import {useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link, navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {useLang} from "../contexts/LangContext";
import I18nText from "../components/I18nText";
import type {Lang} from "../i18n/stockLabels";
import {commonAuthLabels, loginPageLabels} from "../i18n/authLabels";

const LoginPage: React.FC<PageProps> = () => {
    const {login} = useAuth();
    const {lang} = useLang();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<Record<Lang, string> | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login(email, password);
            await navigate("/");
        } catch (err) {
            if ((err as { code?: string })?.code === "auth/email-not-verified") {
                setError(loginPageLabels.emailNotVerified);
                return;
            }
            setError(loginPageLabels.invalidCredentials);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-sm px-4 py-20">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8 text-center">
                    <I18nText dict={commonAuthLabels.login} lang={lang}/>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                        >
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

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                        >
                            <I18nText dict={commonAuthLabels.password} lang={lang}/>
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error[lang]}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {submitting ? loginPageLabels.submitting[lang] : commonAuthLabels.login[lang]}
                    </button>

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <Link to="/find-password" className="hover:underline">
                            <I18nText dict={loginPageLabels.forgotPassword} lang={lang}/>
                        </Link>
                        <Link to="/signup" className="text-slate-900 dark:text-slate-100 hover:underline">
                            <I18nText dict={commonAuthLabels.signup} lang={lang}/>
                        </Link>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default LoginPage;

export const Head: HeadFC = () => <title>로그인</title>;
