# SSG Build Performance Comparison

Measures the build performance at scale for static site generators.

Currently, the builds are run locally and the results are tracked and published to Netlify.

The original results and analysis can be found [in this CSS-Tricks article](https://css-tricks.com/comparing-static-site-generator-build-times/).

## Test Theory

The goal of this project is to be able to get a rough and relative comparison in build times across static site generators, based on the number of data files being processed.

To keep it as even as possible, the static site generators builds are designed with the following conditions:

- Data source are markdown files consisting of a title (as frontmatter) and body (as file markdown content).
- The default starter or basic tutorial recommendations mark the foundation for each site.
- No images are used.
- No CSS is used, though out-of-the-box support is left alone.
- Only use plugins required to read and write markdown files.
- Builds are run from scratch after clearing caches.

## Updating Benchmarks

The tests are run via GitHub Action workflows. There is a tiny workflow to ensure everything is wired up that runs automatically. The actual benchmark tests are longer running and are therefore triggered manually. I do this whenever there is a change made to the project that warrants running the tests again.

## Running Locally

If you'd like to try out this project locally, first clone the project:

    $ git clone https://github.com/seancdavis/ssg-build-performance-tests.git

Install dependencies:

    $ npm install

### Running Tests

You can adjust the number of files generated for a series of tests by manipulating the `datasets` object in `test.config.js`.

Run the tests with:

    $ node lib/run DATASET --generators GENERATORS --dryrun

Where `DATASET` is the key in the dataset object, representing an array of file counts to test against, and `GENERATORS` is a space-separated list of generator names to run. If `--generators` is omitted, all generators are used in the run.

Note: `--dryrun` tells the runner to skip actions that read or write from the database.

### Running Front End

You can also run the front end project to view the output of the benchmark tests. In production, the results are pulled in from the database. When in development, you can use the file at `src/results-example.json` as a placeholder.

Copy `src/results-example.json` to `src/results.json`. Then you can run the development server:

    $ npm run clean
    $ npm run develop

The site will be available at localhost:8000. (The front-end uses [Eleventy](https://www.11ty.dev/).)

## Adding a Static Site Generator

To add an SSG to the benchmark tests, you must do the following:

1. Add your project to the repo in the `ssg` directory.
2. Configure the build in `test.config.js`.
3. Test that the build is working properly.
4. Document how to setup the project.
5. Add GitHub Action workflows.
6. Open a pull request with your changes.

### Step 1: Add Project

Add your project to the `ssg` directory. Ensure your project follows the test theory (above). Keep in mind the data source should be a series of markdown files. These files should be placed in their own directory and ignored by git. They are automatically generated and destroyed during each test run.

### Step 2: Configure the Build

After your site is in good working order, add configuration for it to be run in `test.config.js`. (See below for config details.)

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

### Step 3: Test the Build

You can test that this is working by running:

    $ node lib/run dev --generators GENERATOR --dryrun

Where `GENERATOR` is the `name` of your generator that is specified in `test.config.js`.

### Step 4: Document Setup

Before opening a PR with your new site, add a `README.md` to your project that has installation instructions for getting the project up and running on another machine. See `ssg/jekyll/README.md` for an example.

### Step 5: Add GitHub Action Workflows

There are several workflows in the `.github` directory. This is how the builds are run in production. Add your SSG to each workflow using examples of similar projects in those same files.

### Step 6: Open a PR

When everything is in place, open a pull request with your changes. If it looks good, we'll run the builds tests on the test-runner server, and merge after previewing the results.
