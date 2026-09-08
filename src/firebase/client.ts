import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.GATSBY_FIREBASE_API_KEY,
    authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
    appId: process.env.GATSBY_FIREBASE_APP_ID,
};

const isBrowser = typeof window !== "undefined";

let auth: Auth | undefined;
let db: Firestore | undefined;

// Auth/Firestore는 브라우저 전용 persistence 계층을 쓰므로 SSR(Node) 빌드 중에는 초기화하지 않는다.
if (isBrowser) {
    const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

export { auth, db };
