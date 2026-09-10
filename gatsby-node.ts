import type { GatsbyNode } from "gatsby"
import * as fs from "fs"
import * as path from "path"

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
  `
    createTypes(typeDefs)
}

// stock-details-*.json / shareholders-*.json는 50개 단위로 청크된 여러 파일로 나뉘어 있어서,
// gatsby-transformer-json의 파일명 기반 타입 추론 대신 직접 노드를 만들어 하나의 타입으로 합친다.
export const sourceNodes: GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions
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

    const result = await graphql<{ allStockDetail: { nodes: { symbol: string }[] } }>(`
        query {
            allStockDetail {
                nodes {
                    symbol
                }
            }
        }
    `)

    if (result.errors) {
        reporter.panicOnBuild("종목 상세 페이지 쿼리 실패", result.errors)
        return
    }

    const nodes = result.data?.allStockDetail.nodes ?? []

    nodes.forEach((node) => {
        createPage({
            path: `/stocks/${node.symbol}`,
            component: path.resolve("./src/templates/StockDetail.tsx"),
            context: { symbol: node.symbol },
        })
    })
}
