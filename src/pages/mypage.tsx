import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {useLang} from "../contexts/LangContext";
import I18nText from "../components/I18nText";
import {isValidPassword} from "../lib/validation";
import type {Lang} from "../i18n/stockLabels";
import {commonAuthLabels, myPageLabels} from "../i18n/authLabels";

type NicknameStatus = "idle" | "checking" | "available" | "unavailable";
type Message = Record<Lang, string>;

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
const sectionClass = "space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950";

const MyPage: React.FC<PageProps> = () => {
    const {user, profile, loading, updateNickname, checkNicknameAvailable, changePassword, deleteAccount} = useAuth();
    const {lang} = useLang();

    const [nickname, setNickname] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState<Message | null>(null);
    const [nicknameSubmitting, setNicknameSubmitting] = useState(false);
    const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("idle");
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawPassword, setWithdrawPassword] = useState("");
    const [withdrawMessage, setWithdrawMessage] = useState<Message | null>(null);
    const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user]);

    useEffect(() => {
        if (profile) setNickname(profile.nickname);
    }, [profile]);

    const handleNicknameChange = (value: string) => {
        setNickname(value);
        setNicknameStatus("idle");
    };

    const handleNicknameCheck = async () => {
        const trimmed = nickname.trim();
        if (!trimmed) return;

        setNicknameStatus("checking");
        try {
            const available = trimmed === profile?.nickname || (await checkNicknameAvailable(trimmed));
            setCheckedNickname(trimmed);
            setNicknameStatus(available ? "available" : "unavailable");
        } catch {
            setNicknameStatus("idle");
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    const handleNicknameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNicknameMessage(null);

        const trimmedNickname = nickname.trim();
        if (trimmedNickname !== profile?.nickname && (nicknameStatus !== "available" || checkedNickname !== trimmedNickname)) {
            setNicknameMessage(commonAuthLabels.nicknameCheckRequired);
            return;
        }

        setNicknameSubmitting(true);
        try {
            await updateNickname(trimmedNickname);
            setNicknameMessage(myPageLabels.nicknameChanged);
            setNicknameStatus("idle");
            setCheckedNickname(null);
        } catch (err) {
            const code = (err as { code?: string })?.code;
            setNicknameMessage(
                code === "nickname/already-in-use" ? myPageLabels.nicknameTakenRetry : myPageLabels.nicknameChangeFailed
            );
        } finally {
            setNicknameSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== newPasswordConfirm) {
            setPasswordMessage(myPageLabels.newPasswordMismatch);
            return;
        }
        if (!isValidPassword(newPassword)) {
            setPasswordMessage(commonAuthLabels.passwordRequirement);
            return;
        }

        setPasswordSubmitting(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordMessage(myPageLabels.passwordChanged);
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        } catch {
            setPasswordMessage(myPageLabels.currentPasswordWrong);
        } finally {
            setPasswordSubmitting(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawMessage(null);
        setWithdrawSubmitting(true);
        try {
            await deleteAccount(withdrawPassword);
            await navigate("/");
        } catch {
            setWithdrawMessage(myPageLabels.passwordWrong);
            setWithdrawSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-lg px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100"><I18nText dict={myPageLabels.title} lang={lang}/></h1>

                <section className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400"><I18nText dict={myPageLabels.account} lang={lang}/></h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{user.email}</p>
                </section>

                <form onSubmit={handleNicknameSubmit} className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400"><I18nText dict={myPageLabels.changeNickname} lang={lang}/></h2>
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
                    {nicknameMessage && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{nicknameMessage[lang]}</p>
                    )}
                    <button
                        type="submit"
                        disabled={nicknameSubmitting}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {nicknameSubmitting ? myPageLabels.saving[lang] : myPageLabels.saveNickname[lang]}
                    </button>
                </form>

                <form onSubmit={handlePasswordSubmit} className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400"><I18nText dict={myPageLabels.changePassword} lang={lang}/></h2>
                    <div>
                        <label htmlFor="currentPassword" className={labelClass}><I18nText dict={myPageLabels.currentPassword} lang={lang}/></label>
                        <input
                            id="currentPassword"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className={labelClass}><I18nText dict={myPageLabels.newPassword} lang={lang}/></label>
                        <input
                            id="newPassword"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400"><I18nText dict={commonAuthLabels.passwordRequirement} lang={lang}/></p>
                    </div>
                    <div>
                        <label htmlFor="newPasswordConfirm" className={labelClass}><I18nText dict={myPageLabels.newPasswordConfirm} lang={lang}/></label>
                        <input
                            id="newPasswordConfirm"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    {passwordMessage && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{passwordMessage[lang]}</p>
                    )}
                    <button
                        type="submit"
                        disabled={passwordSubmitting}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {passwordSubmitting ? myPageLabels.changing[lang] : myPageLabels.changePassword[lang]}
                    </button>
                </form>

                <section className="space-y-4 rounded-xl border border-red-200 bg-red-50/30 p-6 dark:border-red-900/40 dark:bg-red-900/10">
                    <h2 className="text-sm font-semibold text-red-600 dark:text-red-400"><I18nText dict={myPageLabels.withdraw} lang={lang}/></h2>

                    {!showWithdraw ? (
                        <button
                            type="button"
                            onClick={() => setShowWithdraw(true)}
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <I18nText dict={myPageLabels.withdraw} lang={lang}/>
                        </button>
                    ) : (
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                <I18nText dict={myPageLabels.withdrawWarning} lang={lang}/>
                            </p>
                            <div>
                                <label htmlFor="withdrawPassword" className={labelClass}><I18nText dict={commonAuthLabels.passwordConfirm} lang={lang}/></label>
                                <input
                                    id="withdrawPassword"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={withdrawPassword}
                                    onChange={(e) => setWithdrawPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            {withdrawMessage && (
                                <p className="text-sm text-red-600 dark:text-red-400">{withdrawMessage[lang]}</p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={withdrawSubmitting}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-colors"
                                >
                                    {withdrawSubmitting ? myPageLabels.withdrawing[lang] : myPageLabels.withdrawConfirm[lang]}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowWithdraw(false)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300 transition-colors"
                                >
                                    <I18nText dict={commonAuthLabels.cancel} lang={lang}/>
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default MyPage;

export const Head: HeadFC = () => <title>내 정보</title>;
