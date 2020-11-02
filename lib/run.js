const ProgressBar = require("progress")
const yargs = require("yargs")

const { cleanDir: removeTestFiles, generateFiles: generateTestFiles } = require("./generator")
const Logger = require("./logger")
const Builder = require("./builder")

// Specifies the accepted command-line arguments.
const argv = yargs
  .command("dataset", "Specifies which dataset to run.", {
    year: {
      description: "the dataset to run",
      alias: "d",
      type: "string"
    }
  })
  .help()
  .alias("help", "h").argv

// Dataset should be passed as the first argument when running the command.
const dataset = argv._[0]

// Build a flattened map of tests to run.
const tests = require("./config").getTestsConfig(dataset)

// Throw and error if there are no tests to run.
if (tests.length === 0) {
  console.error(
    "!!!",
    "No tests to run.",
    "Make sure you've specified a dataset and have configured the projects correctly."
  )
  throw new Error()
}

// The logger stores information about the test results and controls writing the
// results to file.
const logger = new Logger(dataset)
const initLogger = async () => {
  await logger.initDataset()
  await logger.initGenerators()
}

// Setup the progress template to provide feedback to stdout during the tests.
const progressTemplate = `[:bar] (:percent) :message`
const progress = new ProgressBar(progressTemplate, { total: tests.length + 1, width: 20 })

/**
 * The main loop. This logic is written within this function so that we can
 * write the code asynchronously, ensuring we don't have a race condition in
 * reading and writing files.
 */
const run = async () => {
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
    await logger.storeResult({
      name: test.name,
      count: test.count,
      duration: duration,
      build_file_count: builder.countBuildFiles(),
      build_html_file_count: builder.countBuildFiles(".html")
    })
    // Clean up the build directory.
    await builder.clean()
    // Remove markdown files.
    removeTestFiles(test.paths.content)
  }

  // Complete the progress bar.
  progress.tick({ message: "Done!" })
}

initLogger().then(run)
