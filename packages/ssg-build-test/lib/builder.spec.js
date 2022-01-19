const fs = require("fs")
const glob = require("glob")
const path = require("path")
const rimraf = require("rimraf")

const Builder = require("./builder")

// --- Mocks--- //

const mockConfig = {
  name: "hugo",
  count: 1,
  paths: {
    build: path.join(__dirname, "tmp/__build__/public"),
    content: path.join(__dirname, "tmp/__build__/content"),
    root: path.join(__dirname, "tmp/__build__")
  },
  commands: {
    clean: "rm -rf public",
    build: "mkdir public && touch public/index.html && touch public/sitemap.xml"
  }
}

// --- Setup & Teardown--- //

let builder
beforeEach(() => {
  builder = new Builder(mockConfig)
  fs.mkdirSync(mockConfig.paths.root, { recursive: true })
})

afterEach(() => {
  if (fs.existsSync(mockConfig.paths.root)) rimraf.sync(mockConfig.paths.root)
})

// --- Constructor--- //

describe("new Builder()", () => {
  it("throws an error if the config is invalid", () => {
    expect(() => new Builder()).toThrow()
  })
  it("sets config object for valid configurations", () => {
    expect(() => new Builder(mockConfig)).not.toThrow()
  })
})

// --- Build --- //

describe("build()", () => {
  it("runs the build command", async () => {
    expect.assertions(2)
    expect(fs.existsSync(mockConfig.paths.build)).toEqual(false)
    await builder.build()
    expect(fs.existsSync(mockConfig.paths.build)).toEqual(true)
  })
  it("returns the number of seconds it took to run", async () => {
    expect.assertions(2)
    const duration = await builder.build()
    expect(typeof duration).toEqual("number")
    expect(duration < 1).toEqual(true)
  })
})

// --- Clean --- //

describe("clean()", () => {
  it("runs the clean command", async () => {
    expect.assertions(3)
    expect(fs.existsSync(mockConfig.paths.build)).toEqual(false)
    await builder.build()
    expect(fs.existsSync(mockConfig.paths.build)).toEqual(true)
    await builder.clean()
    expect(fs.existsSync(mockConfig.paths.build)).toEqual(false)
  })
})

// --- Build File Count --- //

describe("countBuildFiles()", () => {
  it("returns 0 when the build directory doesn't exist", async () => {
    expect(builder.countBuildFiles()).toEqual(0)
  })
  it("counts all files in the build directory", async () => {
    await builder.build()
    expect(builder.countBuildFiles()).toEqual(2)
  })
  it("ignores directories in its count", async () => {
    await builder.build()
    fs.mkdirSync(path.resolve(mockConfig.paths.build, "subdir"))
    expect(glob.sync(`${mockConfig.paths.build}/**/*`).length).toEqual(3)
    expect(builder.countBuildFiles()).toEqual(2)
  })
  it("can filter by extension", async () => {
    await builder.build()
    expect(builder.countBuildFiles(".html")).toEqual(1)
    expect(builder.countBuildFiles(".xml")).toEqual(1)
    expect(builder.countBuildFiles(".js")).toEqual(0)
  })
})
