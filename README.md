# SSG Build Performance Comparison

Measures the build performance at scale for static site generators.

Currently, the builds are run locally and the results are tracked and published to Netlify.

## Test Theory

The goal of this project is to be able to get a rough and relative comparison in build times across static site generators, based on the number of data files being processed.

To keep it as even as possible, the static site generators builds are designed with the following conditions:

- Data source are markdown files consisting of a title (as frontmatter) and body (as file markdown content).
- The default starter or basic tutorial recommendations mark the foundation for each site.
- No images are used.
- No CSS is used, though out-of-the-box support was left alone.
- Only use plugins required to read and write markdown files.
- Builds are run from scratch after clearing caches.

## Running Locally

If you'd like to try out this project locally, first clone the project:

    $ git clone https://github.com/seancdavis/ssg-build-performance-tests.git

Install dependencies:

    $ yarn install

You can adjust the number of files generated for a series of tests by manipulating the `datasets` object in `test.config.js`.

Run the tests with:

    $ yarn test:builds [dataset]

Where `[dataset]` is the key in the dataset object, representing an array of file counts to test against.

If the test run completes all tests successfully, the results are cached to `src/results.json`.

To view formatted output, you can run a development server:

    $ yarn clean
    $ yarn develop

The site will be available at localhost:8000. (The front-end uses [Eleventy](https://www.11ty.dev/).)

## Adding a Static Site Generator

To add a SSG to be tested, follow these steps:

1. Add the site to the `ssg` directory. It should follow the test theory from above.
2. Create a directory for markdown files to be generated.
3. Write the code necessary to use those markdown files as a data source and generate a single page for every file. Each page should display the title as an `<h1>` and the body of the markdown file, converted to HTML.
4. Add your SSG to the `tests` array in `test.config.js`.

Check out other projects in `ssg` for an example.

### Configuration

The configuration for a SSG looks like this:

```js
{
  // Name of the project. This is used to cache the data and render it on the
  // front end.
  name: "jekyll",
  // Color used in the charts on the front end.
  color: "#fc0",
  paths: {
    // Directory in which the SSG's built files will reside after running a
    // build.
    build: path.join(__dirname, "ssg/jekyll/_site"),
    // Directory in which to generate markdown files. This will be cleaned after
    // each build.
    content: path.join(__dirname, "ssg/jekyll/_pages"),
    // Project root directory.
    root: path.join(__dirname, "ssg/jekyll")
  },
  commands: {
    // Command to clean built files and caches. Note that markdown files are
    // cleaned automatically.
    clean: "rm -rf _site && rm -rf .jekyll-cache",
    // Command to run the build process for the SSG. This should leave HTML
    // files in the build directory after completion.
    build: "bundle exec jekyll build"
  }
}
```
