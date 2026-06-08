# Build and deploy

The build pipeline takes content from `personal-site-content` and the
templates from this repo, renders to static HTML, and deploys to
BunnyCDN.

## 11ty configuration

The renderer uses 11ty (Eleventy) for static site generation.

### Templates

Nunjucks templates throughout.
Chosen as the default 11ty templating engine: well-documented, no
coupling to JavaScript, easy to read.

Templates live in `src/_includes/` and `src/_layouts/`.
Microformats markup is hand-rolled in the templates rather than driven
by a plugin.
See [`../design/indieweb.md`](../design/indieweb.md) for the microformats
contract.

### Plugins

Minimal plugin set.

- `@11ty/eleventy-plugin-rss`
  - Feed generation.
  - Used for the canonical feeds at `/feed.xml`, `/article/feed.xml`,
    `/note/feed.xml`.
- `@11ty/eleventy-plugin-syntaxhighlight`
  - Syntax highlighting in article code blocks.
- `@11ty/eleventy-img`
  - Responsive image handling for article-bundled images.

### Input and output

- Input: `src/`.
  - Contains templates, includes, data files, and the symlinked
    `src/content/` directory that the sync-content script materializes.
- Output: `_site/`.
  - Static HTML, CSS, assets ready to deploy.
  - Includes the `build-info.json` file (below).

### Node version

The required Node version is declared in `package.json` `engines`.
Latest stable.

## Justfile recipes

The justfile is the single entry point for everything.

```just
default: build

sync-content:
    node ./script/sync-content.mjs

build: sync-content
    npx @11ty/eleventy

serve: sync-content
    npx @11ty/eleventy --serve

deploy: build
    ./script/deploy.sh

test:
    node --test test/

clean:
    rm -rf _site/ .cache/

check:
    just test
```

`just` (no argument) runs the default recipe, which is `build`.

## Build-info metadata

Every build writes a `build-info.json` file into the output root.

Shape:

```json
{
  "content_ref": "abc123def456...",
  "renderer_ref": "fed654cba321...",
  "theme_version": "inline",
  "built_at": "2026-04-29T14:30Z"
}
```

Field semantics:

- `content_ref`
  - Git commit hash of `personal-site-content` the build read.
  - Read from `.content-ref` written by the sync-content script.
- `renderer_ref`
  - Git commit hash of this repo at build time.
  - Computed via `git rev-parse HEAD`.
- `theme_version`
  - Pinned shared theme version, or `inline` if using in-repo CSS.
  - See [`../design/css.md`](../design/css.md) for theme consumption
    details.
- `built_at`
  - ISO 8601 UTC timestamp at minute precision.

The composer reads this file (when present) to answer "what was live
on date X" and "what produced this build" queries.

## Deploy to BunnyCDN

Deploy pushes the contents of `_site/` to a BunnyCDN Storage zone.

The deploy script (`script/deploy.sh`) uses BunnyCDN's storage API or
rsync gateway to upload the build output.
Authentication is via a BunnyCDN storage zone password, sourced from
`password-store`.

Deploy is a pure publish step.
No build state is mutated; the script can be re-run safely if a previous
run failed mid-upload.

Hetzner object storage is not used.
It does not currently work as a CDN origin.

## Local dev workflow

Typical loop:

1. Edit a file in the content repo (sibling checkout) or in this repo.
2. The dev server picks up changes via 11ty's file watcher and rebuilds.
3. The browser reloads automatically.

`CONTENT_PATH=../personal-site-content just serve` starts the server.
The serve command runs sync-content first, then 11ty in watch mode.

For content-only edits, the symlink means 11ty sees changes directly.
For renderer edits (templates, CSS, config), 11ty's normal watcher
handles it.

## Composer takeover

The current build pipeline runs in this repo.
When the composer/deployer arrives, it takes over the orchestration.

- The composer manages the content cache.
- The composer pins all three refs (content, renderer, theme).
- The composer invokes `just build` then `just deploy`, or replaces
  them with its own deploy logic.

The justfile recipes are designed to continue working under composer
orchestration without modification.
See [`../design/architecture.md`](../design/architecture.md) for the
composer integration sketch.
