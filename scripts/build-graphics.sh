#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
# wasm-pack installs the matching wasm-bindgen CLI; wasm-opt is optional here.
wasm-pack build rust/graphics --target web --release \
  --out-dir ../../graphics/pkg --out-name site_graphics --no-typescript --no-opt --locked
# wasm-pack ignores its entire output by default; these files must ship on Pages.
rm -f graphics/pkg/.gitignore graphics/pkg/package.json
