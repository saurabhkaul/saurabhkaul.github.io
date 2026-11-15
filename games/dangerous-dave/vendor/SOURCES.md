# Emulator source and license

This page serves unmodified browser files from the GPL-2.0 `emulators` npm package, version **8.5.3**, by Alexander Guryanov and the js-dos / DOSBox contributors.

- [Download the accompanying source archive](emulators-8.5.3-source.tar.gz), including native DOSBox sources and build scripts.
- [GPL-2.0 license](LICENSE).
- Upstream wrapper source: https://github.com/js-dos/emulators/tree/e6f4e5449a5b17ae3ea0fdccfd453c8d299e9ea5
- Native DOSBox source: https://github.com/js-dos/dosbox/tree/528578d5a6f76afd4d5ef4e722b5670826f1183a
- Original package: https://registry.npmjs.org/emulators/-/emulators-8.5.3.tgz

The source archive includes the exact wrapper revision and its `native/dosbox` submodule at the revision above. Extract it and follow its `README.md`, `Dockerfile`, and `gulpfile.ts` build scripts for the `wdosbox` browser target. Other native backends (DOSBox-X, Sokol, gl4es) are not distributed by this site and are not included; their upstream submodule references remain available for building those optional targets.

Served files: `emulators.js`, `wdosbox.js`, `wdosbox.wasm`. No emulator code has been modified. The site's `game.js` supplies its own rendering, audio scheduling, and input UI. Browser source maps are omitted from the runtime; all source is in the archive above.
