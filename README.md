# personal-site

The `11ty`-based renderer for [marcusgrant.se](https://marcusgrant.se).
Reads markdown content from `personal-site-content`,
produces static HTML, deploys to `BunnyCDN`.

This repo is the renderer only.
Content lives in
[`personal-site-content`](https://github.com/marcusgrant/personal-site-content)
as its own repo.
The renderer reads from a configurable path (`CONTENT_PATH`) so content and
renderer can evolve independently.

## First look

```bash
# Clone both repos as siblings
git clone git@github.com:marcusgrant/personal-site.git
git clone git@github.com:marcusgrant/personal-site-content.git

# Point the renderer at the content repo
cd personal-site
export CONTENT_PATH=../personal-site-content

# Install dependencies, build the site
npm install
just build

# Or run the dev server with live reload
just serve
```

Output lands in `_site/`.

## Documentation

Project docs live in [`docs/`](./docs/).
Start at [`docs/README.md`](./docs/README.md) for the index.

- [`docs/design/`](./docs/design/)
  - architecture, content contract, IndieWeb implementation, CSS posture.
  - What this renderer is making.
- [`docs/usage/`](./docs/usage/)
  - sync-content script, 11ty config, deploy pipeline, conventions.
  - How to run and develop it.

## License

GPL-3.0. See [`LICENSE`](./LICENSE).

Content lives in `personal-site-content` and
is licensed separately under CC BY-NC 4.0.
