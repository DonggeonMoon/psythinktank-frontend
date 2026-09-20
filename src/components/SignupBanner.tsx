import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {useAuth} from "../contexts/AuthContext";

const DISMISS_KEY = "signupBanner:dismissed";
const HIDDEN_PATHS = ["/login", "/signup", "/consent", "/find-password"];

const SignupBanner: React.FC = () => {
    const {user, loading} = useAuth();
    const [scrolledHalf, setScrolledHalf] = useState(false);
    const [dismissed, setDismissed] = useState(true);

    useEffect(() => {
        try {
            setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
        } catch {
            setDismissed(false);
        }

        const onScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const onHiddenPath = HIDDEN_PATHS.some((path) => window.location.pathname.startsWith(path));
            setScrolledHalf(!onHiddenPath && scrollable > 0 && window.scrollY / scrollable >= 0.5);
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const dismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
        }
    };

    if (loading || user || dismissed || !scrolledHalf) return null;

    return (
        <div
            role="status"
            className="fixed bottom-4 right-4 left-4 z-50 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg sm:left-auto sm:w-96 dark:border-slate-700 dark:bg-slate-900"
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    PSYThinktank 회원이 되어주세요
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="닫기"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    ✕
                </button>
            </div>
            <Link
                to="/signup/agree"
                className="rounded-md bg-slate-900 px-4 py-2.5 text-center text-base font-medium text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900 transition-colors"
            >
                회원 가입
            </Link>
        </div>
    );
};

export default SignupBanner;
