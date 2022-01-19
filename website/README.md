# SSG Build Performance Data Visualization Site

This is a website built with 11ty that visualizes the data from the build performance test results.

## Running Locally

Install dependencies:

    $ npm install

In production, the results are pulled in from a database. In development, you can use the file at `src/results-example.json` as a placeholder.

Copy `src/results-example.json` to `src/results.json`.

Then you can run the development server:

    $ npm run dev

The site will be available at localhost:8000.
