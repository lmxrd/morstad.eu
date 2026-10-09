---
title: How to build a module for both Deno and Node
date: "2023-06-02"
tags: [Deno, Node.js]
codeFolderLink: https://github.com/lmxrd/blog-code/tree/main/code/module_deno_node
summary: "A shared build setup so one codebase ships as a package for both runtimes."
---

# How to build a module for both Deno and Node

If you have been developing for Deno and Node.js, you might have noticed slight issues with creating code that can easily be shared between the two runtimes.

In this post I will show you how to create a module that can be used in both Deno and Node.js, with minimal friction.

## Setup the project

Let's start by setting up a new project. Create a new folder, and initialize a new Deno project:

```bash
mkdir module_deno_node
cd module_deno_node
deno init
```

A couple of files should have been created in your folder, but let's rename `main` to `mod` and move them around a bit. Rename and move the files around so that the folder structure looks like this:

```
module_deno_node
├── deno.jsonc
└── lib
    ├── mod.ts
    ├── mod_test.ts
    └── mod_bench.ts
```

> The reason we rename `main` to `mod` is because this is the convention in file naming for Deno modules. `main` is usually used for applications to indicate the entry point.

Also make sure that the mod.ts file only contains the following:

```ts
export function add(a: number, b: number): number {
  return a + b;
}
```

## Add the NPM build script

We will now create a build script that will generate a NPM module for us that we can publish. Create a file at `scripts/build_npm.ts`:

```bash
mkdir scripts
touch scripts/build_npm.ts
```

We will be using a library called [Deno to Node Transform (DNT)](https://github.com/denoland/dnt) to help us with the transformation and build process. In your newly created file, add the following:

```ts
import { build, emptyDir } from "jsr:@deno/dnt/mod";

// Empties the output folder
await emptyDir("./npm");

// Builds the package
await build({
  entryPoints: ["./lib/mod.ts"],
  outDir: "./npm",
  // Disables test files
  test: false,
  shims: {
    deno: true,
  },
  // Disables the inclusion of a UMD or CJS module
  scriptModule: false,
  // Creates a ESM module
  esModule: true,
  // package.json properties
  package: {
    name: "module_deno_node",
    version: Deno.args[0],
    description: "Shared module for Deno and Node.js",
    license: "MIT",
    type: "module",
    repository: {
      type: "git",
      url: "git+https://github.com/example/module_deno_node.git",
    },
    bugs: {
      url: "https://github.com/example/module_deno_node/issues",
    },
    // Publishes to GitHub Packages
    publishConfig: {
      registry: "https://npm.pkg.github.com",
    },
  },
});
```

You can now try to run it:

```bash
deno run -A scripts/build_npm.ts
```

You should now have a new folder called `npm` with a generated package inside. If you have set up your local git config correctly, you should be able to publish it to GitHub Packages:

```bash
cd npm
npm publish
```

It's as easy as that! You now have your code available as for Deno using the repo url, and also for Node.js using the generated package.

## Finishing touches

### Gitignore

As you can probably see, you should add the `npm` folder to your gitignore file.

### Post build steps

Another thing that can be smart to do is to add a `README.md` file to the project root, and add the following post build step to the build script:

```ts
// post build steps
Deno.copyFileSync("README.md", "npm/README.md");
```

### Entry points

Lastly, if you want to share this module between both client and server code, it can be smart to separate the code using entrypoints. This is not shown in the code folder example, but this is how you could structure it in the build script:

```
entryPoints: [
    "./lib/default/mod.ts",
    {
      name: "./browser",
      path: "./lib/browser/mod.ts",
    },
    {
      name: "./system",
      path: "./lib/system/mod.ts",
    },
  ],
```

Here you would have one shared entrypoint that is used both on the client and server side, and also two separate entrypoints for client and server code.

Now you know how to create a shared library for both Deno and Node.js (and even include different entrypoints for browser and system)! Hope you enjoyed this, and I'll see you around!
