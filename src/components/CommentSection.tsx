import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {
    addDoc,
    collection,
    doc,
    type Firestore,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import {db} from "../firebase/client";
import {useAuth} from "../contexts/AuthContext";
import {isStaffRole} from "../lib/roles";

interface Comment {
    id: string;
    content: string;
    authorUid: string;
    authorName: string;
    createdAt: Timestamp | null;
    deleted: boolean;
    deletedReason: "self" | "policy" | null;
}

const formatDateTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";

const CommentSection: React.FC<{ postId: string }> = ({postId}) => {
    const {user, profile} = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newContent, setNewContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const commentsRef = (firestore: Firestore) => collection(firestore, "posts", postId, "comments");

    const loadComments = async () => {
        if (!db) return;
        const snapshot = await getDocs(query(commentsRef(db), orderBy("createdAt", "asc")));
        setComments(
            snapshot.docs.map((d) => {
                const data = d.data();
                return {
                    id: d.id,
                    content: data.content ?? "",
                    authorUid: data.authorUid,
                    authorName: data.authorName,
                    createdAt: data.createdAt ?? null,
                    deleted: data.deleted ?? false,
                    deletedReason: data.deletedReason ?? null,
                };
            })
        );
        setLoading(false);
    };

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db || !user || !newContent.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(commentsRef(db), {
                content: newContent.trim(),
                authorUid: user.uid,
                authorName: profile?.nickname ?? "알 수 없음",
                deleted: false,
                deletedReason: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setNewContent("");
            await loadComments();
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleEditSave = async (commentId: string) => {
        if (!db || !editContent.trim()) return;
        await updateDoc(doc(db, "posts", postId, "comments", commentId), {
            content: editContent.trim(),
            updatedAt: serverTimestamp(),
        });
        setEditingId(null);
        await loadComments();
    };

    const handleDelete = async (comment: Comment) => {
        if (!db || !user) return;
        if (!window.confirm("이 댓글을 삭제하시겠습니까?")) return;

        const isAuthor = user.uid === comment.authorUid;
        await updateDoc(doc(db, "posts", postId, "comments", comment.id), {
            content: "",
            deleted: true,
            deletedReason: isAuthor ? "self" : "policy",
            updatedAt: serverTimestamp(),
        });
        await loadComments();
    };

    return (
        <section className="space-y-4 border-t border-slate-100 pt-8 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                댓글 {comments.filter((c) => !c.deleted).length}
            </h2>

            {user ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        rows={3}
                        className={inputClass}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !newContent.trim()}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                        >
                            등록
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/login" className="underline hover:text-slate-900 dark:hover:text-white">로그인</Link> 후 댓글을 작성할 수 있습니다.
                </p>
            )}

            {loading ? (
                <p className="text-sm text-slate-400">불러오는 중...</p>
            ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {comments.map((comment) => (
                        <li key={comment.id} className="py-4 space-y-1">
                            {comment.deleted ? (
                                <p className="text-sm italic text-slate-400 dark:text-slate-600">
                                    {comment.deletedReason === "policy"
                                        ? "사이트 정책 위반으로 삭제된 댓글입니다."
                                        : "삭제된 댓글입니다."}
                                </p>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{comment.authorName}</span>
                                            <span>{formatDateTime(comment.createdAt)}</span>
                                        </div>
                                        {user && (user.uid === comment.authorUid || isStaffRole(profile?.role)) && (
                                            <div className="flex gap-2">
                                                {user.uid === comment.authorUid && editingId !== comment.id && (
                                                    <button
                                                        onClick={() => startEdit(comment)}
                                                        className="hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        수정
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(comment)}
                                                    className="hover:text-red-600 dark:hover:text-red-400"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingId === comment.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={3}
                                                className={inputClass}
                                            />
                                            <div className="flex justify-end gap-2 text-xs">
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="rounded-md border border-slate-300 px-3 py-1 dark:border-slate-700"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={() => handleEditSave(comment.id)}
                                                    className="rounded-md bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900"
                                                >
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default CommentSection;
