# altv-typescript-react

## Installation

Inside your Alt:V resource directory:

    git clone https://github.com/n1xx1/altv-typescript-example.git
    cd altv-typescript-example
    npm install
    npx gulp build

## Features

**Server Side**

* Nothing special yet

**Client Side**

* Typed interface for the web views (via [n1xx1/altv-typescript](https://github.com/n1xx1/altv-typescript))

**Client WebView Side**

* React and SCSS
* Typed interface for the web views (via [n1xx1/altv-typescript](https://github.com/n1xx1/altv-typescript))
* Code splitting

## Project structure
* `src`
  * `client`
    * `@types`
      * ...
    * `tsconfig.json`
    * `index.ts`
    * ... 
  * `server`
    * `@types`
      * ...
    * `tsconfig.json`
    * `index.ts`
    * ... 
  * `render `
    * `tsconfig.json`
    * `myview1.view.tsx`
    * `myview2.view.tsx`
    * ...
* `build` (generated)
  * `render`
    * `view_myview1.html`
    * `view_myview1.js`
    * `view_myview2.html`
    * `view_myview2.js`
    * ...
  * `client.mjs`
  * `server.mjs`
* `resource.cfg`
* ...
