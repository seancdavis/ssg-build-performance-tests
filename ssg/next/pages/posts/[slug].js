import { useRouter } from "next/router"
import ErrorPage from "next/error"
import { getPostBySlug, getAllPosts } from "../../lib/api"
import Head from "next/head"
import markdownToHtml from "../../lib/markdownToHtml"

export default function Post({ post }) {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage"
  ])
  const content = await markdownToHtml(post.content || "")

  return {
    props: {
      post: {
        ...post,
        content
      }
    }
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"])

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug
        }
      }
    }),
    fallback: false
  }
}
