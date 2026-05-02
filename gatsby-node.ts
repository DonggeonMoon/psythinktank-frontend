import type { GatsbyNode } from "gatsby"

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
  `
    createTypes(typeDefs)
}