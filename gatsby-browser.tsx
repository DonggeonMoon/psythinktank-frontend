import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import { AuthProvider } from "./src/contexts/AuthContext"
import "./src/styles/global.css"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
    <AuthProvider>{element}</AuthProvider>
)
