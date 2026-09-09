import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link, navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {isValidPassword, PASSWORD_REQUIREMENT_MESSAGE} from "../lib/validation";
import {consumeAgreedToPrivacyConsent} from "../lib/privacyConsent";

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

type EmailStatus = "idle" | "checking" | "available" | "unavailable";
type NicknameStatus = "idle" | "checking" | "available" | "unavailable";

const SignupPage: React.FC<PageProps> = () => {
    const {signup, checkEmailAvailable, checkNicknameAvailable} = useAuth();
    const [checkingConsent, setCheckingConsent] = useState(true);
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
    const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
    const [nickname, setNickname] = useState("");
    const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>("idle");
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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
            setError("이메일 중복 확인을 완료해주세요.");
            return;
        }
        if (nicknameStatus !== "available" || checkedNickname !== trimmedNickname) {
            setError("닉네임 중복 확인을 완료해주세요.");
            return;
        }
        if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!isValidPassword(password)) {
            setError(PASSWORD_REQUIREMENT_MESSAGE);
            return;
        }

        setSubmitting(true);
        try {
            await signup(email, password, trimmedNickname);
            await navigate("/");
        } catch (err) {
            const code = (err as { code?: string })?.code;
            if (code === "auth/email-already-in-use") {
                setError("이미 가입된 이메일입니다.");
                setEmailStatus("idle");
                setCheckedEmail(null);
            } else if (code === "signup/duplicate") {
                setError("닉네임 또는 이메일이 이미 사용 중입니다. 다시 확인해주세요.");
                setEmailStatus("idle");
                setCheckedEmail(null);
                setNicknameStatus("idle");
                setCheckedNickname(null);
            } else {
                setError("회원가입에 실패했습니다. 입력값을 확인해주세요.");
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

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-sm px-4 py-16">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8 text-center">
                    회원가입
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className={labelClass}>이메일</label>
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
                                중복확인
                            </button>
                        </div>
                        {emailStatus === "available" && (
                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">사용 가능한 이메일입니다.</p>
                        )}
                        {emailStatus === "unavailable" && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">이미 가입된 이메일입니다.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nickname" className={labelClass}>닉네임</label>
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
                                중복확인
                            </button>
                        </div>
                        {nicknameStatus === "available" && (
                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">사용 가능한 닉네임입니다.</p>
                        )}
                        {nicknameStatus === "unavailable" && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">이미 사용 중인 닉네임입니다.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{PASSWORD_REQUIREMENT_MESSAGE}</p>
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className={labelClass}>비밀번호 확인</label>
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

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {submitting ? "가입 중..." : "회원가입"}
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        이미 계정이 있으신가요?{" "}
                        <Link to="/login" className="text-slate-900 dark:text-slate-100 hover:underline">
                            로그인
                        </Link>
                    </p>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default SignupPage;

export const Head: HeadFC = () => <title>회원가입</title>;
