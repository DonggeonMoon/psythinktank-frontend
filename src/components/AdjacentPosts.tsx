import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {db} from "../firebase/client";
import {type AdjacentPost, type AdjacentPosts as AdjacentPostsData, fetchAdjacentPosts} from "../lib/adjacentPosts";
import type {BoardCategory} from "../lib/boardCategory";
import {formatDate} from "../lib/date";
import I18nText from "./I18nText";
import {boardDetailLabels} from "../i18n/pageLabels";
import {useLang} from "../contexts/LangContext";
import type {Lang} from "../i18n/stockLabels";

interface AdjacentPostsProps {
    postId: string;
    category: BoardCategory | null;
    createdAt: string | null;
    // 빌드 시점 스냅샷. 빌드 이후 작성된 글이 반영되도록 마운트 후 Firestore에서 다시 조회한다.
    initial: AdjacentPostsData;
}

const labelClass = "w-14 shrink-0 font-medium text-slate-500 dark:text-slate-400";

const Row: React.FC<{ label: Record<Lang, string>; post: AdjacentPost | null; lang: Lang }> = ({label, post, lang}) => (
    <li>
        {post ? (
            <Link
                to={`/boards/${post.postId}`}
                className="group flex items-center gap-4 px-2 py-3 text-sm"
            >
                <span className={labelClass}><I18nText dict={label} lang={lang}/></span>
                <span className="flex-1 truncate text-slate-900 group-hover:underline dark:text-slate-100">{post.title}</span>
                <span className="hidden sm:block shrink-0 text-xs font-mono text-slate-500">{formatDate(post.createdAt)}</span>
            </Link>
        ) : (
            <div className="flex items-center gap-4 px-2 py-3 text-sm">
                <span className={labelClass}><I18nText dict={label} lang={lang}/></span>
                <span className="flex-1 text-slate-400 dark:text-slate-500"><I18nText dict={boardDetailLabels.noAdjacentPost} lang={lang}/></span>
            </div>
        )}
    </li>
);

const AdjacentPosts: React.FC<AdjacentPostsProps> = ({postId, category, createdAt, initial}) => {
    const {lang} = useLang();
    const [posts, setPosts] = useState<AdjacentPostsData>(initial);

    useEffect(() => {
        if (!db || !category || !createdAt) return;
        fetchAdjacentPosts(db, postId, category, createdAt).then(setPosts).catch(() => {});
    }, [postId, category, createdAt]);

    if (!posts.prev && !posts.next) return null;

    return (
        <ul className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            <Row label={boardDetailLabels.nextPost} post={posts.next} lang={lang}/>
            <Row label={boardDetailLabels.prevPost} post={posts.prev} lang={lang}/>
        </ul>
    );
};

export default AdjacentPosts;
