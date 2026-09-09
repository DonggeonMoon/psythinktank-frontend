import * as React from "react";
import {Link} from "gatsby";
import DarkModeToggle from "./DarkModeToggle";
import {useAuth} from "../contexts/AuthContext";
import {isStaffRole} from "../lib/roles";

const NAV_LINKS = [
    {to: "/stocks", label: "종목"},
    {to: "/boards", label: "게시판"},
    {to: "/newsletters", label: "회보"},
    {to: "/performance", label: "성과"},
    {to: "/about", label: "소개"},
];

const Header = () => {
    const {user, profile, loading, logout} = useAuth();
    const [menuOpen, setMenuOpen] = React.useState(false);

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
                {isStaffRole(profile?.role) && (
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
                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                aria-label="메뉴 열기"
                                className="rounded-md border border-slate-300 p-2 dark:border-slate-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                     strokeLinejoin="round" className="h-5 w-5">
                                    <line x1="4" y1="7" x2="20" y2="7"/>
                                    <line x1="4" y1="12" x2="20" y2="12"/>
                                    <line x1="4" y1="17" x2="20" y2="17"/>
                                </svg>
                            </button>
                            <DarkModeToggle/>
                        </div>
                    </div>
                    <nav className="flex items-center gap-5 overflow-x-auto pb-3 -mt-1">
                        {navItems("whitespace-nowrap hover:text-slate-900 dark:hover:text-white transition-colors")}
                    </nav>
                </div>

                {menuOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div
                            className="flex-1 bg-black/40"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div
                            className="flex w-64 max-w-[80%] flex-col gap-3 border-l border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                    메뉴
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    aria-label="메뉴 닫기"
                                    className="p-1 text-slate-600 dark:text-slate-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                         strokeLinejoin="round" className="h-5 w-5">
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                            {!loading && (
                                user ? (
                                    <>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {profile?.nickname ?? user.email}
                                        </span>
                                        {isStaffRole(profile?.role) && (
                                            <Link
                                                to="/admin/members"
                                                onClick={() => setMenuOpen(false)}
                                                className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                                            >
                                                회원 관리
                                            </Link>
                                        )}
                                        <Link
                                            to="/mypage"
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                                        >
                                            마이페이지
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMenuOpen(false);
                                            }}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-left text-sm dark:border-slate-700"
                                        >
                                            로그아웃
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                                    >
                                        로그인
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                )}

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
