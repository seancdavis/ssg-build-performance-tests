const fs = require("fs")
const glob = require("glob")
const path = require("path")
const rimraf = require("rimraf")

const { initDir } = require("./init-dir")

const mockDirPrefix = path.join(__dirname, "tmp")
const mockDir = `${mockDirPrefix}/${new Date().getTime()}`

beforeEach(() => {
  rimraf.sync(mockDirPrefix)
})

afterEach(() => {
  rimraf.sync(mockDirPrefix)
})

describe("initDir()", () => {
  it("creates a directory recursively", () => {
    expect(fs.existsSync(mockDir)).toEqual(false)
    initDir(mockDir)
    expect(fs.existsSync(mockDir)).toEqual(true)
  })
  it("returns the name of the directory", () => {
    expect(initDir(mockDir)).toEqual(mockDir)
  })
  it("removes markdown files existing within the directory", () => {
    // Add two files to the directory.
    fs.mkdirSync(mockDir, { recursive: true })
    fs.writeFileSync(`${mockDir}/01.md`, "")
    fs.writeFileSync(`${mockDir}/02.md`, "")
    // Check that there are two files in there.
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(2)
    // Run the init command. Note that this also tests that the command doesn't
    // fail if the directory already exists.
    initDir(mockDir)
    // Check that the files are gone.
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
  })
})
