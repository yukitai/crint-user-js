import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/crint.user.ts'],
    banner: {
        js: `\
// ==UserScript==
// @name         crint
// @version      1.3.1
// @description  A powerful linter for Scratch.
// @author       Yukitai
// @match        https://turbowarp.org/editor
// @match        https://turbowarp.org/editor?*
// @icon         https://turbowarp.org/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(function () {`
    },
    footer: {
        js: `})()`
    },
    splitting: false,
    clean: true,
    platform: "browser",
    target: "esnext",
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
})