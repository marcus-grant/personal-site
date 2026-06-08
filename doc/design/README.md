# Design

Architecture and design context for the personal-site renderer.
Read this first for the high-level picture.
Each topic has its own file in this directory for the full detail.

## Topics

- [`architecture.md`](./architecture.md)
  - Two-repo split (renderer and content).
  - Three-input build provenance (content, renderer, theme refs).
  - Composer integration sketch.
- [`content-contract.md`](./content-contract.md)
  - Frontmatter schema, singular field names, ISO 8601 minutes UTC.
  - URL structure for articles, notes, tags.
  - Post types (article and note) and their on-disk layout.
- [`indieweb.md`](./indieweb.md)
  - Microformats markup on posts and homepage h-card.
  - Webmention endpoint via webmention.io.
  - Identity anchor for fediverse and Bluesky.
  - POSSE strategy and progression ladder.
- [`css.md`](./css.md)
  - PicoCSS as base, BEM class naming.
  - In-repo CSS treated as proto-theme for eventual extraction.
  - Fetch mechanism designed but not active in v0.1.

## Reading order

Read in the order listed above.
Architecture sets the structural context.
Content contract defines what the renderer consumes.
IndieWeb covers the federation and identity layer.
CSS posture wraps up the visual layer and its extraction trajectory.

## Related projects

The personal-site renderer is one component in a wider ecosystem.
The ecosystem is greater than the sum of its parts.
Status values used below: exists, planned, deferred.

- `personal-site-content` (exists)
  - Sibling repo holding markdown content this renderer consumes.
  - Frontmatter schema is enforced from there in the long term.
- shared CSS theme repo (deferred, name TBD)
  - Will eventually extract shared CSS from this renderer and the
    gallery project to unify look and feel across the ecosystem.
- composer/deployer (deferred)
  - Will orchestrate sync, build, and deploy across the stack.
  - Until then the renderer can be built and deployed standalone.
- Galleria (exists)
  - Static gallery generator.
  - Future co-tenant of the shared theme alongside this renderer.
- [depo](https://github.com/marcus-grant/depo) (active, separate project)
  - Provides `depo://` URI scheme.
  - Notes will eventually reference rich content via depo URIs.
  - Content addressed and URL shortening content store.
- zk-notes (planned)
  - Zettelkasten knowledge base served on a subdomain.
  - Distinct from the IndieWeb "note" post type defined here.
