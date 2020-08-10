const path = require("path")

module.exports = {
  fileCount: [1, 100, 1000, 5000, 10000],
  // fileCount: [1, 100, 1000, 5000, 10000],
  logFile: path.resolve(__dirname, `tmp/log-${new Date().getTime()}.json`),
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
    }
  ]
}
