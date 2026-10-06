import type { GatsbyNode } from "gatsby"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import { JSDOM } from "jsdom"
import createDOMPurify from "dompurify"
import { POST_SANITIZE_CONFIG } from "./src/lib/sanitizeConfig"
import { initializeApp, getApps } from "firebase/app"
import { initializeFirestore, getFirestore, collection, getDocs, type Timestamp } from "firebase/firestore"

// Gatsby는 .env.development/.env.production을 브라우저 번들용 DefinePlugin에만 주입하고
// gatsby-node.ts 같은 Node 코드의 process.env에는 넣어주지 않아서, 여기서 직접 로드해야 한다.
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV || "development"}`) })

const DATA_DIR = path.join(__dirname, "src/data")

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = () => {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
    const { createTypes } = actions

    const typeDefs = `
    type StocksKoreaJson implements Node {
      symbol: String
      market: String
      stock_name: String
      growth: Float
      dividend: Float
      recent_price: Float
      price_growth: Float
      basis_date: String
    }
    type StocksUsaJson implements Node {
      symbol: String
      market: String
      stock_name: String
      growth: Float
      dividend: Float
      recent_price: Float
      price_growth: Float
      basis_date: String
    }
    type StocksJapanJson implements Node {
      symbol: String
      market: String
      stock_name: String
      growth: Float
      dividend: Float
      recent_price: Float
      price_growth: Float
      basis_date: String
    }
    type StockDetail implements Node {
      symbol: String
      market: String
      stock_name: String
      local_name: String
      country: String
      growth: Float
      dividend: Float
      recent_price: Float
      basis_date: String
      nps_holding: Boolean
      overview: String
    }
    type Investor implements Node {
      symbol: String
      base_date: String
      investor_count: Float
      avg_price: Float
    }
    type Shareholder implements Node {
      date: String
      holder_name: String
      symbol: String
      value: Float
    }
    type BoardPost implements Node {
      postId: String
      title: String
      updatedAt: String
      createdAt: String
      contentHtml: String
      description: String
      authorUid: String
      authorName: String
      authorRole: String
      notice: Boolean
      category: String
      views: Float
      relatedSymbols: [String]
    }
    type PerformanceEntry implements Node {
      entryId: String
      year: Int
      stockName: String
      returnRate: Float
    }
  `
    createTypes(typeDefs)
}

interface BoardPostData {
    postId: string
    title: string | null
    updatedAt: string | null
    createdAt: string | null
    contentHtml: string
    description: string
    authorUid: string | null
    authorName: string | null
    authorRole: string | null
    notice: boolean
    category: string | null
    views: number
    relatedSymbols: string[]
}

interface PerformanceEntryData {
    entryId: string
    year: number
    stockName: string
    returnRate: number
}

interface RelatedStock {
    symbol: string
    stock_name: string | null
    market: string | null
    recent_price: number | null
    growth: number | null
}

// Node에는 DOM이 없어서 기본 DOMPurify 인스턴스는 sanitize를 하지 못하고 입력을 그대로 돌려준다.
// 회원이 작성한 HTML이 정적 페이지에 그대로 박히면 저장형 XSS가 되므로 jsdom window로 인스턴스를 만든다.
const jsdomWindow = new JSDOM("").window
const purify = createDOMPurify(jsdomWindow as unknown as Parameters<typeof createDOMPurify>[0])

const toExcerpt = (html: string, maxLength = 160) => {
    const container = jsdomWindow.document.createElement("div")
    container.innerHTML = html
    const text = (container.textContent ?? "").replace(/\s+/g, " ").trim()
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

const getBuildFirestore = () => {
    const firebaseConfig = {
        apiKey: process.env.GATSBY_FIREBASE_API_KEY,
        authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
        appId: process.env.GATSBY_FIREBASE_APP_ID,
    }

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null

    const appName = "gatsby-node-sitemap"
    const existingApp = getApps().find((app) => app.name === appName)
    const app = existingApp ?? initializeApp(firebaseConfig, appName)
    return existingApp ? getFirestore(app) : initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
}

// 게시글은 Firestore에만 존재해서 로컬 json 스냅샷이 없으므로, sitemap과 게시글 상세 정적 페이지를
// 만들기 위해 빌드 시점에 Firestore에서 게시글을 직접 조회해 노드로 만든다.
const fetchBoardPosts = async (): Promise<BoardPostData[]> => {
    const db = getBuildFirestore()
    if (!db) return []

    const [snapshot, relationSnapshot] = await Promise.all([
        getDocs(collection(db, "posts")),
        // 관계 조회가 실패해도(규칙 미배포 등) 게시글 페이지 생성까지 막히지 않도록 빈 결과로 대체한다.
        getDocs(collection(db, "related_posts")).catch(() => ({ docs: [] })),
    ])

    const symbolsByPost = new Map<string, string[]>()
    relationSnapshot.docs.forEach((doc) => {
        const { postId, symbol } = doc.data() as { postId?: string; symbol?: string }
        if (!postId || !symbol) return
        symbolsByPost.set(postId, [...(symbolsByPost.get(postId) ?? []), symbol])
    })

    return snapshot.docs.map((doc) => {
        const data = doc.data() as {
            title?: string
            contentHtml?: string
            authorUid?: string
            authorName?: string
            authorRole?: string
            notice?: boolean
            category?: string
            views?: number
            updatedAt?: Timestamp
            createdAt?: Timestamp
        }
        const timestamp = data.updatedAt ?? data.createdAt
        const contentHtml = purify.sanitize(data.contentHtml ?? "", POST_SANITIZE_CONFIG)
        return {
            postId: doc.id,
            title: data.title ?? null,
            updatedAt: timestamp ? timestamp.toDate().toISOString() : null,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
            contentHtml,
            description: toExcerpt(contentHtml),
            authorUid: data.authorUid ?? null,
            authorName: data.authorName ?? null,
            authorRole: data.authorRole ?? null,
            notice: data.notice ?? false,
            category: data.category === "domestic" || data.category === "overseas" ? data.category : null,
            views: data.views ?? 0,
            relatedSymbols: (symbolsByPost.get(doc.id) ?? []).sort(),
        }
    })
}

// 성과 페이지도 Firestore에만 데이터가 있어서, 빌드 시점에 조회해 정적 HTML에 수익률이 담기도록 한다.
const fetchPerformanceEntries = async (): Promise<PerformanceEntryData[]> => {
    const db = getBuildFirestore()
    if (!db) return []

    const snapshot = await getDocs(collection(db, "performance"))
    return snapshot.docs.map((doc) => {
        const data = doc.data() as { year?: number; stockName?: string; returnRate?: number }
        return {
            entryId: doc.id,
            year: data.year ?? 0,
            stockName: data.stockName ?? "",
            returnRate: data.returnRate ?? 0,
        }
    })
}

// stock-details-*.json / shareholders-*.json는 50개 단위로 청크된 여러 파일로 나뉘어 있어서,
// gatsby-transformer-json의 파일명 기반 타입 추론 대신 직접 노드를 만들어 하나의 타입으로 합친다.
export const sourceNodes: GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest, reporter }) => {
    const { createNode } = actions

    try {
        const posts = await fetchBoardPosts()
        await Promise.all(
            posts.map((post) =>
                createNode({
                    ...post,
                    id: createNodeId(`BoardPost-${post.postId}`),
                    parent: null,
                    children: [],
                    internal: {
                        type: "BoardPost",
                        contentDigest: createContentDigest(post),
                    },
                })
            )
        )
    } catch (error) {
        reporter.warn(`게시글 sitemap용 Firestore 조회 실패, 게시글 URL 없이 진행합니다: ${error}`)
    }

    try {
        const entries = await fetchPerformanceEntries()
        entries.forEach((entry) =>
            createNode({
                ...entry,
                id: createNodeId(`PerformanceEntry-${entry.entryId}`),
                parent: null,
                children: [],
                internal: {
                    type: "PerformanceEntry",
                    contentDigest: createContentDigest(entry),
                },
            })
        )
    } catch (error) {
        reporter.warn(`성과 데이터 Firestore 조회 실패, 빈 성과 페이지로 진행합니다: ${error}`)
    }

    if (!fs.existsSync(DATA_DIR)) return

    const stockTargets = [
        { prefix: "stock-details-korea", summaryFile: "stocks-korea.json", country: "KOREA" },
        { prefix: "stock-details-usa", summaryFile: "stocks-usa.json", country: "USA" },
        { prefix: "stock-details-japan", summaryFile: "stocks-japan.json", country: "JAPAN" },
    ]

    for (const { prefix, summaryFile, country } of stockTargets) {
        const chunkFiles = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith(`${prefix}-`) && f.endsWith(".json"))

        // DB에서 추출한 상세 청크 파일이 있으면 그걸 우선 쓰고, 없으면 요약 json으로 대체한다.
        let rows: Record<string, unknown>[] = []
        if (chunkFiles.length > 0) {
            rows = chunkFiles.flatMap((file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")))
        } else {
            const summaryPath = path.join(DATA_DIR, summaryFile)
            if (fs.existsSync(summaryPath)) {
                rows = JSON.parse(fs.readFileSync(summaryPath, "utf-8"))
            }
        }

        rows.forEach((row) => {
            const nodeData = { ...row, country }
            createNode({
                ...nodeData,
                id: createNodeId(`StockDetail-${row.symbol}`),
                parent: null,
                children: [],
                internal: {
                    type: "StockDetail",
                    contentDigest: createContentDigest(nodeData),
                },
            })
        })
    }

    const shareFiles = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith("shareholders-") && f.endsWith(".json"))

    for (const file of shareFiles) {
        const rows = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"))

        rows.forEach((row: Record<string, unknown>) => {
            createNode({
                ...row,
                id: createNodeId(`Shareholder-${row.id}`),
                parent: null,
                children: [],
                internal: {
                    type: "Shareholder",
                    contentDigest: createContentDigest(row),
                },
            })
        })
    }

    const investorFiles = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith("investors-") && f.endsWith(".json"))

    for (const file of investorFiles) {
        const rows = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"))

        rows.forEach((row: Record<string, unknown>) => {
            createNode({
                ...row,
                id: createNodeId(`Investor-${row.id}`),
                parent: null,
                children: [],
                internal: {
                    type: "Investor",
                    contentDigest: createContentDigest(row),
                },
            })
        })
    }
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    const stockResult = await graphql<{ allStockDetail: { nodes: RelatedStock[] } }>(`
        query StockDetailPages {
            allStockDetail {
                nodes {
                    symbol
                    stock_name
                    market
                    recent_price
                    growth
                }
            }
        }
    `)

    if (stockResult.errors) {
        reporter.panicOnBuild("종목 상세 페이지 쿼리 실패", stockResult.errors)
        return
    }

    const stockNodes = stockResult.data?.allStockDetail.nodes ?? []
    const stockBySymbol = new Map(stockNodes.map((node) => [node.symbol, node]))

    stockNodes.forEach((node) => {
        createPage({
            path: `/stocks/${node.symbol}`,
            component: path.resolve("./src/templates/StockDetail.tsx"),
            context: { symbol: node.symbol },
        })
    })

    // 게시글 상세 페이지는 예전엔 File System Route API의 [articleId] client-only route(matchPath)로
    // 처리해서 빌드 타임에 정적 파일이 생성되지 않았고, 그 결과 구글 크롤러가 접근하면 404가 났다.
    // BoardPost 노드(sourceNodes에서 Firestore로부터 조회)를 기준으로 제목/본문이 담긴 실제 페이지를 생성한다.
    const boardResult = await graphql<{ allBoardPost: { nodes: Omit<BoardPostData, "updatedAt">[] } }>(`
        query BoardDetailPages {
            allBoardPost {
                nodes {
                    postId
                    title
                    createdAt
                    contentHtml
                    description
                    authorUid
                    authorName
                    authorRole
                    notice
                    category
                    views
                    relatedSymbols
                }
            }
        }
    `)

    if (boardResult.errors) {
        reporter.panicOnBuild("게시글 상세 페이지 쿼리 실패", boardResult.errors)
        return
    }

    const boardPostNodes = boardResult.data?.allBoardPost.nodes ?? []
    const boardDetailTemplate = path.resolve("./src/templates/BoardDetail.tsx")
    const total = boardPostNodes.length

    // 이전글/다음글은 같은 카테고리 안에서 작성일 순으로 정한다. 게시판 목록처럼 카테고리가 없으면 국내로 본다.
    type AdjacentPost = { postId: string; title: string; createdAt: string | null }
    const adjacentByPost = new Map<string, { prev: AdjacentPost | null; next: AdjacentPost | null }>()
    const postsByCategory = new Map<string, typeof boardPostNodes>()
    boardPostNodes.forEach((node) => {
        if (!node.postId || !node.createdAt) return
        const category = node.category ?? "domestic"
        postsByCategory.set(category, [...(postsByCategory.get(category) ?? []), node])
    })
    postsByCategory.forEach((nodes) => {
        const sorted = [...nodes].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        const toAdjacent = (node?: (typeof sorted)[number]): AdjacentPost | null =>
            node ? { postId: node.postId, title: node.title ?? "", createdAt: node.createdAt } : null
        sorted.forEach((node, i) => {
            adjacentByPost.set(node.postId, { prev: toAdjacent(sorted[i + 1]), next: toAdjacent(sorted[i - 1]) })
        })
    })

    boardPostNodes.forEach((node, index) => {
        if (!node.postId) return

        const { postId, title, description, relatedSymbols, ...post } = node
        const relatedStocks = (relatedSymbols ?? []).flatMap((symbol) => stockBySymbol.get(symbol) ?? [])
        createPage({
            path: `/boards/${postId}`,
            component: boardDetailTemplate,
            context: {
                postId,
                title,
                description,
                relatedStocks,
                adjacentPosts: adjacentByPost.get(postId) ?? { prev: null, next: null },
                post: { ...post, title: title ?? "" },
            },
        })

        reporter.info(`Creating page ${index + 1}/${total}: /boards/${node.postId}/`)
    })
}
