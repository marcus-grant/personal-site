# personal-site-content

Markdown content for [marcusgrant.se](https://marcusgrant.se).
Articles, notes, and colocated assets.

This repo is the durable artifact.
Content is renderer-neutral: frontmatter and markdown bodies are not
tied to any specific static site generator.
The current renderer is
[`personal-site`](https://github.com/marcusgrant/personal-site).

## Layout

```
content/
  article/<year>/<slug>/index.md
  note/<year>/<month>/<id>.md
```

## Frontmatter schema

See `doc/design/content-contract.md` in the renderer repo for the
frontmatter schema, URL structure, and post types.

## License

CC BY-NC 4.0.
See [`LICENSE`](./LICENSE).