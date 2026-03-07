import React, {useEffect, useState} from "react"

const DarkToggle = () => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("theme")
        if (saved === "dark") {
            document.documentElement.classList.add("dark")
            setIsDark(true)
        }
    }, [])

    const toggle = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        } else {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        }
        setIsDark(!isDark)
    }

    return (
        <button
            onClick={toggle}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
        >
            {isDark ? "🌙" : "☀"}
        </button>
    )
}

export default DarkToggle