const path = require("path")

module.exports = {
  datasets: {
    base: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    small: [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
    large: [1000, 2000, 4000, 8000, 16000, 32000, 64000]
  },
  log: {
    hasura_secret: process.env.HASURA_SECRET,
    hasura_url: process.env.HASURA_URL,
    maxHistory: 10
  },
  tests: [
    {
      name: "eleventy",
      color: "#222",
      paths: {
        build: path.join(__dirname, "ssg/eleventy/dist"),
        content: path.join(__dirname, "ssg/eleventy/src/pages"),
        root: path.join(__dirname, "ssg/eleventy")
      },
      commands: {
        clean: "yarn clean",
        build: "yarn build"
      }
    },
    {
      name: "gatsby",
      color: "#542c85",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/gatsby/public"),
        content: path.join(__dirname, "ssg/gatsby/src/content"),
        root: path.join(__dirname, "ssg/gatsby")
      },
      commands: {
        clean: "yarn clean",
        build: "NODE_OPTIONS=--max_old_space_size=4096 yarn build"
      }
    },
    {
      name: "hugo",
      color: "#ff4088",
      paths: {
        build: path.join(__dirname, "ssg/hugo/public"),
        content: path.join(__dirname, "ssg/hugo/content/pages"),
        root: path.join(__dirname, "ssg/hugo")
      },
      commands: {
        clean: "rm -rf public",
        build: "hugo -D"
      }
    },
    {
      name: "jekyll",
      color: "#fc0",
      paths: {
        build: path.join(__dirname, "ssg/jekyll/_site"),
        content: path.join(__dirname, "ssg/jekyll/_pages"),
        root: path.join(__dirname, "ssg/jekyll")
      },
      commands: {
        clean: "rm -rf _site && rm -rf .jekyll-cache",
        build: "bundle exec jekyll build"
      }
    },
    {
      name: "next",
      color: "#0070f3",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/next/out"),
        content: path.join(__dirname, "ssg/next/_pages"),
        root: path.join(__dirname, "ssg/next")
      },
      commands: {
        clean: "yarn clean",
        build: "yarn build && yarn export"
      }
    },
    {
      name: "nuxt",
      color: "#00c58e",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/nuxt/dist"),
        content: path.join(__dirname, "ssg/nuxt/content"),
        root: path.join(__dirname, "ssg/nuxt")
      },
      commands: {
        clean: "yarn clean",
        build: "yarn generate"
      }
    }
  ]
}
