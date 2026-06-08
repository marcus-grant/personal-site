# Architecture

The personal-site renderer is one of two repos that together produce the
deployed site at <https://marcusgrant.se>.
This document covers the structural shape: the two-repo split, the build
provenance model, and the eventual composer integration.

## Two-repo split

Content and rendering live in separate repos.

- `personal-site` (this repo)
  - 11ty config, templates, build scripts, CSS.
  - The renderer.
- `personal-site-content`
  - Markdown articles, notes, colocated assets.
  - The content.

### Rationale

Content and renderer have different life-cycles.
Content evolves continuously as posts are written, edited, and tagged.
The renderer changes much less often and on its own schedule.
Versioning, change frequency, and the right backup strategy all differ
between the two.

Keeping them separate makes the renderer-neutrality of the content
structural rather than conventional.
A future Hugo or Zola renderer can consume the same content without the
content repo changing.
The content survives the renderer.

This is the same pattern used by `zk-notes` in the ecosystem.

### CONTENT_PATH mechanism

The renderer reads content from a configurable path, exposed as the
`CONTENT_PATH` environment variable.

- Local development:
  - Set `CONTENT_PATH` to a sibling checkout of the content repo.
- Production (eventual composer-managed):
  - Composer clones or fetches the content cache, checks out the pinned
    ref, and passes the path to the renderer.
- MVP fallback:
  - If `CONTENT_PATH` is unset, the sync script clones the content repo
    into a gitignored cache directory and uses that.

The build's sync-content step resolves this path, materializes the
content into the renderer's input directory via symlink, and records the
content git ref it pulled.
See `doc/usage/` for the sync script details.

## Three-input build provenance

Every deployed build of the site is a function of three inputs.

1. Content ref: the git commit of `personal-site-content` the build read.
2. Renderer ref: the git commit of this repo the build ran from.
3. Theme version: the pinned version of the shared CSS theme.

Until the theme repo exists, the theme version slot is recorded as
`inline` to indicate the in-repo CSS was used instead of a fetched theme.

### Build metadata

Each build writes a `build-info.json` file into the build output.

Shape:

```json
{
  "content_ref": "abc123...",
  "renderer_ref": "def456...",
  "theme_version": "inline",
  "built_at": "2026-04-29T14:30Z"
}
```

The composer reads this to answer questions like "what content was live
on date X" and "what renderer produced this build".

## Composer integration

The composer/deployer is a separate planned project.
It will orchestrate the full stack at deploy time: NormPic for photo
manifests, Galleria for gallery output, this renderer for the main site,
and the BunnyCDN push at the end.

For MVP, the renderer can be built and deployed standalone without the
composer.
The sync script handles content fetching directly; deploy is a justfile
recipe that pushes to BunnyCDN.

When the composer arrives, it takes over:

- Cloning or fetching content into a cache directory.
- Passing `CONTENT_PATH` to the renderer.
- Pinning all three refs (content, renderer, theme) in its own
  configuration.
- Triggering rebuilds on changes to any of the three inputs.

The renderer is designed so this handoff is mechanical.
No architectural rework is required when the composer takes over.
