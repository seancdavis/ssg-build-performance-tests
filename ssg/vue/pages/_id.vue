<template>
  <div v-html="html"></div>
</template>

<script>
export default {
  async asyncData({ params }) {
    return await import(`content/${params.id}.md`)
  }
}
</script>
