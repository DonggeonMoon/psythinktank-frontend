import * as React from "react";

const Footer = () => {
    const year: number = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div
                className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 dark:text-slate-400 md:flex-row"
            >
                <div className="text-center md:text-left">
                    ⓒ {year} PSY Thinktank. All rights reserved.
                </div>

                <div className="flex items-center gap-1">
                    <span>Provided by</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">dgmoonlabs</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
