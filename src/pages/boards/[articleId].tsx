import * as React from "react";
import {useEffect, useState} from "react";
import {Link, navigate, PageProps} from "gatsby";
import {deleteDoc, doc, getDoc, increment, Timestamp, updateDoc} from "firebase/firestore";
import DOMPurify from "dompurify";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Ticker from "../../components/Ticker";
import {db} from "../../firebase/client";
import {useAuth} from "../../contexts/AuthContext";
import {isStaffRole, type Role} from "../../lib/roles";
import {BOARD_CATEGORY_LABEL, BoardCategory} from "../../lib/boardCategory";
import CommentSection from "../../components/CommentSection";
import RoleBadge from "../../components/RoleBadge";

interface Post {
    title: string;
    contentHtml: string;
    authorUid: string;
    authorName: string;
    authorRole: Role | null;
    createdAt: Timestamp | null;
    views: number;
    notice: boolean;
    category: BoardCategory;
}

const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const ArticlePage: React.FC<PageProps> = ({params}) => {
    const {articleId} = params;
    const {user, profile} = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!db || !articleId) return;
        const postRef = doc(db, "posts", articleId);

        (async () => {
            const snapshot = await getDoc(postRef);
            if (!snapshot.exists()) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setPost(snapshot.data() as Post);
            setLoading(false);

            updateDoc(postRef, {views: increment(1)}).catch(() => {});
        })();
    }, [articleId]);

    const canManage = !!user && !!post && (user.uid === post.authorUid || isStaffRole(profile?.role));

    const handleDelete = async () => {
        if (!db || !articleId) return;
        if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;

        await deleteDoc(doc(db, "posts", articleId));
        await navigate("/boards");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1 p-10 text-center text-slate-500 dark:text-slate-400">
                    존재하지 않는 게시글입니다.
                </main>
                <Footer/>
            </div>
        );
    }

    const sanitizedHtml = DOMPurify.sanitize(post.contentHtml);

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
                            <div className="flex items-center gap-2">
                                {post.category && (
                                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {BOARD_CATEGORY_LABEL[post.category]}
                                    </span>
                                )}
                                {post.notice && (
                                    <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                                        공지사항
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {post.title}
                            </h1>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-300">
                                    {post.authorName}
                                    <RoleBadge role={post.authorRole}/>
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div>
                                <span>조회수 {(post.views ?? 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </header>

                    <div
                        className="toastui-editor-contents py-4 min-h-[300px] text-slate-900 dark:text-slate-100 dark:[&_*]:!text-slate-100"
                        dangerouslySetInnerHTML={{__html: sanitizedHtml}}
                    />

                    <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-10 dark:border-slate-800">
                        <Link to="/boards" className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">
                            목록 보기
                        </Link>
                        {canManage && (
                            <>
                                <Link
                                    to={`/boards/edit/${articleId}`}
                                    className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                                >
                                    수정
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-md border border-red-300 px-6 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>

                    <CommentSection postId={articleId}/>
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
