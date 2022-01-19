const chalk = require("chalk")
const ProgressBar = require("progress")
const yargs = require("yargs")

const { cleanDir: removeTestFiles, generateFiles: generateTestFiles } = require("./lib/generator")
const Logger = require("./lib/logger")
const Builder = require("./lib/builder")

// Specifies the accepted command-line arguments.
const argv = yargs
  .command("dataset", "Specifies which dataset to run.", {
    year: {
      description: "the dataset to run",
      alias: "d",
      type: "string"
    }
  })
  .option("generators", {
    alias: "g",
    desc: "A list of generators to use in tests",
    type: "array"
  })
  .option("dryrun", {
    alias: "d",
    desc: "Does not store the results of the test to the database",
    type: "boolean"
  })
  .help()
  .alias("help", "h").argv

// Dataset should be passed as the first argument when running the command.
const dataset = argv._[0]

// Build a flattened map of tests to run.
let tests = require("./lib/config").getTestsConfig(dataset)
if (argv.generators && argv.generators.length > 0) {
  tests = tests.filter(t => argv.generators.includes(t.name))
}

// Throw and error if there are no tests to run.
if (tests.length === 0) {
  console.error(chalk.red.bold("ERROR! No tests to run."))
  console.error("Make sure you've specified a dataset and have configured the projects correctly.")
  process.exit(1)
}

// The logger stores information about the test results and controls writing the
// results to file.
let logger
const initLogger = async () => {
  if (argv.dryrun) return
  logger = new Logger(dataset)
  await logger.initDataset()
  await logger.initGenerators()
}

// Setup the progress template to provide feedback to stdout during the tests.
const progressTemplate = `[:bar] (:percent) :message`
const progress = new ProgressBar(progressTemplate, { total: tests.length + 1, width: 20 })

// Generate a unique test ID for outputting to test-runner to help in
// identifying issues with cron jobs.
const testId = `${dataset}_${Math.random().toString(36).substr(2, 9)}`

/**
 * The main loop. This logic is written within this function so that we can
 * write the code asynchronously, ensuring we don't have a race condition in
 * reading and writing files.
 */
const run = async () => {
  try {
    // Log the start of the test.
    console.log(`RUN ${testId} BEGUN AT ${Date.now()}`)
    // Cycle through each test ...
    for (let test of tests) {
      // The builder controls the commands necessary to run the builds.
      const builder = new Builder(test)
      // Show that a new test has started.
      progress.tick({
        message: `Building ${test.name} with ${test.count} files ...`
      })
      // Clean the build directory.
      await builder.clean()
      // Generate markdown files.
      await generateTestFiles(test.paths.content, test.count)
      // Run the build and store the time it took to run.
      const duration = await builder.build()
      // Store the results
      if (logger) {
        await logger.storeResult({
          name: test.name,
          count: test.count,
          duration: duration,
          build_file_count: builder.countBuildFiles(),
          build_html_file_count: builder.countBuildFiles(".html")
        })
      }
      // Clean up the build directory.
      await builder.clean()
      // Remove markdown files.
      removeTestFiles(test.paths.content)
    }

    // Complete the progress bar.
    progress.tick({ message: "Done!" })

    // Log the start of the test.
    console.log(`RUN ${testId} COMPLETED AT ${Date.now()}`)
  } catch (err) {
    console.error("\n", err)
    process.exit(1)
  }
}

initLogger()
  .then(run)
  .catch(err => {
    console.error("\n", err)
    process.exit(1)
  })
