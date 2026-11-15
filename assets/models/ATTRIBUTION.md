# Venus de Milo bust

Original scan: **Venus de Milo (Aphrodite of Milos)** by **SMK – National Gallery of Denmark**, Royal Cast Collection.

- Original: https://sketchfab.com/3d-models/venus-de-milo-aphrodite-of-milos-53082b5d6cef4c34a9701a2a24f58075
- License: CC0 Public Domain, https://creativecommons.org/publicdomain/zero/1.0/
- Cropped, oriented bust obtained from https://github.com/nsaw/mesh-maker/blob/main/public/demo/venus-de-milo.mcfig (asset metadata preserves the scan's CC0 dedication).
- Converted to Y-up, centered and scaled, with smooth vertex normals using `scripts/convert-statue.py`. `venus.bin` contains little-endian u32 vertex/index counts, interleaved f32 positions/normals, then u32 triangle indices.

To regenerate, download that `.mcfig` file and run `python3 scripts/convert-statue.py <downloaded-file>` from the repository root. Model data is hosted locally and loads only on the graphics page.
