module.exports = {
  onPreBuild: async ({ utils: { build, run } }) => {
    try {
      await run.command("npm run test --ci")
    } catch (error) {
      return build.failBuild(error)
    }
  }
}
