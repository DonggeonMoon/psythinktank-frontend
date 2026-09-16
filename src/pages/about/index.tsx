import * as React from "react";
import {HeadFC, Link, PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import aboutImg from "../../images/about.jpg";
import feature1 from "../../images/featured-1.png";
import Ticker from "../../components/Ticker";
import I18nText from "../../components/I18nText";
import LangSwitcher from "../../components/LangSwitcher";
import {aboutContent, aboutPageLabels} from "../../i18n/pageLabels";
import {useAutoLang} from "../../hooks/useAutoLang";

const AboutPage: React.FC<PageProps> = () => {
    const [lang, setLang] = useAutoLang();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1">


                <section id="about" className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                    <header className="flex flex-col items-center gap-3">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                PSY Thinktank
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                <I18nText dict={aboutPageLabels.heroTagline} lang={lang}/>
                            </p>
                        </div>
                        <LangSwitcher lang={lang} onChange={setLang}/>
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
                                <I18nText dict={aboutPageLabels.researchLabTitle} lang={lang}/>
                            </h3>

                            <I18nText
                                as="p"
                                className="text-sm leading-6 text-slate-600 dark:text-slate-400"
                                lang={lang}
                                dict={{
                                    ko: <>{aboutContent.introPart1.ko}<br/><br/>{aboutContent.introPart2.ko}</>,
                                    en: <>{aboutContent.introPart1.en}<br/><br/>{aboutContent.introPart2.en}</>,
                                    ja: <>{aboutContent.introPart1.ja}<br/><br/>{aboutContent.introPart2.ja}</>,
                                    zh: <>{aboutContent.introPart1.zh}<br/><br/>{aboutContent.introPart2.zh}</>,
                                }}
                            />

                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    <I18nText dict={aboutContent.bullet1} lang={lang}/>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    <I18nText dict={aboutContent.bullet2} lang={lang}/>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    <I18nText dict={aboutContent.bullet3} lang={lang}/>
                                </li>
                            </ul>

                            <I18nText as="p" className="text-sm leading-6 text-slate-600 dark:text-slate-400" dict={aboutContent.introPart3} lang={lang}/>
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
                                <I18nText dict={aboutPageLabels.distinctionsTagline} lang={lang}/>
                            </p>
                        </header>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {aboutContent.distinctions.map((x) => (
                                <div
                                    key={x.key}
                                    className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        <I18nText dict={x.title} lang={lang}/>
                                    </div>
                                    <I18nText as="p" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400" dict={x.desc} lang={lang}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="featured" className="mx-auto max-w-6xl px-4 py-14 space-y-8">
                    <header className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            <I18nText dict={aboutPageLabels.servicesTitle} lang={lang}/>
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <I18nText dict={aboutPageLabels.servicesTagline} lang={lang}/>
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
                            {aboutContent.services.map((x) => (
                                <div
                                    key={x.key}
                                    className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        <I18nText dict={x.title} lang={lang}/>
                                    </div>
                                    <I18nText as="p" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400" dict={x.desc} lang={lang}/>
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
                            {aboutContent.faq.map((x) => (
                                <details
                                    key={x.key}
                                    className="group rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
                                >
                                    <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        <I18nText dict={x.q} lang={lang}/>
                                        <span className="float-right text-slate-500 group-open:text-slate-700 dark:text-slate-400 dark:group-open:text-slate-200">
                      ▾
                    </span>
                                    </summary>
                                    <I18nText as="p" className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400" dict={x.a} lang={lang}/>
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
                            <I18nText dict={aboutPageLabels.contactTagline} lang={lang}/>
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