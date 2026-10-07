import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {graphql, navigate, HeadFC, PageProps} from "gatsby";
import {doc, getDoc, serverTimestamp, writeBatch} from "firebase/firestore";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ToastEditor, {ToastEditorHandle} from "../../../components/ToastEditor";
import StockPicker, {type PickableStock} from "../../../components/StockPicker";
import {db} from "../../../firebase/client";
import {useAuth} from "../../../contexts/AuthContext";
import {isStaffRole} from "../../../lib/roles";
import {BoardCategory} from "../../../lib/boardCategory";
import {useLang} from "../../../contexts/LangContext";
import {boardCategoryI18n, boardEditorLabels} from "../../../i18n/pageLabels";
import {fetchRelatedSymbols, stageRelatedStocks} from "../../../lib/relatedPosts";

export const query = graphql`
  query {
    allStockDetail(sort: { symbol: ASC }) {
      nodes {
        symbol
        stock_name
        market
      }
    }
  }
`;

interface DataProps {
    allStockDetail: { nodes: PickableStock[] };
}

const CATEGORIES: BoardCategory[] = ["domestic", "overseas"];

interface Post {
    title: string;
    contentHtml: string;
    authorUid: string;
    notice: boolean;
    category: BoardCategory;
}

const EditPage: React.FC<PageProps<DataProps>> = ({data: pageData, params}) => {
    const {articleId} = params;
    const {user, profile, loading: authLoading} = useAuth();
    const {lang} = useLang();

    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<BoardCategory>("domestic");
    const [notice, setNotice] = useState(false);
    const [initialSymbols, setInitialSymbols] = useState<string[]>([]);
    const [relatedSymbols, setRelatedSymbols] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<keyof typeof boardEditorLabels | null>(null);
    const editorRef = useRef<ToastEditorHandle>(null);

    useEffect(() => {
        if (!db || !articleId || authLoading) return;

        (async () => {
            const snapshot = await getDoc(doc(db, "posts", articleId));
            if (!snapshot.exists()) {
                setForbidden(true);
                setLoading(false);
                return;
            }

            const data = snapshot.data() as Post;
            const canEdit = !!user && (user.uid === data.authorUid || isStaffRole(profile?.role));
            if (!canEdit) {
                setForbidden(true);
                setLoading(false);
                return;
            }

            setPost(data);
            setTitle(data.title);
            setCategory(data.category ?? "domestic");
            setNotice(data.notice ?? false);
            const symbols = await fetchRelatedSymbols(db, articleId);
            setInitialSymbols(symbols);
            setRelatedSymbols(symbols);
            setLoading(false);
        })();
    }, [articleId, authLoading, user, profile]);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [authLoading, user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    if (forbidden || !post) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1 p-10 text-center text-slate-500 dark:text-slate-400">
                    {boardEditorLabels.forbidden[lang]}
                </main>
                <Footer/>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("titleRequired");
            return;
        }
        if (!db || !articleId) return;

        const contentHtml = editorRef.current?.getHTML() ?? "";

        setSubmitting(true);
        try {
            const batch = writeBatch(db);
            batch.update(doc(db, "posts", articleId), {
                title: title.trim(),
                contentHtml,
                category,
                notice: isStaffRole(profile?.role) ? notice : post.notice,
                updatedAt: serverTimestamp(),
            });
            stageRelatedStocks(batch, db, articleId, initialSymbols, relatedSymbols);
            await batch.commit();
            await navigate(`/boards/${articleId}`);
        } catch {
            setError("updateFailed");
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{boardEditorLabels.editTitle[lang]}</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                                    category === c
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                                        : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                                }`}
                            >
                                {boardCategoryI18n[c][lang]}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        placeholder={boardEditorLabels.titlePlaceholder[lang]}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                    />

                    <ToastEditor ref={editorRef} initialValue={post.contentHtml}/>

                    <StockPicker stocks={pageData.allStockDetail.nodes} value={relatedSymbols} onChange={setRelatedSymbols}/>

                    {isStaffRole(profile?.role) && (
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={notice}
                                onChange={(e) => setNotice(e.target.checked)}
                            />
                            {boardEditorLabels.registerAsNotice[lang]}
                        </label>
                    )}

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{boardEditorLabels[error][lang]}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(`/boards/${articleId}`)}
                            className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            {boardEditorLabels.cancel[lang]}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            {submitting ? boardEditorLabels.saving[lang] : boardEditorLabels.save[lang]}
                        </button>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default EditPage;

export const Head: HeadFC = () => (
    <>
        <title>글 수정</title>
        <link rel="stylesheet" href="/toastui-editor.css"/>;
    </>
);
