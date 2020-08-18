const config = require("../test.config.js")
const { exec } = require("child_process")
const flatMap = require("lodash/flatMap")
const fs = require("fs")
const glob = require("glob")
const path = require("path")
const ProgressBar = require("progress")

const results = []

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

const tests = flatMap(
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
  const logFileDir = path.dirname(config.logFile)
  if (!fs.existsSync(logFileDir)) fs.mkdirSync(logFileDir, { recursive: true })
  fs.writeFileSync(config.logFile, JSON.stringify(results))
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

    results.push({
      name: testCfg.name,
      count: count,
      duration: duration,
      buildFileCount: fileCount.length,
      buildHtmlFileCount: fileCount.filter(f => path.extname(f) === ".html").length
    })
  }

  progress.tick({ message: "Done!" })
  writeResults()
}

run()
