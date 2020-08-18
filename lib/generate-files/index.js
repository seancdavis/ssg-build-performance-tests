const yargs = require("yargs")

const { initDir } = require("./init-dir")
const { generateFiles } = require("./generate-files")

const argv = yargs
  .option("dest", {
    alias: "d",
    description: "Location of markdown files",
    default: "./tmp"
  })
  .option("count", {
    alias: "c",
    description: "The number of files to generate",
    type: "number",
    default: 1
  })
  .help()
  .alias("help", "h").argv

generateFiles(initDir(argv.dest), argv.count)
