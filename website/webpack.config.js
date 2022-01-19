const path = require("path")
const webpack = require("webpack")

const env = process.env.ELEVENTY_ENV || "production"

module.exports = {
  entry: "./src/assets/js/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/assets/js"),
    libraryTarget: "var",
    library: "App"
  },
  plugins: [new webpack.DefinePlugin({ ENV: JSON.stringify(env) })],
  mode: env,
  watch: env === "development"
}
