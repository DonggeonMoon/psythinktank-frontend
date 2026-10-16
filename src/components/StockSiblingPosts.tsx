import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {db} from "../firebase/client";
import {fetchStockSiblingPosts, type RelatedPost} from "../lib/relatedPosts";
import {formatDate} from "../lib/date";
import I18nText from "./I18nText";
import {boardDetailLabels} from "../i18n/pageLabels";
import {useLang} from "../contexts/LangContext";

interface StockSiblingPostsProps {
    postId: string;
    // 빌드 시점 스냅샷. 빌드 이후 연결된 글이 반영되도록 마운트 후 Firestore에서 다시 조회한다.
    initial: RelatedPost[];
}

const StockSiblingPosts: React.FC<StockSiblingPostsProps> = ({postId, initial}) => {
    const {lang} = useLang();
    const [posts, setPosts] = useState<RelatedPost[]>(initial);

    useEffect(() => {
        if (!db) return;
        fetchStockSiblingPosts(db, postId).then(setPosts).catch(() => {});
    }, [postId]);

    if (posts.length === 0) return null;

    return (
        <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-24">
            <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                <I18nText dict={boardDetailLabels.stockSiblingPosts} lang={lang}/>
            </h2>
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {posts.map((post) => (
                    <li key={post.postId}>
                        <Link
                            to={`/boards/${post.postId}`}
                            className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                        >
                            <span className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{post.title}</span>
                            <span className="mt-1 block text-xs font-mono text-slate-500">{formatDate(post.createdAt)}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default StockSiblingPosts;
