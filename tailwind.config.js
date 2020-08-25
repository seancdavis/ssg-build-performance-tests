module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.njk", "./src/**/*.md"],
  theme: {
    container: {
      center: true,
      padding: "2rem"
    }
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true
  }
}
