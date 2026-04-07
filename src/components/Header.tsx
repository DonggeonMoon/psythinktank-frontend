import * as React from "react";
import {Link} from "gatsby";
import DarkModeToggle from "./DarkModeToggle";

const Header = () => {
    return (
        <header
            className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div
                className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-slate-600 dark:text-slate-400">

                <div className="flex">
                    <Link
                        to="/"
                        className="text-base font-semibold text-slate-800 dark:text-slate-200"
                    >
                        PSY Thinktank
                    </Link>

                    <nav className="flex mx-6 items-center gap-6">
                        <Link
                            to="/stocks"
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            종목
                        </Link>
                        <Link
                            to="/boards"
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            게시판
                        </Link>
                        <Link
                            to="/newsletters"
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            회보
                        </Link>
                        <Link
                            to="/performance"
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            성과
                        </Link>
                        <Link
                            to="/about"
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            소개
                        </Link>
                    </nav>
                </div>

                <DarkModeToggle/>

            </div>
        </header>
    )
}

export default Header
