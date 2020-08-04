module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  }
}
