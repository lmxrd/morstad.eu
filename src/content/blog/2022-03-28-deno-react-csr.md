---
title: React CSR with Deno
date: "2022-03-28"
tags: [Deno, React]
codeFolderLink: https://github.com/lmxrd/blog-code/tree/main/code/deno_react
summary: "Serving a client-rendered React app straight from a vanilla Deno server."
---

# React CSR with Deno

> This post is related to my course ['Build and Deploy a REST API with Deno' on Newline.co](https://www.newline.co/courses/build-and-deploy-a-rest-api-with-deno). Take a look if you are interested in learning more!

When you think of building a React app, the first thing you most likely consider is which build tool to use. Coming from Node.js, there are at least a dozen different ones, including [Parcel](https://parceljs.org/), [webpack](https://webpack.js.org/) and many more. The headache with many of these tools is that we often have different requirements, including TypeScript support, experimental features, bundling with compatibility support, and often it takes us longer than expected to get into the actual development as you have to set up your build tool first. Deno by itself is not (yet at least) the solution to the problem, but it does get us a step along the way, and if you are really passionate, you can even create an entire React app using it. This guide is meant for the more adventurous of the developers out there, so don't expect to create your next company web app using this guide (take a look at [Aleph.js](https://alephjs.org/) if you want to go the Deno route).

## Basics of a React App

So what exactly is needed to create a React app? Well, in its basics, React is just a JavaScript module that can be added to your webpage, so let's start with the basics. For any webpage, you need an HTML file to contain the minimum. Here is an example of a basic HTML file saying "Hello world!".

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    Hello world!
  </body>
</html>
```

That looks simple, right! To view the page, place the code in a file named `index.html`. You can use any file server to host it, but since this is a Deno tutorial, I will use this command to host the file.

```shell
deno run --allow-net --allow-read https://jsr.io/@std/http/file-server .
```

> All a file server does, is to host the files or folders on the local network on your machine. If you have the port open to the rest of the internet or your Wi-Fi, you can also access it via other devices.

### Adding React

So how can we add React to this page without needing any external tools? Well, HTML is by default able to fetch scripts from the web, so all we need to do is to add it to our HTML file. Change your `index.html` to the following, and reload the webpage (no need to restart the file server as nothing is cached).

> The following code is adapted from the quick start guide from React, find it [here](https://react.dev/learn/add-react-to-an-existing-project).

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    Hello, world!

    <div id="like_button_container"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

    <script>
      "use strict";

      const e = React.createElement;

      const LikeButton = () => {
        const [liked, setLiked] = React.useState(false);
        if (liked) return "You liked this.";
        return e("button", { onClick: () => setLiked(true) }, "Like");
      };

      const domContainer = document.querySelector("#like_button_container");
      ReactDOM.render(e(LikeButton), domContainer);
    </script>
  </body>
</html>
```

A lot is going on here, and a lot has changed, so let's take a look at it. First, we expanded the `<body>` tag to allow for more content inside. We then added an empty `<div>` after "Hello world!" with the id `like_button_container`, this is so that we can query it later, and do whatever we want with it. We then add two scripts that load React to our website.

> Now you might wonder why we add the scripts at the end of the `<body>` tag and not in the `<head>` tag and the reason is simply that HTML is loaded and executed from top to bottom, so we still want to see "Hello world!" without having to wait for the scripts to load.

We then lastly get to the React code which is inlined in another script tag. This is all very standard HTML and React, so nothing exciting is going on, and if you try it in the browser, you will see that it works just like any other react app would.

### Using JSX

One thing to notice is that this is all standard JS, so if you want to use the powers of JSX, you will have to add another import from Babel. This is how it can be changed by using JSX, a bit easier to read now, isn't it?

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    Hello, world!

    <div id="like_button_container"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
      "use strict";

      const LikeButton = () => {
        const [liked, setLiked] = React.useState(false);
        if (liked) return "You liked this.";
        return <button onClick={() => setLiked(true)}>Like</button>;
      };

      const domContainer = document.querySelector("#like_button_container");
      ReactDOM.render(<LikeButton />, domContainer);
    </script>
  </body>
</html>
```

What has changed, is essentially that the `<script>` tag has the type `text/babel`, and that we don't need to utilize `React.createElement`, but can directly use the React components as HTML tags. By adding the type to the `<script>` tag, we tell the browser how the content should be parsed.

## Using Deno as a build tool

Now that you have a basic understanding of how React works with an HTML page, we can get started with using Deno as a build tool. Either create a new folder, rename the previous file, or just overwrite the contents of your `index.ts` with this base HTML code.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    Hello, world!
    <div id="app"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

Now, this looks eerie familiar to what we started with, except that we now have a `<div>` and a `<script>` tag. If you look at the page in the browser, you will see that the page still loads and displays "Hello world!" even if we have no `index.js` file. Taking a look at the network tab in the browser development tools, you will see that it gives a 404, but otherwise, that's about it.

Create an `index.tsx` file, and fill it with the following.

```tsx
import React from "https://esm.sh/react@17";
import ReactDOM from "https://esm.sh/react-dom@17";

const App: React.FC = () => {
  const [counter, setCounter] = React.useState(0);

  return (
    <>
      <p>{counter}</p>
      <button onClick={() => setCounter(counter - 1)}>Decrease</button>
      <button onClick={() => setCounter(counter + 1)}>Increase</button>
    </>
  );
};

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
```

You should now have an `index.html` and an `index.tsx` file, however, if you try to open the page in the browser again, you will only see "Hello world!". This is because we have not yet bundled our TSX code, and browsers are unfortunately not able to parse TypeScript ([yet](https://devblogs.microsoft.com/typescript/a-proposal-for-type-syntax-in-javascript/)). Create a `Makefile` and add the following scripts.

```makefile
bundle:
    deno bundle index.tsx index.js
watch:
    deno bundle --watch index.tsx index.js
serve:
    deno run --allow-net --allow-read https://jsr.io/@std/http/file-server .
dev:
    make -j 2 serve watch
```

Now if you are not too familiar with Makefiles, I will give you a quick run-up on what's happening.

- `bundle`: bundles the `index.tsx` into `index.js` in ESM format. This is useful for when you are making the production build.
- `watch`: does the same as `bundle`, but it also watches for file changes and runs the bundling again. This is useful for local development.
- `serve`: runs the file server, this can simply just run in the background and doesn't need to listen to changes.
- `dev`: runs the `serve` and `watch` command in parallel so that you can make changes and see them immediately in your browser.

Now if you run `make bundle` you will see that you get a TypeScript error complaining that you need to change your target libraries. Create a `deno.jsonc` file, and add the following lines to it. This will tell Deno that we want to use the browser and the latest ES configuration when bundling. If you want to learn more about Deno config, take a look at the [first post](/posts/deno-introduction) in this series, or the [official docs](https://docs.deno.com/runtime/reference/deno_json/).

```json
{
  "compilerOptions": {
    "lib": ["dom", "esnext"]
  }
}
```

Try to run `make bundle` again, and this time it should not throw any errors. Take a look into your working directory, and you should now have a new file called `index.js`. If you inspect it, you should see that it is a lot more code than what you have in `index.tsx`. This is due to Deno bundling in the parts of React you need and optimizes certain parts. To note, `deno bundle` does not yet minify your code, but this can be done by using [SWC](https://swc.rs/docs/configuration/minification) or [ESBuild](https://esbuild.github.io/api/#minify). Run `make serve` and open up the webpage, you should now be able to see the counter plus two buttons. Try them out!

## Epilogue

Well done! You have now completed the mini-lesson on how to use Deno to bundle your React app! Although it is not yet fully optimized for production, you can avoid many of the headaches you would usually have when using Node. Share your websites [here](https://github.com/lmxrd/blog-code/blob/main/deno-react-cra.md) for others to draw inspiration from!

See you around! 👋🏻
