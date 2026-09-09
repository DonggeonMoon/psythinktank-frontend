import * as React from "react";
import {useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {Link} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";

const FindPasswordPage: React.FC<PageProps> = () => {
    const {resetPassword} = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
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
                setError("올바른 이메일 형식이 아닙니다.");
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
                    비밀번호 찾기
                </h1>
                <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    가입하신 이메일로 비밀번호 재설정 메일을 보내드립니다.
                </p>

                {sent ? (
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                입력하신 이메일 주소로 비밀번호 재설정 메일을 보냈습니다.
                            </p>
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                메일이 스팸함으로 분류되었을 수 있으니, 받은 메일함에 안 보이면 스팸함도 꼭 확인해주세요.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-block rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            로그인으로 돌아가기
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                이메일
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

                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            {submitting ? "전송 중..." : "재설정 메일 보내기"}
                        </button>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/login" className="text-slate-900 dark:text-slate-100 hover:underline">
                                로그인으로 돌아가기
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
