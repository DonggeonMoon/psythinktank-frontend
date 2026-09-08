import * as React from "react";
import {graphql, type HeadFC, type PageProps} from "gatsby";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Ticker from "../../components/Ticker";

export const query = graphql`
  query {
    allFile(
      filter: { sourceInstanceName: { eq: "newsletters" } }
      sort: { name: DESC }
    ) {
      nodes {
        id
        name
        publicURL
        modifiedTime(formatString: "YYYY-MM-DD")
      }
    }
  }
`;

interface NewsletterFile {
    id: string;
    name: string;
    publicURL: string | null;
    modifiedTime: string;
}

interface DataProps {
    allFile: { nodes: NewsletterFile[] };
}

const NewsletterPage: React.FC<PageProps<DataProps>> = ({data}) => {
    const newsletters = data.allFile.nodes;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-8">

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            회보
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            제목을 클릭하면 해당 회보 파일을 열람하실 수 있습니다.
                        </p>
                    </div>
                </header>

                <section>
                    <div
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">

                        <div
                            className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-[13px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                            <div className="col-span-2">순번</div>
                            <div className="col-span-7">제목</div>
                            <div className="col-span-3 text-right">날짜</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {newsletters.length > 0 ? (
                                newsletters.map((item, idx) => (
                                    <a
                                        key={item.id}
                                        href={item.publicURL ?? "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center transition-all duration-200 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 group"
                                    >

                                        <div
                                            className="col-span-2 font-mono text-slate-400 dark:text-slate-500">
                                            {newsletters.length - idx}
                                        </div>

                                        <div className="col-span-7 flex items-center gap-2 overflow-hidden px-1">
              <span
                  className="truncate font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.name}
              </span>

                                            <svg
                                                className="w-4 h-4 shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                            </svg>
                                        </div>


                                        <div
                                            className="col-span-3 text-right font-mono text-slate-400 dark:text-slate-500 text-xs">
                                            {item.modifiedTime}
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <p className="text-sm">게시된 회보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Ticker/>
            <Footer/>
        </div>
    );
};

export default NewsletterPage;

export const Head: HeadFC = () => <title>회보 목록</title>;
