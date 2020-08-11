const matter = require("gray-matter")
const fs = require("fs")
const path = require("path")
var markdown = require("markdown-it")()

const contentDir = path.join(__dirname, "/content")
const contentFiles = fs.readdirSync(contentDir)

const posts = contentFiles.map(file => {
  const fileContent = fs.readFileSync(path.join(contentDir, file)).toString()
  const { content, data } = matter(fileContent)
  const body = markdown.render(content)
  const slug = path.basename(file, path.extname(file))
  return { ...data, body: body, slug: slug }
})

export default {
  generate: {
    routes() {
      return posts.map(post => {
        return {
          route: `/blog/${post.slug}`,
          payload: post
        }
      })
    }
  }
}
