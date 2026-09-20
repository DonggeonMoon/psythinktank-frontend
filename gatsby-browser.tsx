import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import { AuthProvider } from "./src/contexts/AuthContext"
import SignupBanner from "./src/components/SignupBanner"
import "./src/styles/global.css"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
    <AuthProvider>
        {element}
        <SignupBanner />
    </AuthProvider>
)
