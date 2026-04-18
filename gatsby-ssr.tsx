import React from "react"
import type {GatsbySSR} from "gatsby"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({setHeadComponents}) => {
    setHeadComponents([
        <meta key="google-site-verification" name="google-site-verification"
              content="FEZ-QQqTHTmdnS8FzNs-7TOeveE9vAmN9_fs3MgIzq4"/>
    ])
}