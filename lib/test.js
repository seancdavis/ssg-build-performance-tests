const config = require("../test.config.js")
const { exec } = require("child_process")
const flatMap = require("lodash/flatMap")
const fs = require("fs")
const glob = require("glob")

const clean = (cmd, dir) => {
  console.log(`clean()`)
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: dir }, function (err, stdout, stderr) {
      console.log("err", err)
      // console.log("stdout", stdout)
      // console.log("stderr", stderr)
      resolve()
    })
  })
}

const generateTestFiles = (count, dir) => {
  console.log(`generateTestFiles()`)
  return new Promise((resolve, reject) => {
    const cmd = `yarn generate --dest ${dir} --count ${count}`
    exec(cmd, { cwd: "." }, function (err, stdout, stderr) {
      console.log("err", err)
      // console.log("stdout", stdout)
      // console.log("stderr", stderr)
      resolve()
    })
  })
}

const build = (cmd, dir) => {
  console.log(`build()`)
  return new Promise((resolve, reject) => {
    const startTime = new Date()
    exec(cmd, { cwd: dir }, function (err, stdout, stderr) {
      const endTime = new Date()
      console.log("err", err)
      // console.log("stdout", stdout)
      // console.log("stderr", stderr)

      const elapsedTime = (endTime - startTime) / 100.0
      console.log(`TEST TIME: ${elapsedTime}s`)

      resolve()
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

const run = async hi => {
  for (let test of tests) {
    const { config: testCfg, count } = test
    await clean(testCfg.commands.clean, testCfg.paths.root)
    await generateTestFiles(count, testCfg.paths.content)
    await build(testCfg.commands.build, testCfg.paths.root)
    await removeTestFiles(testCfg.paths.content)
  }

  console.log("HELLO")
}

run()
