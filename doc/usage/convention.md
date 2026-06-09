# Convention

Project-wide conventions for the personal-site renderer.
These apply to every contribution: code, docs, content, infrastructure.

Most of these are ecosystem-wide, inherited from the broader set of
projects this renderer is part of.

## Test-driven development

TDD where deterministic behavior exists.

- The sync-content script has deterministic logic and is tested first.
- Pure functions (URL generation, frontmatter parsing, id generation,
  date formatting) get test coverage.
- 11ty templates and CSS do not get TDD treatment.
  - Visual review and example-based checks suffice.

Test runner: `node:test` (Node's built-in).
Tests live in `test/` at the project root.

Run tests:

    just test

## Task runner

`just` is the task runner.
The justfile is the single entry point for all common operations.

- No `make`, no `npm` scripts hosting orchestration logic.
- `package.json` `scripts` is used only for npm-native conventions
  (e.g., `prepare` hooks if needed).
- Cross-cutting commands go in the justfile.

See [`./build.md`](./build.md) for the full recipe list.

## Versioning

Strict semantic versioning.

- Major: incompatible changes to the content contract, URL structure,
  or other Tier 1 contracts.
- Minor: backward-compatible additions (new optional frontmatter fields,
  new feed types, new template features).
- Patch: bug fixes, content updates, internal refactors.

Versions are git tags in the form `v0.1.0`.
Tagged releases are pushed to the remote with `git push --tags`.

## Changelog

Every release updates `CHANGELOG.md`.

- Format: Keep-A-Changelog conventions.
- Sections: Added, Changed, Deprecated, Removed, Fixed, Security.
- Each entry is a single line where possible, with a brief explanation
  if needed.
- The `Unreleased` section accumulates changes until the next tag.

## Licensing

Two licenses across the personal-site ecosystem.

- Renderer code (this repo): GPL-3.0.
  - Code is the SSG itself, not the site output.
  - Free reuse with source disclosure on distribution.
  - Commercial use permitted under GPL terms.
- Content (`personal-site-content`): CC BY-NC 4.0.
  - Attribution required.
  - No commercial use without explicit consent.
  - The "free to take what you like with attribution, but no monetizing"
    intent encoded in a standard license.

See `LICENSE` at the repo root for the canonical text.

## Prose and markdown style

These rules apply to all written output in the project: READMEs, docs,
design notes, commit messages, code comments.

- 80-character line limit.
  - Sentence-ending punctuation always followed by a newline.
  - Long sentences break at the most natural point before character 81.
  - Natural break points: between phrases, at commas, between fragments.
- ASCII only.
  - No Unicode characters.
  - No smart punctuation.
- No em dashes.
  - Use sentence breaks with periods instead.
- Prose content is never altered to fit the wrap rule.
  - Wrap, never reword for length alone.

## Naming

- Singular forms for directory names.
  - `doc/`, not `docs/`.
  - `asset/`, not `assets/`.
  - `test/`, not `tests/`.
  - `script/`, not `scripts/`.
- Singular field names in schemas.
  - `tag`, not `tags`.
  - `syndication`, not `syndications`.
- Apply singular by default unless a plural form is genuinely more
  natural (rare).

## File headers

Every source and test file carries a header.
Two-part format: a relative path comment, then a block comment with
metadata.

For JavaScript and other C-style comment languages:

  ```js
  // relative/path/from/root.js
  /*
   * Brief description of the module.
   * Author: Marcus Grant
   * Created: YYYY-MM-DD
   * Revised: [YYYY-MM-DD, YYYY-MM-DD, ...]   (only on major revisions)
   * License: GPL-3.0-or-later
  */
  ```

For shell and other hash-comment languages:

  ```sh
#!/usr/bin/env bash
# relative/path/from/root.sh
#
# Brief description of the script.
# Author: Marcus Grant
# Created: YYYY-MM-DD
# License: GPL-3.0-or-later
  ```

The `Revised` line is added only when the file undergoes major revision.
Dates are ISO 8601 (`YYYY-MM-DD`).

## Documentation standards

Documentation describes the system, not the process behind its creation.

- Documentation must be readable cold by any dev with no context about
  how it was produced.
- Avoid references to external workflow, sessions, conversations, or
  process structure outside the project itself.
- Cross-references to related projects belong in the design subdirectory
  (`doc/design/README.md`).
- Every design topic gets a topic file in `doc/design/`.
- Every usage topic gets a topic file in `doc/usage/`.

## Ecosystem cross-references

This renderer is one of several projects in a wider ecosystem.
See [`../design/README.md`](../design/README.md#related-projects) for
the related projects list.
