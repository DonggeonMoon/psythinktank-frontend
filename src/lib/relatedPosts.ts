import {
    collection,
    doc,
    documentId,
    type Firestore,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    where,
    type WriteBatch,
} from "firebase/firestore";

export const RELATED_POSTS = "related_posts";

export const MAX_RELATED_STOCKS = 10;

// 문서 ID를 postId_symbol로 고정해 같은 글-종목 관계가 중복 저장되지 않게 한다.
const relationRef = (db: Firestore, postId: string, symbol: string) =>
    doc(db, RELATED_POSTS, `${postId}_${symbol}`);

export const fetchRelatedSymbols = async (db: Firestore, postId: string): Promise<string[]> => {
    const snapshot = await getDocs(query(collection(db, RELATED_POSTS), where("postId", "==", postId)));
    return snapshot.docs.map((d) => d.data().symbol as string).sort();
};

export interface RelatedPost {
    postId: string;
    title: string;
    createdAt: string | null;
}

// Firestore의 "in" 조건은 값 30개까지만 허용된다.
const IN_QUERY_LIMIT = 30;

export const fetchRelatedPosts = async (db: Firestore, symbol: string): Promise<RelatedPost[]> => {
    const relations = await getDocs(query(collection(db, RELATED_POSTS), where("symbol", "==", symbol)));
    const postIds = Array.from(new Set(relations.docs.map((d) => d.data().postId as string)));

    const chunks: string[][] = [];
    for (let i = 0; i < postIds.length; i += IN_QUERY_LIMIT) chunks.push(postIds.slice(i, i + IN_QUERY_LIMIT));

    const snapshots = await Promise.all(
        chunks.map((ids) => getDocs(query(collection(db, "posts"), where(documentId(), "in", ids))))
    );

    return snapshots
        .flatMap((s) => s.docs)
        .map((d) => {
            const data = d.data() as { title?: string; createdAt?: Timestamp | null };
            return {
                postId: d.id,
                title: data.title ?? "",
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
            };
        })
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
};

export const stageRelatedStocks = (
    batch: WriteBatch,
    db: Firestore,
    postId: string,
    previous: string[],
    next: string[]
) => {
    const prevSet = new Set(previous);
    const nextSet = new Set(next);

    next.filter((s) => !prevSet.has(s)).forEach((symbol) => {
        batch.set(relationRef(db, postId, symbol), {postId, symbol, createdAt: serverTimestamp()});
    });
    previous.filter((s) => !nextSet.has(s)).forEach((symbol) => {
        batch.delete(relationRef(db, postId, symbol));
    });
};
