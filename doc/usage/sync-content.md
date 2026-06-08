# Sync-content

The sync-content script makes content from `personal-site-content`
available to 11ty as if it were native input.
It runs before every build as a separate process.

## Why this exists

11ty's input model is a single directory containing both
content and templates.
There is no native support for reading content from
a path outside the input directory.
Issue `#2353` in the 11ty repo (requested 2022) tracks the multi-input
feature and remains unimplemented.

Workable patterns for separate content repos all require integration glue.
The documented approaches include
symlinking, git sub-modules, and custom collections.
The 11ty maintainer flagged the symlink approach with
a *"famous last words"* caveat in the official discussion.
Sub-module plus `rsync` has been documented to work but
introduces its own state management problems.

This script chooses defensive symlinking with explicit pull,
run as a pre-build step, decoupled from 11tys life-cycle.
The life-cycle decoupling is the key decision.
Attempting to invoke a content sync from inside 11ty
(via the `eleventy.before` hook) breaks hot reload because
every file change triggers the hook, which modifies files,
which triggers the watcher, which triggers the hook again.
Running the sync outside 11tys awareness avoids this entirely.

## Behavior

The script performs four operations in order.

### 1. Resolve source

Determine where to read content from.

- If the `CONTENT_PATH` environment variable is set to an absolute path,
  use it directly.
  - The dev-mode pattern: a sibling checkout of the content repo.
- If `CONTENT_PATH` is unset, fall back to the cache directory.
  - The script clones `personal-site-content` into a gitignored cache
    location (e.g., `./.cache/content/`).
  - On subsequent runs, the script fetches and checks out the pinned
    ref (or the default branch).

### 2. Refuse to overwrite real files

Before creating a symlink, check the target path.

- If the path is a symlink, remove it.
- If the path is a real directory or file, error out and exit non-zero.
  - This prevents stale state from silently corrupting things.
  - A common failure mode in past attempts: leftover real directories
    masquerading as expected content locations.

### 3. Create symlink and validate

Symlink the resolved source path to the renderer's expected input
location (e.g., `./src/content`).

After creating the symlink:

- Verify the symlink resolves.
- Verify at least one file under the symlinked path is readable.
- Fail loud and exit non-zero if either check fails.

### 4. Record content ref

Capture the git commit hash of the resolved content source.

- Write the commit hash to `.content-ref` (or equivalent) at the project
  root.
- The build step reads this file when assembling `build-info.json`.
- See [`./build.md`](./build.md) for the build-info file structure.

## Configuration

Environment variables:

- `CONTENT_PATH`
  - Absolute path to a content checkout.
  - When set, source resolution skips the cache.
- `CONTENT_REPO_URL`
  - Git URL for the content repo.
  - Default: the canonical `personal-site-content` remote.
  - Used only when falling back to the cache.
- `CONTENT_REF`
  - Git ref to check out from the cache.
  - Default: the default branch (e.g., `main`).
- `CONTENT_CACHE_DIR`
  - Directory the script clones into when falling back.
  - Default: `./.cache/content/`.

## Justfile integration

The script is exposed as a justfile recipe and as a dependency of the
build and serve recipes.

```just
sync-content:
    node ./script/sync-content.mjs

build: sync-content
    npx @11ty/eleventy

serve: sync-content
    npx @11ty/eleventy --serve
```

`just sync-content` is the manual escape hatch for forcing a refresh.
`just build` and `just serve` always run it first.

## Tests

The script is the renderer's required passing test plus implementation
pair per the bootstrap definition.
Tests run with `node:test` (Node's built-in runner) and cover:

- Missing source (no `CONTENT_PATH`, no cache yet): clone and symlink.
- Stale cache (cache exists): fetch and check out.
- Stale symlink (target was a previous symlink): remove and recreate.
- Real file or directory in the target path: refuse and exit non-zero.
- Broken symlink (target does not resolve): fail loud and exit non-zero.

Run the tests:

```just
    just test
```

## Known concern: 11ty file watcher

11ty uses chokidar for file watching.
Chokidar follows symlinks by default.
Reliability across symlinks is a likely source of past "stumbled every
once in a while" experiences with this pattern.

If hot reload in `just serve` proves unreliable, the workaround is to
point 11tys `--input` at the source path directly instead of going
through the symlink.

Do not pre-build for this.
Hit it if it appears, document the workaround at that point.
