const yargs = require("yargs")

const { cleanDir, generateFiles } = require("./generator")
const config = require("../../../test.config")

const argv = yargs
  .option("generator", {
    alias: "g",
    desc: "The SSG from test.config.js to target",
    type: "string"
  })
  .option("count", {
    alias: "c",
    desc: "Number of files to generate",
    type: "number"
  })
  .demandOption(["generator", "count"])
  .help()
  .alias("help", "h").argv

// Build a flattened map of tests to run.
let testConfig = config.tests.find(t => t.name === argv.generator)
if (!testConfig) {
  throw new Error(`Could not find config for ${argv.generator}`)
}

const run = async () => {
  await cleanDir(testConfig.paths.content)
  await generateFiles(testConfig.paths.content, argv.count)
}

run()
  .then(() => console.log("Done."))
  .catch(err => {
    console.error("\n", err)
    process.exit(1)
  })
