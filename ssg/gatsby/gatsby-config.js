const fs = require("fs")
const gracefulFs = require("graceful-fs")
gracefulFs.gracefulify(fs)

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-transformer-remark`,
  ],
}
