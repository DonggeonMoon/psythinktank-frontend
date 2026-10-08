import React from "react"
import type {GatsbySSR} from "gatsby"
import { AuthProvider } from "./src/contexts/AuthContext"
import { LangProvider } from "./src/contexts/LangContext"

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => (
    <AuthProvider>
        <LangProvider>{element}</LangProvider>
    </AuthProvider>
)

// 정적 HTML은 항상 라이트로 렌더되므로, 첫 페인트 전에 저장된 테마를 적용해 다크모드가 잠깐 풀리는 깜빡임을 막는다.
const themeInitScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`

export const onRenderBody: GatsbySSR["onRenderBody"] = ({setHeadComponents}) => {
    setHeadComponents([
        <script key="theme-init" dangerouslySetInnerHTML={{__html: themeInitScript}}/>,
        ...(process.env.NODE_ENV === "production" ? [
            <script key="gtag-src" async src="https://www.googletagmanager.com/gtag/js?id=G-5G1PG29YJH"/>,
            <script key="gtag-init" dangerouslySetInnerHTML={{__html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5G1PG29YJH');
`}}/>,
        ] : []),
        <meta key="google-site-verification" name="google-site-verification"
              content="FEZ-QQqTHTmdnS8FzNs-7TOeveE9vAmN9_fs3MgIzq4"/>,
        <meta key="naver-site-verification" name="naver-site-verification" content="369cd357a5de6d37d15f6442853e994b465851cf" />
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
