const yargs = require("yargs")

const { initDir } = require("./init-dir")
const { generateFile } = require("./generate-file")

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

// Make and clean directory
const destDir = initDir(argv.dest)

// Loop through and create files
const iterator = [...Array(argv.count)]
iterator.map(() => generateFile(destDir))
