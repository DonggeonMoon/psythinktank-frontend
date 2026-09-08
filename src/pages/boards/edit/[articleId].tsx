import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {navigate, PageProps} from "gatsby";
import {doc, getDoc, updateDoc, serverTimestamp} from "firebase/firestore";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ToastEditor, {ToastEditorHandle} from "../../../components/ToastEditor";
import {db} from "../../../firebase/client";
import {useAuth} from "../../../contexts/AuthContext";
import {isStaffRole} from "../../../lib/roles";
import {BOARD_CATEGORY_LABEL, BoardCategory} from "../../../lib/boardCategory";

const CATEGORIES: BoardCategory[] = ["domestic", "overseas"];

interface Post {
    title: string;
    contentHtml: string;
    authorUid: string;
    notice: boolean;
    category: BoardCategory;
}

const EditPage: React.FC<PageProps> = ({params}) => {
    const {articleId} = params;
    const {user, profile, loading: authLoading} = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<BoardCategory>("domestic");
    const [notice, setNotice] = useState(false);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
                    수정 권한이 없거나 존재하지 않는 게시글입니다.
                </main>
                <Footer/>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }
        if (!db || !articleId) return;

        const contentHtml = editorRef.current?.getHTML() ?? "";

        setSubmitting(true);
        try {
            await updateDoc(doc(db, "posts", articleId), {
                title: title.trim(),
                contentHtml,
                category,
                notice: isStaffRole(profile?.role) ? notice : post.notice,
                updatedAt: serverTimestamp(),
            });
            await navigate(`/boards/${articleId}`);
        } catch {
            setError("게시글 수정에 실패했습니다.");
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">글 수정</h1>

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
                                {BOARD_CATEGORY_LABEL[c]}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                    />

                    <ToastEditor ref={editorRef} initialValue={post.contentHtml}/>

                    {isStaffRole(profile?.role) && (
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={notice}
                                onChange={(e) => setNotice(e.target.checked)}
                            />
                            공지사항으로 등록
                        </label>
                    )}

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(`/boards/${articleId}`)}
                            className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            {submitting ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default EditPage;
