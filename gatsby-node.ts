import type { GatsbyNode } from "gatsby"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
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
      country: String
      growth: Float
      dividend: Float
      recent_price: Float
      basis_date: String
    }
    type Shareholder implements Node {
      date: String
      holder_name: String
      symbol: String
      value: Float
    }
    type BoardPost implements Node {
      postId: String
      updatedAt: String
    }
  `
    createTypes(typeDefs)
}

// 게시글은 Firestore에만 존재해서 로컬 json 스냅샷이 없으므로, sitemap에 실제 게시글 URL을
// 포함시키기 위해 빌드 시점에 Firestore에서 게시글 id 목록만 직접 조회해 노드로 만든다.
const fetchBoardPosts = async (): Promise<{ postId: string; updatedAt: string | null }[]> => {
    const firebaseConfig = {
        apiKey: process.env.GATSBY_FIREBASE_API_KEY,
        authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
        appId: process.env.GATSBY_FIREBASE_APP_ID,
    }

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return []

    const appName = "gatsby-node-sitemap"
    const existingApp = getApps().find((app) => app.name === appName)
    const app = existingApp ?? initializeApp(firebaseConfig, appName)
    const db = existingApp ? getFirestore(app) : initializeFirestore(app, { experimentalAutoDetectLongPolling: true })

    const snapshot = await getDocs(collection(db, "posts"))

    return snapshot.docs.map((doc) => {
        const data = doc.data() as { updatedAt?: Timestamp; createdAt?: Timestamp }
        const timestamp = data.updatedAt ?? data.createdAt
        return { postId: doc.id, updatedAt: timestamp ? timestamp.toDate().toISOString() : null }
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
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    const stockResult = await graphql<{ allStockDetail: { nodes: { symbol: string }[] } }>(`
        query {
            allStockDetail {
                nodes {
                    symbol
                }
            }
        }
    `)

    if (stockResult.errors) {
        reporter.panicOnBuild("종목 상세 페이지 쿼리 실패", stockResult.errors)
        return
    }

    const stockNodes = stockResult.data?.allStockDetail.nodes ?? []

    stockNodes.forEach((node) => {
        createPage({
            path: `/stocks/${node.symbol}`,
            component: path.resolve("./src/templates/StockDetail.tsx"),
            context: { symbol: node.symbol },
        })
    })

    // 게시글 상세 페이지는 예전엔 File System Route API의 [articleId] client-only route(matchPath)로
    // 처리해서 빌드 타임에 정적 파일이 생성되지 않았고, 그 결과 구글 크롤러가 접근하면 404가 났다.
    // BoardPost 노드(postId 목록, sourceNodes에서 Firestore로부터 조회)를 기준으로 실제 페이지를 생성한다.
    const boardResult = await graphql<{ allBoardPost: { nodes: { postId: string }[] } }>(`
        query {
            allBoardPost {
                nodes {
                    postId
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

    boardPostNodes.forEach((node, index) => {
        if (!node.postId) return

        createPage({
            path: `/boards/${node.postId}`,
            component: boardDetailTemplate,
            context: { postId: node.postId },
        })

        reporter.info(`Creating page ${index + 1}/${total}: /boards/${node.postId}/`)
    })
}
