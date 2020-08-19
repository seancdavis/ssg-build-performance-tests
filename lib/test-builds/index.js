const { exec } = require("child_process")
const fs = require("fs")
const glob = require("glob")
const lodash = require("lodash")
const path = require("path")
const ProgressBar = require("progress")

const config = require(path.join(__dirname, "../../test.config.js"))

const generateTimestamp = () => new Date().getTime()

// Init results
const logFile = lodash.get(config, "log.path") || path.resolve(__dirname, "../../tmp/results.json")
const maxRuns = lodash.get(config, "log.maxRuns") || 3

// Create log file if it doesn't exist.
if (!fs.existsSync(logFile)) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true })
  fs.writeFileSync(logFile, JSON.stringify({}))
}

// Load results
const logFileContent = fs.readFileSync(logFile)
const results = JSON.parse(logFileContent.toString())

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

const generateTestFiles = (count, dir) => {
  // console.log(`generateTestFiles()`)
  return new Promise((resolve, reject) => {
    const cmd = `yarn generate --dest ${dir} --count ${count}`
    exec(cmd, { cwd: "." }, function (err, stdout, stderr) {
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

const removeTestFiles = async dir => {
  return glob(`${dir}/*.md`, {}, (err, files) => files.map(f => fs.unlinkSync(f)))
}

const buildFileCount = async dir => {
  return glob.sync(`${dir}/**/*`).filter(file => !fs.statSync(file).isDirectory())
}

const writeResults = () => {
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2))
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
    await generateTestFiles(count, testCfg.paths.content)
    const duration = await build(testCfg.commands.build, testCfg.paths.root)

    const fileCount = await buildFileCount(testCfg.paths.build)

    await clean(testCfg.commands.clean, testCfg.paths.root)
    await removeTestFiles(testCfg.paths.content)

    const storeKey = `${testCfg.name}.count-${count}`
    const keepCount = maxRuns - 1
    const resultsGroup = (lodash.get(results, storeKey) || []).slice(-keepCount)

    resultsGroup.push({
      timestamp: generateTimestamp(),
      name: testCfg.name,
      count: count,
      duration: duration,
      buildFileCount: fileCount.length,
      buildHtmlFileCount: fileCount.filter(f => path.extname(f) === ".html").length
    })

    lodash.set(results, storeKey, resultsGroup)
  }

  progress.tick({ message: "Done!" })
  writeResults()
}

run()
