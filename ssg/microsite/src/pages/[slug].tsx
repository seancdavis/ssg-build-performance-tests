import { Head, seo } from "microsite/head"
import { definePage } from "microsite/page"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

function Page({ page }) {
  return (
    <>
      <Head>
        <seo.title>{page.title}</seo.title>
      </Head>

      <div>
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </>
  )
}

export default definePage(Page, {
  async getStaticProps({ params }) {
    const page = getPage(params.slug)
    const content = await markdownToHtml(page.content || "")

    return {
      props: {
        page: {
          ...page.data,
          content
        }
      }
    }
  },
  async getStaticPaths() {
    return {
      paths: fs.readdirSync(pagesDirectory).map(filename => {
        return {
          params: {
            slug: path.basename(filename, path.extname(filename))
          }
        }
      })
    }
  }
})

async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

const pagesDirectory = path.join(process.cwd(), "_pages")

const getPage = slug => {
  const fullPath = path.join(pagesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  return matter(fileContents)
}
