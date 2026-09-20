import React from "react"
import type {GatsbySSR} from "gatsby"
import { AuthProvider } from "./src/contexts/AuthContext"

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => (
    <AuthProvider>{element}</AuthProvider>
)

export const onRenderBody: GatsbySSR["onRenderBody"] = ({setHeadComponents}) => {
    setHeadComponents([
        <meta key="google-site-verification" name="google-site-verification"
              content="FEZ-QQqTHTmdnS8FzNs-7TOeveE9vAmN9_fs3MgIzq4"/>,
        <meta key="naver-site-verification" name="naver-site-verification" content="188aec7f07541b21448d05fb0b92073950c81bdc" />
    ])
}

// Gatsby는 전역 CSS를 모든 페이지 HTML에 <style>로 인라인하는데, 종목 상세 페이지가 2만 개라 산출물 용량이
// CSS 크기 x 페이지 수로 불어난다. 외부 stylesheet 링크로 바꿔 CSS를 파일 하나로 공유하고 브라우저 캐시도 활용한다.
export const onPreRenderHTML: GatsbySSR["onPreRenderHTML"] = ({getHeadComponents, replaceHeadComponents}) => {
    const headComponents = getHeadComponents().map((component) => {
        const element = component as React.ReactElement<{ "data-identity"?: string; "data-href"?: string }>
        if (element.type === "style" && element.props["data-identity"] === "gatsby-global-css" && element.props["data-href"]) {
            return <link key={element.key ?? "gatsby-global-css"} rel="stylesheet" href={element.props["data-href"]}/>
        }
        return component
    })
    replaceHeadComponents(headComponents)
}
