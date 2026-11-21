# Credits and licences

ScrollWise was created by **Talia Kassissieh** and the ScrollWise student team.

## Photographs

### Licensed photos (`photos/`)

| Photo | Author | Licence | Source | Changes |
| --- | --- | --- | --- | --- |
| Espresso cup | Rachel Michetti | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [scikit-image sample images](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.coffee) (photo courtesy of Pikolo Espresso Bar) | cropped and resized |
| Tabby cat | Stefan van der Walt | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [scikit-image sample images](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.chelsea) | resized |
| Summer Palace, Beijing | danielbuechele (Flickr) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Flickr](https://www.flickr.com/photos/danielbuechele/6061409035/), via scikit-learn sample images | cropped and resized |
| Dahlia | vultilion (Flickr) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Flickr](https://www.flickr.com/photos/vultilion/6056698931/), via scikit-learn sample images | cropped and resized |
| Hubble eXtreme Deep Field | NASA / Hubble Space Telescope | Public domain (NASA) | [scikit-image sample images](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.hubble_deep_field) | cropped to 4:5 |
| Rocket on the launch pad | SpaceX | Public domain (released by SpaceX) | [Flickr](https://www.flickr.com/photos/spacexphotos/16511594820/) | cropped and resized |

The same credits appear inside the app under **Settings → Photo credits**, generated from `photos/credits.json`.

### AI-generated pictures (`photos/ai/`)

The other feed pictures were made with AI image tools and supplied by the ScrollWise team. They show fictional people and places, not real users. In the app, posts with these pictures carry an **AI info** label. Pictures in `photos/ai/temporary/` are temporary drafts waiting to be replaced. `PHOTO-MANIFEST.md` lists the status and source of every picture.

For each AI-generated picture, the team should record which tool made it and check that the tool’s terms allow publishing the image on a public website.

### Activity illustrations

The pictures in Find Your Next Moment are drawn in code (SVG) by the project itself (`src/lib/scenes/`, `src/lib/art.js`).

## Fonts

All under the [SIL Open Font License 1.1](https://openfontlicense.org):

- **Bricolage Grotesque** (headings), © The Bricolage Grotesque Project Authors. Loaded from Google Fonts; a small local copy (regular and bold, Latin characters) is included as a fallback in `src/fonts/` and `docs/assets/fonts/`, with its licence in `OFL.txt` next to it.
- **Figtree** (text) and **Caveat** (handwritten notes), loaded from [Google Fonts](https://fonts.google.com).
- **Inter** is used in the social sharing image (`public/social-card.png`) and the research guide PDF.

If a font can’t load, the device’s own system font is used instead.

## Software

- [React](https://react.dev) and React DOM: MIT License (licence notices kept at the end of `docs/assets/app.js`)
- [esbuild](https://esbuild.github.io): MIT License
- [sharp](https://sharp.pixelplumbing.com) (build only, optional): Apache License 2.0

## Services

- [GoatCounter](https://www.goatcounter.com) (optional visit counts), free for non-commercial use. Its counting script is loaded from GoatCounter’s own server only when a site code is set; it is open-source software.

## Logo and icons

The ScrollWise logo, favicon, app icons and interface icons were made for this project.
