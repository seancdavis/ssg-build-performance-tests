const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const { LoremIpsum } = require("lorem-ipsum")
const path = require("path")

/**
 * Creates a directory in which to add markdown files.
 *
 * @param {string} dir Path to the directory to create.
 */
exports.initDir = dir => {
  const destDir = path.resolve(dir)
  // Create directory if it doesn't exist.
  fs.mkdirSync(destDir, { recursive: true })
  // Remove any markdown files from the directory.
  glob.sync(`${destDir}/*.md`).map(f => fs.unlinkSync(f))
  // Return the path to the directory.
  return destDir
}

/**
 * Convert a title to a filename-friendly slug.
 *
 * @param {string} title Title of the page
 */
exports.generateSlug = title => {
  return title.toLowerCase().replace(/\ /gi, "-")
}

/**
 * Formats a title into frontmatter and a body in the main content area,
 * preparing it for use in a markdown file.
 *
 * @param {string} title Title of the page.
 * @param {string} body Main body for the markdown file.
 */
exports.formatMarkdown = (title, body) => {
  return lodash.trim(`
---
title: ${title}
---

${body}
  `)
}

/**
 * Writes a file to the file system, after checking for a duplicate.
 *
 * @param {string} dest Path to where the file should be written.
 * @param {string} content File content.
 */
exports.writeFile = (dest, content) => {
  // Check for duplicates and re-run if one was found.
  if (fs.existsSync(dest)) {
    console.log(`Duplicate page for ${path.basename(dest)}. Regenerating ...`)
    return exports.generateFile(path.dirname(dest))
  }
  // Otherwise, create the file.
  return fs.writeFileSync(dest, content)
}

/**
 * Generates a markdown file from random content.
 *
 * @param {string} dest Directory in which the file should be written.
 */
exports.generateFile = dest => {
  const lorem = new LoremIpsum()
  const title = lorem.generateWords(5)
  const body = lorem.generateParagraphs(3).replace(/\n/gi, "\n\n")
  const content = exports.formatMarkdown(title, body)
  const outputFile = path.join(dest, `${exports.generateSlug(title)}.md`)
  exports.writeFile(outputFile, content)
  return outputFile
}

/**
 * Generates a collection of files.
 *
 * @param {string} dest Directory in which the files should be written
 * @param {number} count The number of files to generate
 */
exports.generateFiles = (dest, count) => {
  exports.initDir(dest)
  const iterator = [...Array(count)]
  return iterator.map(() => exports.generateFile(dest))
}
