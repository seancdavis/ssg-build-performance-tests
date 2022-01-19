module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nested"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-custom-properties"),
    ...(process.env.ELEVENTY_ENV === "production" ? [require("cssnano")] : [])
  ]
}
