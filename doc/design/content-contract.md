# Content contract

The contract between the renderer and `personal-site-content`.
This document defines the on-disk layout, front-matter schema, and URL
structure that the renderer expects.
The contract is renderer-neutral by design.

## Principles

- Singular field names.
  - Example: `tag` not `tags`, `syndication` not `syndications`.
- ISO 8601 dates at minute precision in UTC.
  - Example: `2026-04-29T14:30Z`.
- Slug, `id`, and `date` are immutable once published.
  - The URL is the durable contract.
  - Mutation breaks IndieWeb identity.

## Post types

Two post types in v0.1.

- `article`
  - Long-form, titled, intended for sustained reading.
  - Page-bundle layout (folder per post, colocated assets).
  - Syndicates as title plus link on platforms with character limits.
- `note`
  - Short-form microblog content.
  - No title.
  - File-per-post (no folder; notes do not carry assets).
  - Rich content via `depo://` URI references.
  - Syndicates as full content to fediverse platforms.

The split is required, not just preferred.
IndieWeb micro-formats markup, syndication behavior, and feed semantics
differ between article and note.
Merging them would force wrong behavior for half the content.

Reserved for future work but not in v0.1: replies, bookmarks, photo
posts as a first-class type.

## URL structure

Tier 1 contract.
Permanent once published.

- Articles: `/article/<year>/<slug>/`
- Notes: `/note/<id>/`
- Tags: `/tag/<tag>/`
- About page: `/about/`
- Homepage: `/`

### Feeds

- All content combined: `/feed.xml`
- Articles only: `/article/feed.xml`
- Notes only: `/note/feed.xml`

Per-type feeds matter because some readers want long-form only, not the
microblog firehose.

### Note `id` field

Notes carry a short `id` field as their stable handle.
Four to six characters, generated at creation, NewBase60-style.
Used for the URL slot and as the canonical reference for the note.
Not human-readable; not derived from any title (notes have no title).

## Frontmatter schema

```yaml
post_type: article          # required: 'article' | 'note'
title: "..."                # required for article, omitted for note
date: 2026-04-29T14:30Z     # required, ISO 8601 minutes precision UTC
updated: 2026-04-29T16:00Z  # optional, only on meaningful content changes
slug: "..."                 # optional (article only), derived from title
id: "abc123"                # required for note
summary: "..."              # optional, article only
tag: [foo, bar]             # optional, flat strings
syndication: [https://...]  # optional, list of URLs
in_reply_to: https://...    # optional, future use
draft: false                # optional, default false
```

### Required vs optional

- Article required: `post_type`, `title`, `date`.
- Article optional: `slug`, `updated`, `summary`, `tag`, `syndication`,
  `draft`.
- Note required: `post_type`, `date`, `id`.
- Note optional: `tag`, `syndication`, `draft`, `in_reply_to`.

### Frontmatter principles

- No renderer-specific fields.
  - No `permalink`, no `eleventyComputed`, no shorthand `layout`.
  - Renderer concerns are configured outside frontmatter.
- No computed fields.
  - Reading time, word count, etc., are derived at render time.
- No visual or styling hints.
  - Content describes itself, not its presentation.

## On-disk content layout

```txt
content/
article/
2026/
my-post-slug/
index.md
diagram.png
screenshot.jpg
note/
2026/
04/
abc123.md
```

### Articles

Folder-per-post (page-bundle layout).
Markdown bodies reference colocated images with relative paths.
Example: `![diagram](./diagram.png)`.
Renderer-neutral; matches Hugo's native shape if the renderer ever swaps.

### Notes

File-per-post.
Notes are predominantly text with optional `depo://` URI references for
rich content.
They do not need folders.
On-disk grouping by year and month is for human navigation; URLs derive
from the `id` field in front-matter regardless of folder location.

The `depo://` URI scheme is how notes reference rich content (links,
images, embeds) without colocating assets.
The renderer resolves `depo://` references at build time via depo's
resolution API.
For syndication, references resolve to canonical URLs before posting to
platforms that do not speak depo.

## Validation

Front-matter schema validation is deferred.
The validator will live in `personal-site-content` (proposed location)
and run on content commits, in pre-commit hooks, or ad-hoc.
The renderer can invoke it as a build gate once it exists.

Until then, schema correctness is enforced by reading this document and
following the examples.
