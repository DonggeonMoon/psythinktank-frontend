import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `psythinktank`,
    siteUrl: `https://www.psythinktank.com`
  },
  graphqlTypegen: true,
  plugins: [
      "gatsby-plugin-postcss",
      "gatsby-transformer-json",
      {
          resolve: "gatsby-source-filesystem",
          options: {
              name: "data",
              path: `${__dirname}/src/data/`,
          },
      },
      {
          resolve: "gatsby-source-filesystem",
          options: {
              name: "newsletters",
              path: `${__dirname}/files/`,
          },
      },
  ]
};

export default config;
