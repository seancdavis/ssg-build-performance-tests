const path = require("path")

module.exports = {
  // fileCount: [1, 100],
  fileCount: [1, 100, 1000, 5000, 10000],
  // logFile: path.resolve(__dirname, `tmp/log-${new Date().getTime()}.json`),
  logFile: path.resolve(__dirname, `tmp/log.json`),
  tests: [
    {
      name: "Hugo",
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
      name: "Jekyll",
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
      name: "Gatsby",
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
      name: "Eleventy",
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
      name: "Next",
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
      name: "Nuxt",
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
