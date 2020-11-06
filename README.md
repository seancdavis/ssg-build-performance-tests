# SSG Build Performance Comparison

Measures the build performance at scale for static site generators.

Currently, the builds are run locally and the results are tracked and published to Netlify.

## Test Theory

The goal of this project is to be able to get a rough and relative comparison in build times across static site generators, based on the number of data files being processed.

To keep it as even as possible, the static site generators builds are designed with the following conditions:

- Data source are markdown files consisting of a title (as frontmatter) and body (as file markdown content).
- The default starter or basic tutorial recommendations mark the foundation for each site.
- No images are used.
- No CSS is used, though out-of-the-box support is left alone.
- Only use plugins required to read and write markdown files.
- Builds are run from scratch after clearing caches.

## Running Locally

If you'd like to try out this project locally, first clone the project:

    $ git clone https://github.com/seancdavis/ssg-build-performance-tests.git

Install dependencies:

    $ yarn install

You can adjust the number of files generated for a series of tests by manipulating the `datasets` object in `test.config.js`.

Run the tests with:

    $ yarn test:builds DATASET --generators GENERATORS

Where `DATASET` is the key in the dataset object, representing an array of file counts to test against, and `GENERATORS` is a space-separated list of generator names to run. If `--generators` is omitted, all generators are used in the run.

If the test run completes all tests successfully, the results are cached to `src/results.json`.

To view formatted output, you can run a development server:

    $ yarn clean
    $ yarn develop

The site will be available at localhost:8000. (The front-end uses [Eleventy](https://www.11ty.dev/).)

## Adding a Static Site Generator

To add a SSG to be tested, add your project to the `ssg` directory. Ensure your project follows the test theory (above). Keep in mind the data source should be a series of markdown files. These files should be placed in their own directory and ignored by git. They are automatically generated and destroyed during each test run.

After your site is in good working order, add configuration for it to be run in `test.config.js`. (See below for config details.) You can test that this is working by running:

    $ node lib/run base --generators GENERATOR

Where `GENERATOR` is the `name` of your generator that is specified in `test.config.js`.

Before opening a PR with your new site, add a `README.md` to your project that has installation instructions for getting the project up and running on another machine. See `ssg/jekyll/README.md` for an example.

When everything is in place, open a pull request with your changes. If it looks good, we'll run the builds tests on the test-runner server, and merge after previewing the results.

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
