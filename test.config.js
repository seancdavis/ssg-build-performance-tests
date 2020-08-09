const path = require("path")

const counts = (module.exports = {
  fileCount: [1, 100, 1000, 5000, 10000],
  logFile: path.resolve(__dirname, "test/log.csv"),
  tests: [
    {
      name: "Hugo",
      paths: {
        root: path.join(__dirname, "ssg/hugo"),
        content: path.join(__dirname, "ssg/hugo/content/pages")
      },
      commands: {
        clean: "rm -rf public",
        build: "hugo -D"
      }
    }
  ]
})
