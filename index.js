const express = require("express")
const port = process.env.PORT || 3000

const app = express()

app.get("/", (req, res) => {
  res.send("SSG Build Performance Test Runner")
})

app.listen(port, () => {
  console.log(`App listening on ${port}`)
})
