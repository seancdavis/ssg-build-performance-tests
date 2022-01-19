const glob = require("glob")
const path = require("path")

/**
 * Looks in the entire utils directory for files that should be loaded by
 * .eleventy.js.
 *
 * @returns array of file path strings
 */
exports.getUtilFiles = function () {
  // Utils directory.
  const dir = path.join(__dirname, `../`)
  // Pattern of files to require from the directory.
  const globFilesPattern = path.join(dir, "**/*.js")
  // Pattern of files to ignore from the directory.
  const ignoreFiles = ["**/*.spec.js", "_**/*.js", "**/_*/**/*.js", "**/_*.js"]
  const ignoreFilesPattern = ignoreFiles.map(pattern => path.join(dir, pattern))
  // Find all relevant files.
  let files = glob.sync(globFilesPattern, { ignore: ignoreFilesPattern })
  // Ensure that they are configured correctly. Remove and log a message for
  // those that are not configured properly.
  files = files.map(file => {
    // Delete the imported file from the require cache. This brings in updates
    // if the dev server is already running.
    delete require.cache[require.resolve(file)]
    // Import the file.
    const module = require(file)
    // If everything looks good, return the module.
    if (typeof module?.default === "function") return module
    // Otherwise, we have a problem. Gather the appropriate message.
    const error = module.default
      ? `Export "default" must be a function.`
      : `Missing "default" named export.`
    // Log the message.
    console.error(`Could not load ${path.basename(file)}. ${error}`)
    // And return null.
    return null
  })
  // Return all valid imports.
  return files.filter(util => util)
}
