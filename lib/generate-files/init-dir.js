const fs = require("fs")
const glob = require("glob")
const path = require("path")

/**
 * Creates a directory in which to add markdown files.
 *
 * @param {string} dir Path to the directory to create.
 */
const initDir = dir => {
  const destDir = path.resolve(dir)
  // Create directory if it doesn't exist.
  fs.mkdirSync(destDir, { recursive: true })
  // Remove any markdown files from the directory.
  glob.sync(`${destDir}/*.md`).map(f => fs.unlinkSync(f))
  // Return the path to the directory.
  return destDir
}

module.exports = {
  initDir: initDir
}
