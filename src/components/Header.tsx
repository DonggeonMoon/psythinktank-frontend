import * as React from "react";
import {Link} from "gatsby";
import DarkModeToggle from "./DarkModeToggle";
import LangSwitcher from "./LangSwitcher";
import {useAuth} from "../contexts/AuthContext";
import {isStaffRole} from "../lib/roles";
import I18nText from "./I18nText";
import {useLang} from "../contexts/LangContext";
import {headerLabels} from "../i18n/pageLabels";

const NAV_LINKS = [
    {to: "/stocks", label: headerLabels.stocks},
    {to: "/boards", label: headerLabels.boards},
    {to: "/newsletters", label: headerLabels.newsletters},
    {to: "/performance", label: headerLabels.performance},
    {to: "/about", label: headerLabels.about},
];

const Header = () => {
    const {user, profile, loading, logout} = useAuth();
    const {lang} = useLang();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const navItems = (className: string) => (
        <>
            {NAV_LINKS.map(({to, label}) => (
                <Link key={to} to={to} className={className}>
                    <I18nText dict={label} lang={lang}/>
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
                        <I18nText dict={headerLabels.adminMembers} lang={lang}/>
                    </Link>
                )}
                <Link
                    to="/mypage"
                    className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <I18nText dict={headerLabels.mypage} lang={lang}/>
                </Link>
                <button
                    onClick={() => logout()}
                    className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <I18nText dict={headerLabels.logout} lang={lang}/>
                </button>
            </div>
        ) : (
            <Link
                to="/login"
                className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <I18nText dict={headerLabels.login} lang={lang}/>
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
                                aria-label={headerLabels.openMenu[lang]}
                                className="rounded-full border border-slate-300 p-2 dark:border-slate-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                                     strokeLinejoin="round" className="h-5 w-5">
                                    <circle cx="12" cy="8" r="3.25"/>
                                    <path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6"/>
                                </svg>
                            </button>
                            <LangSwitcher/>
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
                                    <I18nText dict={headerLabels.menu} lang={lang}/>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    aria-label={headerLabels.closeMenu[lang]}
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
                                                <I18nText dict={headerLabels.adminMembers} lang={lang}/>
                                            </Link>
                                        )}
                                        <Link
                                            to="/mypage"
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                                        >
                                            <I18nText dict={headerLabels.mypage} lang={lang}/>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMenuOpen(false);
                                            }}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-left text-sm dark:border-slate-700"
                                        >
                                            <I18nText dict={headerLabels.logout} lang={lang}/>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                                    >
                                        <I18nText dict={headerLabels.login} lang={lang}/>
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
                        <LangSwitcher/>
                        <DarkModeToggle/>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default Header
