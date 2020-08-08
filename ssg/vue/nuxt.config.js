// const builtAt = new Date().toISOString()
const path = require("path")
// const { I18N } = require("./locales/i18n-nuxt-config")

// import fs from "fs"
import Mode from "frontmatter-markdown-loader/mode"
import MarkdownIt from "markdown-it"
// import mip from "markdown-it-prism"

const md = new MarkdownIt({
  html: true,
  typographer: true
})
// md.use(mip)

export default {
  target: "static", // default: 'server'
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.md$/,
        loader: "frontmatter-markdown-loader",
        include: path.resolve(__dirname, "content"),
        options: {
          mode: [Mode.VUE_RENDER_FUNCTIONS, Mode.VUE_COMPONENT],
          vue: {
            root: "dynamicMarkdown"
          },
          markdown(body) {
            return md.render(body)
          }
        }
      })
    }
  },
  generate: {
    routes: ["/pages/hello-world", "/pages/another-post"]
  }
}
