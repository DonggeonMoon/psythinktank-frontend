import * as React from "react";
import {HeadFC, Link, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import aboutImg from "../../images/about.jpg";
import feature1 from "../../images/featured-1.png";
import Ticker from "../../components/Ticker";

const AboutPage: React.FC<PageProps> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1">


                <section id="about" className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                    <header className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            PSY Thinktank
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            빅데이터 기반 금융투자
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="aspect-[16/10] w-full rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 grid place-items-center text-sm text-slate-500 dark:text-slate-400">
                                <img src={aboutImg}
                                     alt="about"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                빅데이터 분석 연구소
                            </h3>

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                PSY Thinktank는 2017년 젊은 패기를 가진 청년들이 자신의 아이디어와 신기술을
                                접목하여 투자를 진행하는 비공개 투자 클럽에서 시작되었습니다. 2018년 빅데이터를
                                연구소로 확대 개편되었으며, 2020년부터 연구소 회보를 연 4회 발간하고 있습니다.
                                <br />
                                <br />
                                회보 발간을 통해 개인 투자자들이 빅데이터에 기반한 의사결정을 할 수 있도록 돕고
                                있으며, 안정적인 수익률로 보답하고 있습니다. 현재 총 5명의 연구원이 PSY Thinktank에서
                                활동하고 있습니다.
                            </p>

                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    우리는 IT 기술을 활용하여 빅데이터 정보를 수집·분석하면서도 자만하지 않고 항상
                                    보수적으로 투자를 집행합니다.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    회보를 통해 우리의 운영 실적을 투명하게 공개합니다.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    컴퓨터 기술 발전과 함께 발전된 투자 전략을 공유하여 개인 투자자들과 기관 투자자들 간의
                                    정보 격차 해소합니다.
                                </li>
                            </ul>

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                PSY Thinktank 홈페이지를 방문하여 투자 포트폴리오를 추적함으로써 여러분들도
                                빅데이터 기반 의사 결정을 진행하실 수 있습니다. 회보를 통해 최신 IT 기술에 기반한
                                금융투자를 경험하십시오.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="services" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <div className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                        <header className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                Distinctions
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                PSY Thinktank와 함께 투자해야 하는 이유
                            </p>
                        </header>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {[
                                {
                                    title: "뛰어난 운영 실적",
                                    desc: "유가증권 시장 호황기뿐 아니라 하락장 속에서도 손실을 최소화한 트랙 레코드를 보유하고 있습니다.",
                                },
                                {
                                    title: "다양한 분야의 전문가 포진",
                                    desc: "각 분야의 전문가들이 투자 아이디어에 대한 상호검증을 실시하여 편향을 최소화합니다.",
                                },
                                {
                                    title: "빅데이터를 통한 계량적 경제 분석",
                                    desc: "지배구조, 환경, 평판, CEO에 대한 빅데이터 분석을 통해 통계에 기반한 투자를 수행합니다.",
                                },
                                {
                                    title: "알고리즘을 통한 한계 기업 필터링",
                                    desc: "자체 개발 알고리즘으로 한계 기업을 필터링하여 상장 폐지로부터 투자자를 보호합니다.",
                                },
                            ].map((x) => (
                                <div
                                    key={x.title}
                                    className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {x.title}
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {x.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="featured" className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                    <header className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            PSY Thinktank가 제공하는 서비스
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            성공 투자를 위해 PSY Thinktank는 다양한 서비스를 제공합니다.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="aspect-[16/10] w-full rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 grid place-items-center text-sm text-slate-500 dark:text-slate-400">
                                <img src={feature1}
                                     alt="feature1"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                {
                                    title: "회보 발행",
                                    desc: "PSY Thinktank는 분기별로 연구소 회보를 발행하고 있습니다. 회보에는 칼럼, 종목 추천, 시황, 빅데이터 정보 등 기존 투자자들이 접할 수 없었던 투자 전략을 제공하고 있습니다.",
                                },
                                {
                                    title: "빅데이터 기반 종목 분석",
                                    desc: "투자자가 보유한 종목에 대한 빅데이터 분석을 제공합니다.",
                                },
                                {
                                    title: "섹터별 전문정보 제공",
                                    desc: "소수의 투자자들만이 이용하던 전문 정보를 무료로 제공하고 있습니다.",
                                },
                            ].map((x) => (
                                <div
                                    key={x.title}
                                    className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {x.title}
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {x.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <div className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                        <header className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                Frequently Asked Questions
                            </h2>
                        </header>

                        <div className="space-y-3">
                            {[
                                {
                                    q: "PSY Thinktank 이용은 무료인가요?",
                                    a: "PSY Thinktank는 기본적으로 모든 서비스를 무료로 이용할 수 있습니다. 다만, 후원자들에게는 감사의 의미로 부가적 컨텐츠를 제공하고 있습니다.",
                                },
                                {
                                    q: "후원을 하면 얻는 것이 있나요?",
                                    a: "후원 금액에 따라 Raw Data 제공 등과 같은 후원자 전용 컨텐츠를 제공하고 있습니다.",
                                },
                                {
                                    q: "어떻게 PSY Thinktank를 이용할 수 있나요?",
                                    a: "PSY Thinktank의 모든 서비스는 웹사이트에 구현될 예정입니다.",
                                },
                                {
                                    q: "종목 추천은 어떤 방식으로 진행되나요?",
                                    a: "빅데이터 수집 및 분석을 통해 1차적으로 주요 기업들을 선별하고 이후 연구원들 간의 토의를 통해서 컴퓨터가 분석할 수 없는 양적 데이터에 대한 판단을 내립니다. 이러한 과정을 거친 후 마지막으로 기업이 가지고 있는 위험요소과 시황을 분석하여 투자를 진행합니다.",
                                },
                                {
                                    q: "후원 시, 연구원들과의 소통은 무엇을 의미하나요?",
                                    a: "후원을 하시는 분들은 저희를 지지하고 저희와 같은 목표를 가지고 계신 동료입니다. 동료 간에 서로 투자 아이디어를 공유하고 시황에 대한 각자의 생각을 공유할 수 있습니다.",
                                },
                            ].map((x) => (
                                <details
                                    key={x.q}
                                    className="group rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {x.q}
                                        <span className="float-right text-slate-500 group-open:text-slate-700 dark:text-slate-400 dark:group-open:text-slate-200">
                      ▾
                    </span>
                                    </summary>
                                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {x.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                    <header className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            Contact
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            PSY Thinktank의 문은 늘 열려있습니다.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Blog</div>
                            <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                https://blog.naver.com/the9ya2
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Email</div>
                            <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                officialpsythinktank@gmail.com
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="text-xs text-slate-500 dark:text-slate-400">KakaoTalk</div>
                            <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                psythinktank
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Ticker/>

            <Footer />
        </div>
    )
}

export default AboutPage

export const Head: HeadFC = () => <title>소개</title>