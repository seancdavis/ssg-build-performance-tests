<template>
  <div>
    <h1>{{ title }}</h1>
    <component v-if="Object.keys(postComponent.render).length > 0" :is="postComponent" />
  </div>
</template>

<script>
export default {
  async asyncData({ params, app }) {
    const fileContent = await import(`~/content/${params.slug}.md`)
    const attr = fileContent.attributes
    return {
      ...fileContent.attributes,
      postComponent: fileContent.vue.component
    }
  }
}
</script>
