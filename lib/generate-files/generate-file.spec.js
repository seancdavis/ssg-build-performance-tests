const fs = require("fs")
const glob = require("glob")
const path = require("path")
const rimraf = require("rimraf")

const { initDir } = require("./init-dir")
const { formatMarkdown, generateFile, generateSlug, writeFile } = require("./generate-file")

const mockDirPrefix = path.join(__dirname, "tmp")
const mockDir = `${mockDirPrefix}/${new Date().getTime()}`

// --- Generate Slug --- //

describe("generateSlug()", () => {
  it("creates a filename-friendly string from a title", () => {
    expect(generateSlug("Hello World 123")).toEqual("hello-world-123")
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

    expect(formatMarkdown(title, body)).toEqual(expectedResult)
  })
})

// --- Write File --- //

describe("writeFile()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("writes a file, given a destination and content", () => {
    const filePath = path.join(mockDir, "hello-world.md")
    initDir(mockDir)
    expect(fs.existsSync(filePath)).toEqual(false)
    writeFile(filePath, "Hello World")
    const content = fs.readFileSync(filePath).toString()
    expect(content).toEqual("Hello World")
  })
  it("re-generates if it find a duplicate", () => {
    const filePath = path.join(mockDir, "hello-world.md")
    initDir(mockDir)
    writeFile(filePath, "Hello World")
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(1)
    writeFile(filePath, "Hello World")
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(2)
  })
})

// --- Generate Random File --- //

describe("generateFile()", () => {
  beforeEach(() => rimraf.sync(mockDirPrefix))

  afterEach(() => rimraf.sync(mockDirPrefix))

  it("writes a file with random content", () => {
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(0)
    initDir(mockDir)
    generateFile(mockDir)
    expect(glob.sync(`${mockDir}/*.md`).length).toEqual(1)
  })
})
