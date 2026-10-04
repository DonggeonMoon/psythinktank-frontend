import * as React from "react";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import {db} from "../firebase/client";
import {fetchRelatedPosts, type RelatedPost} from "../lib/relatedPosts";
import {formatDate} from "../lib/date";
import I18nText from "./I18nText";
import AnimatedGradientBorder from "./AnimatedGradientBorder";
import {stockLabels} from "../i18n/stockLabels";
import {useLang} from "../contexts/LangContext";

const RelatedPosts: React.FC<{ symbol: string }> = ({symbol}) => {
    const {lang} = useLang();
    const [posts, setPosts] = useState<RelatedPost[] | null>(null);

    useEffect(() => {
        if (!db) return;
        fetchRelatedPosts(db, symbol).then(setPosts).catch(() => {});
    }, [symbol]);

    if (!posts || posts.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold px-1"><I18nText dict={stockLabels.relatedPosts} lang={lang}/></h3>
            <div className="animated-gradient-border rounded-2xl [--gradient-border-size:280px]">
                <ul className="overflow-hidden rounded-[14px] divide-y divide-slate-100 dark:divide-slate-800">
                    {posts.map((post) => (
                        <li key={post.postId}>
                            <Link
                                to={`/boards/${post.postId}`}
                                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                            >
                                <span className="font-medium truncate">{post.title}</span>
                                <span className="shrink-0 text-xs font-mono text-slate-500">{formatDate(post.createdAt)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <AnimatedGradientBorder/>
            </div>
        </section>
    );
};

export default RelatedPosts;
