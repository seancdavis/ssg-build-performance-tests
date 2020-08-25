const path = require("path")

module.exports = {
  fileCount: [1, 100, 1000, 5000],
  // fileCount: [10000, 20000],
  log: {
    file: path.resolve(__dirname, `src/results.json`),
    maxHistory: 10
  },
  tests: [
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
      name: "gatsby",
      color: "#542c85",
      paths: {
        build: path.join(__dirname, "ssg/gatsby/public"),
        content: path.join(__dirname, "ssg/gatsby/src/content"),
        root: path.join(__dirname, "ssg/gatsby")
      },
      commands: {
        clean: "yarn clean",
        build: "yarn build"
      }
    },
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
      name: "next",
      color: "#0070f3",
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
