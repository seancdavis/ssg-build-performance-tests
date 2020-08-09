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

// Make directory
const destDir = path.resolve(argv.dest)
fs.mkdirSync(destDir, { recursive: true })

// Clean directory
glob(`${destDir}/*.md`, {}, (err, files) => {
  files.map(f => fs.unlinkSync(f))
})

const lorem = new LoremIpsum()

/**
 * Creates a random page object, then checks for a duplicate and re-runs if it
 * finds one.
 */
const generatePage = () => {
  const title = lorem.generateWords(5)
  const body = lorem.generateParagraphs(3).replace(/\n/gi, "\n\n")
  const slug = title.toLowerCase().replace(/\ /gi, "-")
  const content = lodash.trimStart(`
---
title: ${title}
---

${body}
  `)

  const outputFile = path.join(destDir, `${slug}.md`)

  // Check for duplicates and re-run if we found one.
  if (fs.existsSync(outputFile)) {
    console.log(`Duplicate page for ${slug}.md. Regenerating ...`)
    return generatePage()
  }

  return fs.writeFileSync(outputFile, content)
}

// Loop through and create files
const iterator = [...Array(argv.count)]
iterator.map((_, idx) => {
  generatePage()
})
