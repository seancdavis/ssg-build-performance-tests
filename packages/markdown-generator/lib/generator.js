"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = exports.generateFile = exports.writeFile = exports.formatMarkdown = exports.generateSlug = exports.cleanDir = exports.initDir = void 0;
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const lorem_ipsum_1 = require("lorem-ipsum");
const path_1 = __importDefault(require("path"));
/**
 * Creates a directory in which to add markdown files.
 *
 * @param {string} dir Path to the directory to create.
 */
const initDir = (dir) => {
    const destDir = path_1.default.resolve(dir);
    // Create directory if it doesn't exist.
    fs_1.default.mkdirSync(destDir, { recursive: true });
    // Remove any markdown files from the directory.
    glob_1.default.sync(`${destDir}/*.md`).map((f) => fs_1.default.unlinkSync(f));
    // Return the path to the directory.
    return destDir;
};
exports.initDir = initDir;
/**
 * Removes all markdown files from specified directory.
 *
 * @param {string} dir Directory in which to remove markdown files.
 */
const cleanDir = (dir) => {
    const files = glob_1.default.sync(`${dir}/*.md`);
    files.map((f) => fs_1.default.unlinkSync(f));
    return files;
};
exports.cleanDir = cleanDir;
/**
 * Convert a title to a filename-friendly slug.
 *
 * @param {string} title Title of the page
 */
const generateSlug = (title) => {
    return title.toLowerCase().replace(/\ /gi, "-");
};
exports.generateSlug = generateSlug;
/**
 * Formats a title into frontmatter and a body in the main content area,
 * preparing it for use in a markdown file.
 *
 * @param {string} title Title of the page.
 * @param {string} body Main body for the markdown file.
 */
const formatMarkdown = (title, body) => {
    return `
---
title: ${title}
---

${body}
  `.trim();
};
exports.formatMarkdown = formatMarkdown;
/**
 * Writes a file to the file system, after checking for a duplicate.
 *
 * @param {string} dest Path to where the file should be written.
 * @param {string} content File content.
 */
const writeFile = (dest, content) => {
    // Check for duplicates and re-run if one was found.
    if (fs_1.default.existsSync(dest)) {
        console.log(`Duplicate page for ${path_1.default.basename(dest)}. Regenerating ...`);
        return (0, exports.generateFile)(path_1.default.dirname(dest));
    }
    // Otherwise, create the file.
    return fs_1.default.writeFileSync(dest, content);
};
exports.writeFile = writeFile;
/**
 * Generates a markdown file from random content.
 *
 * @param {string} dest Directory in which the file should be written.
 */
const generateFile = (dest) => {
    const lorem = new lorem_ipsum_1.LoremIpsum();
    const title = lorem.generateWords(5);
    const body = lorem.generateParagraphs(3).replace(/\n/gi, "\n\n");
    const content = (0, exports.formatMarkdown)(title, body);
    const outputFile = path_1.default.join(dest, `${(0, exports.generateSlug)(title)}.md`);
    (0, exports.writeFile)(outputFile, content);
    return outputFile;
};
exports.generateFile = generateFile;
/**
 * Generates a collection of files.
 *
 * @param {string} dest Directory in which the files should be written
 * @param {number} count The number of files to generate
 */
const generateFiles = (dest, count) => {
    (0, exports.initDir)(dest);
    const iterator = [...Array(count)];
    return iterator.map(() => (0, exports.generateFile)(dest));
};
exports.generateFiles = generateFiles;
