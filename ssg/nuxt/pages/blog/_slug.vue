<template>
  <div>
    <h1>{{ post.title }}</h1>
    <div v-html="post.body"></div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, payload }) {
    if (payload) return { post: payload }
  }
}
</script>
