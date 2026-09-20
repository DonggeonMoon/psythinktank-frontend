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
            className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
            <Link
                to="/signup/agree"
                className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-100"
            >
                PSYThinktank 회원 가입하기
            </Link>
            <button
                type="button"
                onClick={dismiss}
                aria-label="닫기"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                ✕
            </button>
        </div>
    );
};

export default SignupBanner;
