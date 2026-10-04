import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link, navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {useLang} from "../contexts/LangContext";
import I18nText from "../components/I18nText";
import {isValidPassword} from "../lib/validation";
import {consumeAgreedToPrivacyConsent} from "../lib/privacyConsent";
import type {Lang} from "../i18n/stockLabels";
import {commonAuthLabels, signupPageLabels, verificationSentMessage} from "../i18n/authLabels";

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

type EmailStatus = "idle" | "checking" | "available" | "unavailable";
type NicknameStatus = "idle" | "checking" | "available" | "unavailable";

const renderVerificationSent = (email: string, lang: Lang) => {
    const [before, after] = verificationSentMessage(lang);
    return (
        <>
            {before}
            <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>
            {after}
        </>
    );
};

const SignupPage: React.FC<PageProps> = () => {
    const {signup, checkEmailAvailable, checkNicknameAvailable} = useAuth();
    const {lang} = useLang();
    const [checkingConsent, setCheckingConsent] = useState(true);
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
    const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
    const [nickname, setNickname] = useState("");
    const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("idle");
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<Record<Lang, string> | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [verificationSentTo, setVerificationSentTo] = useState<string | null>(null);

    useEffect(() => {
        if (!consumeAgreedToPrivacyConsent()) {
            navigate("/signup/agree");
            return;
        }
        setCheckingConsent(false);
    }, []);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailStatus("idle");
    };

    const handleEmailCheck = async () => {
        const trimmed = email.trim();
        if (!trimmed) return;

        setEmailStatus("checking");
        try {
            const available = await checkEmailAvailable(trimmed);
            setCheckedEmail(trimmed);
            setEmailStatus(available ? "available" : "unavailable");
        } catch {
            setEmailStatus("idle");
        }
    };

    const handleNicknameChange = (value: string) => {
        setNickname(value);
        setNicknameStatus("idle");
    };

    const handleNicknameCheck = async () => {
        const trimmed = nickname.trim();
        if (!trimmed) return;

        setNicknameStatus("checking");
        try {
            const available = await checkNicknameAvailable(trimmed);
            setCheckedNickname(trimmed);
            setNicknameStatus(available ? "available" : "unavailable");
        } catch {
            setNicknameStatus("idle");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedEmail = email.trim();
        const trimmedNickname = nickname.trim();

        if (emailStatus !== "available" || checkedEmail !== trimmedEmail) {
            setError(signupPageLabels.emailCheckRequired);
            return;
        }
        if (nicknameStatus !== "available" || checkedNickname !== trimmedNickname) {
            setError(commonAuthLabels.nicknameCheckRequired);
            return;
        }
        if (password !== passwordConfirm) {
            setError(signupPageLabels.passwordMismatch);
            return;
        }
        if (!isValidPassword(password)) {
            setError(commonAuthLabels.passwordRequirement);
            return;
        }

        setSubmitting(true);
        try {
            await signup(email, password, trimmedNickname);
            setVerificationSentTo(email.trim());
        } catch (err) {
            const code = (err as { code?: string })?.code;
            if (code === "auth/email-already-in-use") {
                setError(commonAuthLabels.emailTaken);
                setEmailStatus("idle");
                setCheckedEmail(null);
            } else if (code === "signup/duplicate") {
                setError(signupPageLabels.duplicate);
                setEmailStatus("idle");
                setCheckedEmail(null);
                setNicknameStatus("idle");
                setCheckedNickname(null);
            } else {
                setError(signupPageLabels.failed);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (checkingConsent) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    if (verificationSentTo) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1 mx-auto w-full max-w-sm px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        <I18nText dict={signupPageLabels.verifyTitle} lang={lang}/>
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <I18nText
                            lang={lang}
                            dict={{
                                ko: renderVerificationSent(verificationSentTo, "ko"),
                                en: renderVerificationSent(verificationSentTo, "en"),
                                ja: renderVerificationSent(verificationSentTo, "ja"),
                                zh: renderVerificationSent(verificationSentTo, "zh"),
                            }}
                        />
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-8">
                        <I18nText dict={commonAuthLabels.spamNotice} lang={lang}/>
                    </p>
                    <Link
                        to="/login"
                        className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        <I18nText dict={signupPageLabels.goToLogin} lang={lang}/>
                    </Link>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-sm px-4 py-16">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8 text-center">
                    <I18nText dict={commonAuthLabels.signup} lang={lang}/>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className={labelClass}><I18nText dict={commonAuthLabels.email} lang={lang}/></label>
                        <div className="flex gap-2">
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={handleEmailCheck}
                                disabled={!email.trim() || emailStatus === "checking"}
                                className="shrink-0 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                <I18nText dict={commonAuthLabels.checkDuplicate} lang={lang}/>
                            </button>
                        </div>
                        {emailStatus === "available" && (
                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400"><I18nText dict={commonAuthLabels.emailAvailable} lang={lang}/></p>
                        )}
                        {emailStatus === "unavailable" && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400"><I18nText dict={commonAuthLabels.emailTaken} lang={lang}/></p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nickname" className={labelClass}><I18nText dict={commonAuthLabels.nickname} lang={lang}/></label>
                        <div className="flex gap-2">
                            <input
                                id="nickname"
                                type="text"
                                required
                                maxLength={20}
                                value={nickname}
                                onChange={(e) => handleNicknameChange(e.target.value)}
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={handleNicknameCheck}
                                disabled={!nickname.trim() || nicknameStatus === "checking"}
                                className="shrink-0 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                <I18nText dict={commonAuthLabels.checkDuplicate} lang={lang}/>
                            </button>
                        </div>
                        {nicknameStatus === "available" && (
                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400"><I18nText dict={commonAuthLabels.nicknameAvailable} lang={lang}/></p>
                        )}
                        {nicknameStatus === "unavailable" && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400"><I18nText dict={commonAuthLabels.nicknameTaken} lang={lang}/></p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}><I18nText dict={commonAuthLabels.password} lang={lang}/></label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400"><I18nText dict={commonAuthLabels.passwordRequirement} lang={lang}/></p>
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className={labelClass}><I18nText dict={commonAuthLabels.passwordConfirm} lang={lang}/></label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error[lang]}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {submitting ? signupPageLabels.submitting[lang] : commonAuthLabels.signup[lang]}
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        <I18nText dict={signupPageLabels.haveAccount} lang={lang}/>{" "}
                        <Link to="/login" className="text-slate-900 dark:text-slate-100 hover:underline">
                            <I18nText dict={commonAuthLabels.login} lang={lang}/>
                        </Link>
                    </p>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default SignupPage;

export const Head: HeadFC = () => <title>회원 가입</title>;
