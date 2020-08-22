const { exec } = require("child_process")
const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const path = require("path")
const ProgressBar = require("progress")

const { cleanDir: removeTestFiles, generateFiles: generateTestFiles } = require("./generator")
const Logger = require("./logger")

const config = require("../test.config")

const logger = new Logger(lodash.get(config, "log"))

// TODO: There are a few primary functions here:
//
// 1. ✅ Logger: Controls reading and writing to the log file, as well as
//    transforming results along the way.
// 2. Builder: Some mechanism for building SSG projects, cleaning build
//    directories, and counting their built files.
// 3. Config: A utility to read the config file, set defaults, and flatten an
//    array of tests to be run.
// 4. ✅ Generator: Generates a series of test files. (The thing that already
//    exists.)
//
// Then, this file is just a controller that creates instances of those classes,
// and calls methods from within them as it moves through the test.
//

const clean = (cmd, dir) => {
  // console.log(`clean()`)
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: dir }, function (err, stdout, stderr) {
      // console.log("err", err)
      // console.log("stdout", stdout)
      // console.log("stderr", stderr)
      resolve()
    })
  })
}

const build = (cmd, dir) => {
  // console.log(`build()`)
  return new Promise((resolve, reject) => {
    const startTime = new Date()
    exec(cmd, { cwd: dir }, function (err, stdout, stderr) {
      const endTime = new Date()
      // console.log("err", err)
      // console.log("stdout", stdout)
      // console.log("stderr", stderr)

      const elapsedTime = (endTime - startTime) / 1000.0
      // console.log(`TEST TIME: ${elapsedTime}s`)

      resolve(elapsedTime)
    })
  })
}

const tests = lodash.flatMap(
  config.tests.map(testCfg => {
    return config.fileCount.map(count => {
      return {
        config: testCfg,
        count: count
      }
    })
  })
)

const buildFileCount = async dir => {
  return glob.sync(`${dir}/**/*`).filter(file => !fs.statSync(file).isDirectory())
}

const progressTemplate = `[:bar] (:percent) :message`

const progress = new ProgressBar(progressTemplate, { total: tests.length + 1, width: 20 })

const run = async () => {
  for (let test of tests) {
    const { config: testCfg, count } = test

    progress.tick({
      message: `Building ${testCfg.name} with ${count} files ...`
    })

    await clean(testCfg.commands.clean, testCfg.paths.root)
    await generateTestFiles(testCfg.paths.content, count)
    const duration = await build(testCfg.commands.build, testCfg.paths.root)

    const fileCount = await buildFileCount(testCfg.paths.build)

    // console.log(">>>", testCfg.name, fileCount)

    await clean(testCfg.commands.clean, testCfg.paths.root)
    await removeTestFiles(testCfg.paths.content)

    logger.storeResult({
      name: testCfg.name,
      count: count,
      duration: duration,
      buildFileCount: fileCount.length,
      buildHtmlFileCount: fileCount.filter(f => path.extname(f) === ".html").length
    })
  }

  progress.tick({ message: "Done!" })
  logger.writeFile()
}

run()
