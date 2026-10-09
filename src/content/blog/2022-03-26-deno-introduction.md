---
title: Introduction to Deno
date: "2022-03-26"
tags: [Deno]
summary: "A quick overview of Deno and what makes it different from Node."
---

# Introduction to Deno

> This post is related to my course ['Build and Deploy a REST API with Deno' on Newline.co](https://www.newline.co/courses/build-and-deploy-a-rest-api-with-deno). Take a look if you are interested in learning more!

In preparation for the launch of my new course (and to get you all a bit hyped), this is part 1 in a miniseries about Deno. In this post, you will be introduced to Deno, and hopefully become addicted to its easy entry requirements compared to Node (although I do not expect you to immediately port all your projects over as not every NPM module is compatible at this point in time).

## History of Deno

The story begins in 2009 when Ryan Dahl presented Node.js as an alternative server-side runtime of JavaScript to the then existing Netscape's LiveWire Pro Web. Over the next decade, Dahl continued to work on the JS ecosystem and announced in 2018 the Deno project.

The intention of Deno was to solve a lot of the design issues with Node.js, some of them, you can listen to in Dahl's talk, [10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA). One of the major goals was to make Deno a JS server-side runtime with full web-standard compatibility, meaning [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) instead of [Node Streams](https://nodejs.org/api/stream.html), and standardized [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of the [Node HTTP](https://nodejs.org/api/http.html) module.

In May 2020, Deno 1.0 was released, and even though it was not a drop-in replacement for Node.js, it gained some traction in certain parts of the JS community. Not long after, hundreds of libraries were flourishing, and npm modules were ported to allow for Deno compatibility - the most popular ones being REST frameworks. As time went by, and versions were released with new features, Deno got more traction and was adopted by companies like Slack for projects needing better web standard compatibility.

The year after, 2021, a lot of changes and announcements were made regarding Deno's future. The Deno Company ([Deno Land Inc.](https://deno.com/company)) was created, [Deno Deploy](https://deno.com/deploy) was released, and not long afterward, Deno was [added to the compatibility tables on MDN](https://deno.com/blog/deno-on-mdn). Other major additions to the Deno ecosystem were the introduction of [Foreign Function Interfaces](https://deno.land/manual/runtime/ffi_api) and better [Node.js Compatibility](https://deno.land/manual/npm_nodejs/compatibility_mode).

## What is Deno and how does it compare to Node

Now that you have read through my rambling of the Deno history, you might be scratching your head and wonder "What exactly is Deno, and what is so special about it compared to Node?". Well, long story short, Deno is written in Rust. This means that by default, Deno gets a lot of the strongly typed stability Rust offers. Deno is simply a runtime for JavaScript and can natively compile TypeScript into JavaScript.

Its strong points are, amongst other things (which this post won't be able to fully cover), that it imports modules using URLs and caches the module in one central place on your system. This effectively means that you have no need for a package manager, and you can say good riddance to the node_modules folder.

As discussed above, another strong point is that it adheres to Web standards, meaning you can write the same code for browser and server without having to worry about different implementations and incompatibilities. This also includes native support for the [Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and top-level `await`.

## How to get started with Deno

Now that your head is swirling with all the fun facts about Deno, it is about time we get to the part where we actually write some code (we are developers after all, so I won't blame you if you skipped to this section). In this section, we will be taking you from scratch to write your very first server in Deno! Who knows, maybe one day you will even write a successful module!

### Installation

It's pretty easy to get started with Deno. To install it, you can simply run a command from the command line (or use your [favorite package manager](https://github.com/denoland/deno_install#install-via-package-manager)). We follow the steps from their [installation repo](https://github.com/denoland/deno_install).

```shell
# MacOS / Linux
curl -fsSL https://deno.land/install.sh | sh
# Windows
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

> 🐳 If you are feeling really adventurous, you can also run Deno via Docker. See [repo](https://github.com/denoland/deno_docker)

Easy, no? Assuming you said _"yes"_, good, if not feel free to head over to the [discussions](https://github.com/lmxrd/blog-code/discussions)!

### Using the CLI

The Deno CLI has a couple of very useful commands. Let's take a look at each of them!

Here is the full list, and some of the most important ones will be discussed further down:

- [`bundle`](#deno-bundle): Bundle module and dependencies into a single file
- `cache`: Cache the dependencies
- `compile`: Compile the script into a self-contained executable
- `completions`: Generate shell completions
- `coverage`: Print coverage reports
- `doc`: Show documentation for a module
- `eval`: Eval script
- `fmt`: Format source files
- `help`: Print this message or the help of the given subcommand(s)
- `info`: Show info about cache or info related to a source file
- `install`: Install script as an executable
- `lint`: Lint source files
- `lsp`: Start the language server
- `repl`: Read Eval Print Loop
- `run`: Run a JavaScript or TypeScript program
- `test`: Run tests
- `types`: Print runtime TypeScript declarations
- `uninstall`: Uninstall a script previously installed with `deno install`
- `upgrade`: Upgrade the Deno executable to a given version
- `vendor`: Vendor remote modules into a local directory

#### `deno bundle`

If you have ever worked with JS and made any kind of module, website, or script, chances are high that you ever used [Babel](https://babeljs.io/) to bundle your code to be compatible with browsers, ES versions, or runtimes. Although I love what Babel does, it is a separate package that I need to install for each of my repos. Deno has bundling built-in and therefore requires zero external modules to be able to bundle your codebase with all needed dependencies (minus the Deno built-in ones).

What is good to know is that Deno only supports bundling to a single file, and also is only able to output the code in ESM format.

[Read more here](https://docs.deno.com/runtime/reference/bundling/)

#### `deno compile`

Now, this is more of a special use-case which not many uses daily when working with Node. Have you ever thought _"Wouldn't it be nice if I could write my code once, and then just run an executable on any machine, and it works?"_.
Well, I have for certain, and the solution to this is `deno compile`. This nice little command functions pretty much like [Vercel's PKG](https://github.com/vercel/pkg), where it outputs one file you can drop onto a machine and run without having to install Deno.

Currently, supported OSes are `Windows x64`, `macOS x64`, `macOS ARM`, and `Linux x64`.

[Read more here](https://docs.deno.com/runtime/reference/cli/compile/)

#### `deno fmt`

The formatter has probably been used more than a hundred times while writing this post. It is a native and opinionated replacement of tools like [Prettier](https://prettier.io/). Not much more to say really, it works brilliantly, and it's your best friend.

Supported file formats are JavaScript (`.js`), TypeScript (`.ts`), JSX (`.jsx`), TSX (`.tsx`), Markdown (`.md`|`.markdown`), JSON (`.json`), and JSONC (`.jsonc`).

If you have any kind of shared codebase, you will most likely also want to make sure that the code is properly formatted before merging to the main branch. By running `deno fmt --check` in any pipeline, you can get a notification if one of your colleagues (or yourself) tries to propose any incorrectly formatted files.

[Read more here](https://docs.deno.com/runtime/reference/cli/fmt/)

#### `deno lint`

Your other best friend, at least your CI, is the linter. This grand feature will let you know if you wrote anything wrong, your types are incorrect, or it just blatantly doesn't like you. This command is often the second thing you add to any kind of pipeline and will save you more often than you would want to acknowledge.

Some personal configuration is possible, but I would largely recommend having it yell at you if you so much as thinking of adding an extra comma.

[Read more here](https://docs.deno.com/runtime/reference/cli/lint/)

#### `deno repl`

Are you one of the people using REPLs rather than the calculator to add 21 and 21? Well, I will be surprised if you will use anything else after getting familiar with the Deno REPL. Not much to really say about this except that it is brilliant to test out short snippets without having to create a file and run it. Just try it out, and then figure out what works best for you, not much can go wrong.

[Read more here](https://docs.deno.com/runtime/reference/cli/repl/)

#### `deno run`

Now we are getting to the main feature, the runtime (surprised right?)! All you need is a file to run with some JS or TS in it, and Deno will execute it for you (assuming the linter allows you to pass). You can try with something as simple as adding `console.log("Hello Deno!")` to a file named `hello.ts` and running it using `deno run hello.ts`. If you are lazy, here is a one-liner to do all of it for you.

```shell
echo 'console.log("Hello Deno!")' > hello.ts && deno run hello.ts
```

What is important to know is that Deno follows a strict permission and sandbox template, meaning that you have to give explicit permission to do anything other than running a simple script with a console log.

Permissions which you have to give when running a script are access to:

- Environment variables: `--allow-env=<allow-env>`
- High resolution time measurement `--allow-hrtime`
- Network calls: `--allow-net=<allow-net>`
- Loading of dynamic libraries (these are not sandboxed): `--allow-ffi`
- Reading files: `--allow-read=<allow-read>`
- Running subprocesses: `--allow-run=<allow-run>`
- Writing files: `--allow-write=<allow-write>`

> If you are prototyping, it is often easier to just give all permissions using `-A` or `--allow-all`, but this is generally discouraged when running in production or running 3rd party code.

Lastly, for `deno run` I should mention the `--watch` option which reloads the changed module on save. This is very useful for local development, but should not be used in production.

[Read more here](https://docs.deno.com/runtime/reference/permissions/)

#### `deno test`

Every programmer will at some point have experienced that even though the linter and formatter pass, the code does not work as you intended. [Jest](https://jestjs.io/), [Mocha](https://mochajs.org/), and a plethora of other Node test runners solve this for Node, but once again Deno delivers this built-in.

Testing in Deno is currently developing to allow for subtests and possibly execution hooks, but these features are not yet ready. As an example, a simple test file can look as simple as this, and be run using `deno test`.

```ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("adding 21 and 21", () => {
  assertEquals(21 + 21, 42);
});
```

[Read more here](https://docs.deno.com/runtime/test/)

#### `deno upgrade`

Now the last command we will be discussing is the one for upgrading Deno to a new version whenever one is available. No more magic than that, just run `deno upgrade` whenever a new version is released and check for breaking changes.

## Conclusion

That covers the basics of Deno, from its history to the CLI commands you will use day to day. If you are coming from Node.js, the built-in tooling and web-standard APIs should feel like a welcome change. In the next part of this series, we will look at how to offload heavy computation from JavaScript to Rust using Deno's FFI.
