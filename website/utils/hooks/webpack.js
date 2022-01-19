const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const webpack = require("webpack")

const webpackAsync = promisify(webpack)

const env = process.env.ELEVENTY_ENV || "production"

const webpackConfig = {
  entry: path.join(__dirname, "../.././src/_includes/js/main.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "../.././src/assets/js"),
    libraryTarget: "var",
    library: "App"
  },
  plugins: [
    new webpack.DefinePlugin({
      ALGOLIA_SEARCH_KEY: JSON.stringify(process.env.ALGOLIA_SEARCH_KEY),
      ALGOLIA_APP_ID: JSON.stringify(process.env.ALGOLIA_APP_ID),
      ALGOLIA_INDEX_NAME: JSON.stringify(process.env.ALGOLIA_INDEX_NAME),
      ENV: JSON.stringify(env)
    })
  ],
  mode: env
}

/**
 * Extends Eleventy's configuration.
 *
 * @param {object} eleventyConfig Eleventy's configuration object
 */
exports.default = eleventyConfig => {
  let skipJsProcessing = false

  /**
   * When running the dev server, if no JS files were changed, tell the build to
   * skip running the build.
   *
   * Notes:
   *  - This works because beforeWatch() runs before beforeBuild()
   *  - This will run for any .js file that was changed, even if not meant to be
   *    part of the build.
   */
  eleventyConfig.on("beforeWatch", filesChanged => {
    const jsFiles = filesChanged.filter(f => f.endsWith(".js"))
    skipJsProcessing = jsFiles.length === 0
  })

  /**
   * Unless told to skip (see above), run the PostCSS build.
   */
  eleventyConfig.on("beforeBuild", async () => {
    if (skipJsProcessing) return
    console.log("[webpack] Building JS bundle ...")
    await webpackAsync(webpackConfig)
    console.log("[webpack] Done.")
  })
}
