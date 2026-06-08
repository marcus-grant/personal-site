# Usage

Operational documentation for the personal-site renderer.
Covers the build pipeline, deploy process, and project conventions.

## Topics

- [`sync-content.md`](./sync-content.md)
  - The Node script that resolves CONTENT_PATH, pulls or fetches the
    content repo, and symlinks content into 11ty's input directory.
  - Runs before every build, decoupled from 11ty's lifecycle.
- [`build.md`](./build.md)
  - 11ty configuration, justfile recipes, BunnyCDN deploy, build-info
    metadata.
- [`convention.md`](./convention.md)
  - TDD posture, just as task runner, semver, changelog discipline,
    licensing.

## Quick reference

Build the site:

    just build

Run the dev server:

    just serve

Deploy:

    just deploy

Force a content refresh without rebuilding:

    just sync-content

All justfile recipes ensure `sync-content` runs first.
The dev server picks up content changes through the symlink.
