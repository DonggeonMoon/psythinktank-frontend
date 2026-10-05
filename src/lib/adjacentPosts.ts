import {collection, type Firestore, getDocs, limit, orderBy, query, Timestamp, where} from "firebase/firestore";
import type {BoardCategory} from "./boardCategory";

export interface AdjacentPost {
    postId: string;
    title: string;
    createdAt: string | null;
}

export interface AdjacentPosts {
    prev: AdjacentPost | null;
    next: AdjacentPost | null;
}

const fetchOne = async (
    db: Firestore,
    postId: string,
    category: BoardCategory,
    createdAt: Timestamp,
    direction: "prev" | "next"
): Promise<AdjacentPost | null> => {
    // ISO 문자열에서 되돌린 시각은 밀리초 미만이 잘려 있어 비교 결과에 현재 글이 섞일 수 있으므로 2개를 받아 걸러낸다.
    const snapshot = await getDocs(
        query(
            collection(db, "posts"),
            where("category", "==", category),
            where("createdAt", direction === "prev" ? "<" : ">", createdAt),
            orderBy("createdAt", direction === "prev" ? "desc" : "asc"),
            limit(2)
        )
    );
    const found = snapshot.docs.find((d) => d.id !== postId);
    if (!found) return null;
    const data = found.data() as {title?: string; createdAt?: Timestamp | null};
    return {
        postId: found.id,
        title: data.title ?? "",
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };
};

export const fetchAdjacentPosts = async (
    db: Firestore,
    postId: string,
    category: BoardCategory,
    createdAtIso: string
): Promise<AdjacentPosts> => {
    const createdAt = Timestamp.fromDate(new Date(createdAtIso));
    const [prev, next] = await Promise.all([
        fetchOne(db, postId, category, createdAt, "prev"),
        fetchOne(db, postId, category, createdAt, "next"),
    ]);
    return {prev, next};
};
