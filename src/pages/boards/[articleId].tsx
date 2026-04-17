import * as React from "react";
import { Link, PageProps } from "gatsby";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";

const DUMMY_DATA = [
    { id: "1", title: "게시판 이용 수칙 및 가이드 (필독)", author: "운영자", date: "2026.04.01", views: 10240, notice: true, content: "안녕하세요. 게시판 이용 수칙입니다. 서로를 존중하는 문화를 만들어갑시다." },
    { id: "2", title: "시스템 점검 안내 (04/20)", author: "운영자", date: "2026.04.18", views: 450, notice: true, content: "04월 20일 새벽 2시부터 4시까지 서비스 점검이 예정되어 있습니다." },
    { id: "3", title: "2026년 반도체 시장 전망 공유", author: "반도체장인", date: "2026.04.18", views: 1250, notice: false, content: "최근 공정 미세화와 AI 수요 폭증으로 인해 반도체 섹터의 성장이 기대됩니다..." },
    { id: "4", title: "나스닥 선물 변동성 대응 전략", author: "글로벌거시", date: "2026.04.17", views: 890, notice: false, content: "금리 인상 우려로 인한 나스닥 변동성이 커지고 있습니다. 현금 비중을..." },
    { id: "5", title: "초보자를 위한 배당주 투자 가이드", author: "꾸준함이답", date: "2026.04.16", views: 3200, notice: false, content: "배당주는 변동성 장세에서 훌륭한 방어주 역할을 합니다. 핵심은 배당 성장률입니다." },
];

const ArticlePage: React.FC<PageProps> = ({ params }) => {
    const { articleId } = params;

    const post = DUMMY_DATA.find((p) => p.id === articleId);

    if (!post) {
        return <div className="p-10 text-center">존재하지 않는 게시글입니다.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header />

            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-8">
                <div className="flex justify-start">
                    <Link to="/boards" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1">
                        ← 목록으로 돌아가기
                    </Link>
                </div>

                <article className="space-y-6">
                    <header className="space-y-4 border-b border-slate-100 pb-8 dark:border-slate-800">
                        <div className="space-y-2">
                            {post.notice && (
                                <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900 mb-2">
                                    공지사항
                                </span>
                            )}
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {post.title}
                            </h1>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-slate-900 dark:text-slate-300">{post.author}</span>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <span>{post.date}</span>
                            </div>
                            <div>
                                <span>조회수 {post.views.toLocaleString()}</span>
                            </div>
                        </div>
                    </header>

                    <div className="py-4 text-slate-800 dark:text-slate-300 leading-relaxed min-h-[300px] whitespace-pre-wrap">
                        {post.content}
                    </div>

                    <div className="flex justify-center border-t border-slate-100 pt-10 dark:border-slate-800">
                        <Link to="/boards" className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">
                            목록 보기
                        </Link>
                    </div>
                </article>
            </main>

            <Ticker />
            <Footer />
        </div>
    );
};

export default ArticlePage;

export const Head: React.FC<PageProps> = ({ params }) => {
    return <title>게시글 상세보기 | {params.articleId}</title>;
};