# CSS posture

CSS for the personal-site renderer lives in-repo for `v0.1`.
This is not throwaway provisional CSS.
The in-repo CSS is the first draft of what the eventual shared theme
repo will extract.

## The posture

The shared CSS theme is a planned ecosystem project.
It does not exist yet.
When it does, it will extract shared patterns from this renderer and
from the Galleria project to unify look and feel across the ecosystem.

Until then, this renderer ships with its own CSS.
That CSS is designed as proto-theme: class names, custom properties,
and component patterns anticipate the eventual contract.
When extraction happens, the move is mechanical.
Files relocate, paths update, the patterns survive.

## Foundations

### PicoCSS as base

PicoCSS is the foundation layer.
Classless by default; styles attach to semantic HTML elements.
Minimal opinion, easy to extend.
Choosing it now aligns with the eventual theme's foundation, so
extraction is not also a foundation rewrite.

### BEM for custom classes

All custom classes follow Block__Element--Modifier conventions.

- Block: `.post`, `.h-card`, `.tag-list`.
- Element: `.post__title`, `.post__byline`, `.tag-list__item`.
- Modifier: `.post--note`, `.post--article`, `.tag-list--inline`.

BEM matches what the eventual shared theme will use.
Renderer commits to it from day one so extraction is rename-free.

### Custom properties

Color, spacing, and typography tokens are CSS custom properties on
`:root`.

- Never hardcode color values in template-adjacent CSS.
- Override PicoCSS variables where they exist.
- Define renderer-specific tokens where Pico does not cover the need.

The token names anticipate the eventual theme's namespace.
When the theme ships, tokens move to the theme bundle and renderer
references stay valid.

## Micro-formats interaction

Micro-formats classes and BEM classes coexist on the same elements.

- `h-entry` is structural (micro-formats); `.post` is stylistic (BEM).
- Both live on the same article element.
- Styling can hook on either.
- Useful pattern: style on the structural class where the styling is
  semantic (e.g., `.h-card` as a card-like surface), style on the BEM
  class where the styling is purely visual.

The micro-formats classes the renderer will produce (per
[`./indieweb.md`](./indieweb.md)):

- `h-entry`, `e-content`, `dt-published`, `u-url`, `p-author`, `p-name`,
  `u-syndication` on posts.
- `h-card`, `p-name`, `u-photo`, `u-url`, `p-pronoun`, `p-note` on
  identity surfaces.

These are stable inputs to the eventual theme contract.

## Layering rule

If the theme ever ships and gets adopted, the layering is:

1. PicoCSS base.
2. Shared theme bundle.
3. Renderer-local layer (site-specific only).

Renderer-local CSS never overrides theme tokens or theme component
styles.
It only adds.
If something needs overriding, that is a signal the override should move
to the theme.

Until the shared theme ships, layers 2 and 3 collapse into the in-repo
CSS, but the cascade discipline applies all the same.

## Fetch mechanism (designed, not active)

Configuration for theme consumption is designed but does not run in
v0.1.

Shape:

```yaml
theme:
  source: inline       # or 'cdn' once the theme repo ships
  name: <theme-name>   # set once the theme repo has a name
  version: 0.0.0       # set to the pinned semver tag
  local_path: null     # optional sibling checkout for dev
```

Two modes:

- `inline`: use the in-repo CSS bundle (v0.1 default).
- `cdn`: fetch from `https://cdn.marcusgrant.se/<name>/v<version>/main.css`
  at build time and write into output.

Local override: when `local_path` is set and the target exists, use it
instead of fetching from CDN.
Allows CSS work that spans both repos during a coordination session.

The build step that materializes the theme (whether inline copy or CDN
fetch) is described in [`../usage/`](../usage/).

## Coordination contract

When the theme repo bootstraps and reaches a state where extraction is
worth doing, the two repos coordinate on these points:

- Component inventory.
  - What styled things the site needs: page chrome, post layouts,
    list pages, identity, supporting elements.
- Class naming.
  - BEM, kebab-case, when semantic HTML alone suffices versus when a
    class is needed.
- micro-formats interaction.
  - Which micro-formats classes the renderer produces.
  - How styling hooks on them (see above).
- Custom property names.
  - The token namespace the renderer references in any renderer-local
    CSS.
- Layering rule.
  - Theme is base, renderer adds.
  - Renderer never overrides theme tokens or component styles.

This renderer brings these positions to the coordination.
Until coordination happens, the in-repo CSS embodies these positions
already.
