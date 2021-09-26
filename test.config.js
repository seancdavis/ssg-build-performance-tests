const path = require("path")

module.exports = {
  datasets: {
    dev: [1],
    base: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    small: [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
    large: [0, 1000, 2000, 4000, 8000, 16000, 32000, 64000]
  },
  log: {
    hasura_secret: process.env.HASURA_SECRET,
    hasura_url: process.env.HASURA_URL,
    maxHistory: 10
  },
  tests: [
    {
      name: "astro",
      version: "0.20.7",
      color: "#ff5e00",
      paths: {
        build: path.join(__dirname, "ssg/astro/dist"),
        content: path.join(__dirname, "ssg/astro/src/content"),
        root: path.join(__dirname, "ssg/astro")
      },
      commands: {
        clean: "npm run clean",
        build: "npm run build"
      }
    },
    {
      name: "eleventy",
      version: "0.12.1",
      color: "#222",
      paths: {
        build: path.join(__dirname, "ssg/eleventy/dist"),
        content: path.join(__dirname, "ssg/eleventy/src/pages"),
        root: path.join(__dirname, "ssg/eleventy")
      },
      commands: {
        clean: "npm run clean",
        build: "npm run build"
      }
    },
    {
      name: "gatsby",
      version: "2.24.64",
      color: "#542c85",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/gatsby/public"),
        content: path.join(__dirname, "ssg/gatsby/src/content"),
        root: path.join(__dirname, "ssg/gatsby")
      },
      commands: {
        clean: "npm run clean",
        build: "NODE_OPTIONS=--max_old_space_size=4096 npm run build"
      }
    },
    {
      name: "hugo",
      version: "0.74.3",
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
      version: "4.1.1 (master)",
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
      name: "microsite",
      version: "1.2.1",
      color: "#FF998B",
      framework: false,
      paths: {
        build: path.join(__dirname, "ssg/microsite/dist"),
        content: path.join(__dirname, "ssg/microsite/_pages"),
        root: path.join(__dirname, "ssg/microsite")
      },
      commands: {
        clean: "npm run clean",
        build: "npm run build"
      }
    },
    {
      name: "next",
      version: "11.1.2",
      color: "#0070f3",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/next/out"),
        content: path.join(__dirname, "ssg/next/_pages"),
        root: path.join(__dirname, "ssg/next")
      },
      commands: {
        clean: "npm run clean",
        build: "npm run build && npm run export"
      }
    },
    {
      name: "nuxt",
      version: "2.14.1",
      color: "#00c58e",
      framework: true,
      paths: {
        build: path.join(__dirname, "ssg/nuxt/dist"),
        content: path.join(__dirname, "ssg/nuxt/content"),
        root: path.join(__dirname, "ssg/nuxt")
      },
      commands: {
        clean: "npm run clean",
        build: "npm run generate"
      }
    }
  ]
}
