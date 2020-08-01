const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const { LoremIpsum } = require("lorem-ipsum")
const path = require("path")
const yargs = require("yargs")

const argv = yargs
  .option("dest", {
    alias: "d",
    description: "Location of markdown files",
    default: "."
  })
  .option("count", {
    alias: "c",
    description: "The number of files to generate",
    type: "number",
    default: 1
  })
  .help()
  .alias("help", "h").argv

// Make directory
const destDir = path.resolve(argv.dest)
fs.mkdirSync(destDir, { recursive: true })

// Clean directory
glob(`${destDir}/*.md`, {}, (err, files) => {
  files.map((f) => fs.unlinkSync(f))
})

const lorem = new LoremIpsum()

// Loop through and create files
const iterator = [...Array(argv.count)]
iterator.map((_, idx) => {
  const title = lorem.generateWords(5)
  const body = lorem.generateParagraphs(3)

  const content = lodash.trimStart(`
---
title: ${title}
---

${body}
  `)

  const filename = `${idx + 1}-${title.toLowerCase().replace(" ", "-")}.md`

  fs.writeFileSync(path.join(destDir, filename), content)
})
