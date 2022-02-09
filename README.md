# SSG Build Performance Comparison

**⚠️ This project is no longer being maintained.** Explanation below.

---

I had a ton of fun putting this project together as [a research piece for CSS-Tricks](https://css-tricks.com/comparing-static-site-generator-build-times/).

At the time (2018-2020), SSG build performance was a _big_ problem. We were discarding amazing frameworks like Gatsby because they took too long to build. And we were coming up with all these wild ways to scale static site frameworks.

Since then, page rendering patterns have evolved _substantially_. Decoupled, API-driven sites can scale in ways that felt impossible just a few years ago.

It used to be super valuable to know how various frameworks would perform when generating 64,000 static page. Now it's _highly_ unlikely that you'd choose static generation if you needed to frequently build 64,000 pages.

Thus, the comparison that this set out to solve no longer held the value it once did.

That results from the most recent runs will remain active (until further notice) at https://ssg-build-performance-tests.netlify.app/.

And if you'd still like to tinker with the code, you can use [the previous README file](https://github.com/seancdavis/ssg-build-performance-tests/tree/6e050253067b1cb597c1009656d7705bf5f56fff).

Thanks to all who helped bring this together!
