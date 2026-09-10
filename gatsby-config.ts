import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `psythinktank`,
    siteUrl: `https://www.psythinktank.com`
  },
  graphqlTypegen: true,
  plugins: [
      "gatsby-plugin-postcss",
      {
          resolve: "gatsby-plugin-sitemap",
          options: {
              query: `
                {
                  site {
                    siteMetadata {
                      siteUrl
                    }
                  }
                  allSitePage {
                    nodes {
                      path
                    }
                  }
                  allBoardPost {
                    nodes {
                      postId
                      updatedAt
                    }
                  }
                }
              `,
              resolvePages: ({
                  allSitePage: { nodes: allPages },
                  allBoardPost: { nodes: allBoardPosts },
              }: {
                  allSitePage: { nodes: { path: string }[] }
                  allBoardPost: { nodes: { postId: string; updatedAt: string | null }[] }
              }) => {
                  // 게시글 상세 경로는 allSitePage에도 잡히지만 lastmod 정보가 없으니,
                  // allBoardPost 쪽 항목(lastmod 포함)으로 대체하기 위해 allPages에서는 제외한다.
                  const boardPostPaths = new Set(allBoardPosts.map((post) => `/boards/${post.postId}/`))

                  return [
                      // File System Route API가 만든 [articleId] 같은 미해결 템플릿 경로는
                      // 실제 콘텐츠가 없는 자리표시자라 sitemap에서 제외한다.
                      ...allPages.filter((page) => !page.path.includes("[") && !boardPostPaths.has(page.path)),
                      ...allBoardPosts.map((post) => ({
                          path: `/boards/${post.postId}`,
                          lastmod: post.updatedAt,
                      })),
                  ]
              },
              serialize: ({ path, lastmod }: { path: string; lastmod?: string | null }) => ({
                  url: path,
                  lastmod: lastmod ?? undefined,
              }),
          },
      },
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
