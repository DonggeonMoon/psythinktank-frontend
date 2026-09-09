import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";
import {PRIVACY_CONSENT_TEXT} from "../lib/privacyConsent";

const ConsentPage: React.FC<PageProps> = () => {
    const {user, loading, agreeToPrivacyConsent, logout} = useAuth();
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    const handleContinue = async () => {
        if (!agreed) return;
        setSubmitting(true);
        try {
            await agreeToPrivacyConsent();
            await navigate("/");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-lg px-4 py-16">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 text-center">
                    개인정보 수집 및 이용 동의
                </h1>
                <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    이용 약관이 변경되어 계속 이용하시려면 다시 동의가 필요합니다.
                </p>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    {PRIVACY_CONSENT_TEXT}
                </div>

                <label className="mt-6 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    위 개인정보 수집 및 이용에 동의합니다. (필수)
                </label>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!agreed || submitting}
                    className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                >
                    {submitting ? "처리 중..." : "동의하고 계속하기"}
                </button>

                <button
                    type="button"
                    onClick={() => logout()}
                    className="mt-3 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                >
                    동의하지 않고 로그아웃
                </button>
            </main>

            <Footer/>
        </div>
    );
};

export default ConsentPage;

export const Head: HeadFC = () => <title>개인정보 수집 및 이용 동의</title>;
