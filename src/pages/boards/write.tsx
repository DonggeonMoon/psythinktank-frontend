import * as React from "react";
import {useEffect, useRef, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {navigate} from "gatsby";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ToastEditor, {ToastEditorHandle} from "../../components/ToastEditor";
import {db} from "../../firebase/client";
import {useAuth} from "../../contexts/AuthContext";
import {isStaffRole} from "../../lib/roles";
import {BOARD_CATEGORY_LABEL, BoardCategory} from "../../lib/boardCategory";

const CATEGORIES: BoardCategory[] = ["domestic", "overseas"];

const WritePage: React.FC<PageProps> = ({location}) => {
    const {user, profile, loading} = useAuth();
    const initialCategory = new URLSearchParams(location.search).get("category");
    const [category, setCategory] = useState<BoardCategory>(
        initialCategory === "overseas" ? "overseas" : "domestic"
    );
    const [title, setTitle] = useState("");
    const [notice, setNotice] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const editorRef = useRef<ToastEditorHandle>(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
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
        if (!db) return;

        const contentHtml = editorRef.current?.getHTML() ?? "";

        setSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                title: title.trim(),
                contentHtml,
                category,
                authorUid: user.uid,
                authorName: profile?.nickname ?? user.email,
                notice: isStaffRole(profile?.role) ? notice : false,
                views: 0,
                legacyPostId: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            await navigate(`/boards/${docRef.id}`);
        } catch {
            setError("게시글 등록에 실패했습니다.");
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">글쓰기</h1>

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

                    <ToastEditor ref={editorRef}/>

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
                            onClick={() => navigate("/boards")}
                            className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            {submitting ? "등록 중..." : "등록"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>
    );
};

export default WritePage;

export const Head: HeadFC = () => <title>글쓰기</title>;
