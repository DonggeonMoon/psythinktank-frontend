import * as React from "react";
import {Link} from "gatsby";
import DarkModeToggle from "./DarkModeToggle";
import {useAuth} from "../contexts/AuthContext";

const NAV_LINKS = [
    {to: "/stocks", label: "종목"},
    {to: "/boards", label: "게시판"},
    {to: "/newsletters", label: "회보"},
    {to: "/performance", label: "성과"},
    {to: "/about", label: "소개"},
];

const Header = () => {
    const {user, profile, loading, logout} = useAuth();

    const navItems = (className: string) => (
        <>
            {NAV_LINKS.map(({to, label}) => (
                <Link key={to} to={to} className={className}>
                    {label}
                </Link>
            ))}
        </>
    );

    const authArea = !loading && (
        user ? (
            <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300">
                    {profile?.nickname ?? user.email}
                </span>
                {profile?.role === "admin" && (
                    <Link
                        to="/admin/members"
                        className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        회원 관리
                    </Link>
                )}
                <Link
                    to="/mypage"
                    className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    마이페이지
                </Link>
                <button
                    onClick={() => logout()}
                    className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    로그아웃
                </button>
            </div>
        ) : (
            <Link
                to="/login"
                className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                로그인
            </Link>
        )
    );

    return (
        <header
            className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600 dark:text-slate-400">

                <div className="flex flex-col md:hidden">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            to="/"
                            className="text-base font-semibold text-slate-800 dark:text-slate-200"
                        >
                            PSY Thinktank
                        </Link>
                        <div className="flex items-center gap-3">
                            {authArea}
                            <DarkModeToggle/>
                        </div>
                    </div>
                    <nav className="flex items-center gap-5 overflow-x-auto pb-3 -mt-1">
                        {navItems("whitespace-nowrap hover:text-slate-900 dark:hover:text-white transition-colors")}
                    </nav>
                </div>

                <div className="hidden md:flex h-16 items-center justify-between">
                    <div className="flex">
                        <Link
                            to="/"
                            className="text-base font-semibold text-slate-800 dark:text-slate-200"
                        >
                            PSY Thinktank
                        </Link>

                        <nav className="flex mx-6 items-center gap-6">
                            {navItems("hover:text-slate-900 dark:hover:text-white transition-colors")}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {authArea}
                        <DarkModeToggle/>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default Header
