const { exec } = require("child_process")
const fs = require("fs")
const glob = require("glob")
const path = require("path")

const { getBuilderConfig } = require("./config")

module.exports = class Builder {
  /**
   * Instantiates the builder instance by validating the config.
   *
   * @param {object} config Configuration for this particular build.
   */
  constructor(config = {}) {
    this.config = getBuilderConfig(config)
  }

  /**
   * Run build command.
   */
  build() {
    return this.runCmd(this.config.commands.build, this.config.paths.root)
  }

  /**
   * Run clean command.
   */
  clean() {
    return this.runCmd(this.config.commands.clean, this.config.paths.root)
  }

  /**
   * Counts the number of files in the build directory.
   */
  countBuildFiles(ext) {
    const pattern = `${this.config.paths.build}/**/*`
    const files = glob.sync(pattern).filter(file => !fs.statSync(file).isDirectory())
    return (ext ? files.filter(f => path.extname(f) === ext) : files).length
  }

  /**
   * Runs a command, returning a promise that resolves after the command has
   * completed. The resolved promise passes a single argument, representing the
   * number of seconds the command took to run.
   *
   * @param {string} cmd Command-line command to run
   * @param {str} dir Directory in which to run the command
   */
  async runCmd(cmd, dir = ".") {
    return new Promise((resolve, reject) => {
      const startTime = new Date()
      exec(cmd, { cwd: dir, maxBuffer: 1024 * 1000 }, (err, stdout, stderr) => {
        const endTime = new Date()
        const elapsedTime = (endTime - startTime) / 1000.0
        return err ? reject(err, elapsedTime) : resolve(elapsedTime)
      })
    })
  }
}
