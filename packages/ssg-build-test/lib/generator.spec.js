const fs = require("fs")
const glob = require("glob")
const path = require("path")
const rimraf = require("rimraf")

const Generator = require("./generator")

const mockDirPrefix = path.join(__dirname, "tmp")
const mockDir = `${mockDirPrefix}/${new Date().getTime()}`

// --- Setup Directory --- //

describe("initDir()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("creates a directory recursively", () => {
    expect(fs.existsSync(mockDir)).toEqual(false)
    Generator.initDir(mockDir)
    expect(fs.existsSync(mockDir)).toEqual(true)
  })
  it("returns the name of the directory", () => {
    expect(Generator.initDir(mockDir)).toEqual(mockDir)
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
    Generator.initDir(mockDir)
    // Check that the files are gone.
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
  })
})

// --- Clean Directory --- //

describe("cleanDir()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("removes markdown files from directory", () => {
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
    Generator.initDir(mockDir)
    Generator.generateFiles(mockDir, 10)
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(10)
    Generator.cleanDir(mockDir)
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
  })
})

// --- Generate Slug --- //

describe("generateSlug()", () => {
  it("creates a filename-friendly string from a title", () => {
    expect(Generator.generateSlug("Hello World 123")).toEqual("hello-world-123")
  })
})

// --- Format Markdown --- //

describe("formatMarkdown()", () => {
  it("takes a title and body, trims and formats them appropriately", () => {
    const title = "Hello World"
    const body = `In est cupidatat proident quis labore voluptate tempor ea deserunt eiusmod.`

    const expectedResult = `---
title: Hello World
---

In est cupidatat proident quis labore voluptate tempor ea deserunt eiusmod.`

    expect(Generator.formatMarkdown(title, body)).toEqual(expectedResult)
  })
})

// --- Write File --- //

describe("writeFile()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("writes a file, given a destination and content", () => {
    const filePath = path.join(mockDir, "hello-world.md")
    Generator.initDir(mockDir)
    expect(fs.existsSync(filePath)).toEqual(false)
    Generator.writeFile(filePath, "Hello World")
    const content = fs.readFileSync(filePath).toString()
    expect(content).toEqual("Hello World")
  })
  it("re-generates if it find a duplicate", () => {
    const filePath = path.join(mockDir, "hello-world.md")
    Generator.initDir(mockDir)
    Generator.writeFile(filePath, "Hello World")
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(1)
    Generator.writeFile(filePath, "Hello World")
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(2)
  })
})

// --- Generate Random File --- //

describe("generateFile()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("writes a file with random content", () => {
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
    Generator.initDir(mockDir)
    Generator.generateFile(mockDir)
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(1)
  })
})

// --- Generate Multiple Files --- //

describe("generateFiles()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("writes a collection of files with random content", () => {
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
    // This also assumes the generateFiles method is initializing the directory.
    Generator.generateFiles(mockDir, 10)
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(10)
  })
  it("returns the files it created", () => {
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
    const result = Generator.generateFiles(mockDir, 10)
    expect(result.filter(f => f.includes(mockDir) && f.includes(".md")).length).toEqual(10)
  })
})
