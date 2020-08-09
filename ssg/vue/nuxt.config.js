module.exports = {
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.md$/,
        loader: "frontmatter-markdown-loader"
      })
    }
  }
}
