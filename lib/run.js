const ProgressBar = require("progress")

const { cleanDir: removeTestFiles, generateFiles: generateTestFiles } = require("./generator")
const Logger = require("./logger")
const Builder = require("./builder")

// The logger stores information about the test results and controls writing the
// results to file.
const logger = new Logger()

// Flattened map of tests to run.
const tests = require("./config").getTestsConfig()

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
    logger.storeResult({
      name: test.name,
      count: test.count,
      duration: duration,
      buildFileCount: builder.countBuildFiles(),
      buildHtmlFileCount: builder.countBuildFiles(".html")
    })
    // Clean up the build directory.
    await builder.clean()
    // Remove markdown files.
    removeTestFiles(test.paths.content)
  }

  // Complete the progress bar.
  progress.tick({ message: "Done!" })
  // Write the results to file, because we done!!!
  logger.writeFile()
}

run()
