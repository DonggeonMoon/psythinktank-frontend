import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import { AuthProvider } from "./src/contexts/AuthContext"
import { LangProvider } from "./src/contexts/LangContext"
import SignupBanner from "./src/components/SignupBanner"
import "./src/styles/global.css"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
    <AuthProvider>
        <LangProvider>
            {element}
            <SignupBanner />
        </LangProvider>
    </AuthProvider>
)
