const { getUtilFiles } = require("./utils/_helpers/get-util-files")

module.exports = function (eleventyConfig) {
  // Import utilities from src/utils.
  getUtilFiles().map(util => util.default(eleventyConfig))

  // Copy bundled assets into build dir.
  eleventyConfig.addPassthroughCopy({ "src/assets": "/", static: "/" })

  // Return our site settings.
  return {
    dir: {
      input: "src",
      layouts: "_layouts",
      output: "dist"
    }
  }
}
