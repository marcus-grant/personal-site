# IndieWeb

IndieWeb plumbing for the personal-site renderer.
Covers micro-formats on posts, identity anchoring, web-mention endpoint,
and POSSE.

The unifying principle: the personal site is the canonical home and the
durable identity.
Silo accounts (Mastodon, Bluesky, etc.) are syndication targets that can
change without touching the canonical.

## h-card on the homepage

The homepage renders an `h-card` representing the site owner.

Fields:

- Name (`p-name`).
- Photo (`u-photo`).
- URL (`u-url`, points at this site).
- Optional pronouns (`p-pronoun`).
- Optional short bio (`p-note`).

A second `h-card` instance on `/about/` carries the longer bio and
contact methods.

## rel-me links

The homepage h-card includes `rel="me"` links to silo profiles
(Mastodon, Bluesky, GitHub, etc.).
Each silo profile in turn links back to this site.
The two-way handshake is what establishes identity equivalence.

When migrating between silo instances (e.g., switching Mastodon hosts),
the handshake gets re-done on the new instance.
The canonical identity on this site does not change.

The `rel-me` link set is rendered from `_data/identity.yml`.
See [Identity anchor](#identity-anchor) below.

## micro-formats on posts

Every post page carries `h-entry` markup with the following inside:

- `e-content` on the post body.
- `dt-published` on the publish date.
- `u-url` on the canonical URL.
- `p-author` referencing the homepage h-card.
- `p-name` on articles only (notes deliberately omit `p-name`).
- `u-syndication` for each URL in the frontmatter `syndication` array.

The `u-syndication` markup is the canonical-to-silo backlink contract.
Bridgy and other POSSE tooling depend on it.
See [POSSE](#posse) below.

## web-mention endpoint

The site declares a web-mention endpoint in the HTML head:

```html
<link rel="webmention" href="https://webmention.io/marcusgrant.se/webmention">
```

webmention.io receives mentions on behalf of the site.
In v0.1, mentions are received but not displayed on post pages.
Display is the first post-v0.1 feature on the ladder (see below).

Sending web-mentions on publish is also deferred.
The receiving infrastructure is what unlocks the inbound side of POSSE.

## Identity anchor

This site is the durable identity anchor.
It is not the fediverse identity host.

The distinction matters.

- Anchor.
  - The site is the verification target that silos point back to.
  - Silos own the active identity (`@user@mastodon.host`,
    `user.bsky.social`, etc.).
  - Migrating between silo instances does not touch the anchor.
- Host.
  - The site itself is the fediverse identity (`@user@yourdomain`).
  - Requires a webfinger endpoint, an actor JSON, signing keys, and
    real inbox/outbox handling.
  - Out of scope for v0.1.

The anchor surface area:

### Bluesky

A static file at `/.well-known/atproto-did` containing the Bluesky DID
verifies the domain handle.
Bluesky checks this file to confirm that `marcusgrant.se` (or a chosen
subdomain handle) belongs to the configured DID.

File approach over DNS TXT record because the static-site model makes
serving a file simpler than orchestrating DNS at deploy time.

### Mastodon

`rel-me` handshake on the homepage h-card.
Works identically for hosted Mastodon and a future self-hosted instance.
Only the URL in the rel-me link changes when migrating.

### Identity data file

A single `_data/identity.yml` file is the source of truth for silo
identities.

Shape:

```yaml
silos:
  - name: Mastodon
    handle: "@marcus@your-mastodon-host"
    url: https://your-mastodon-host/@marcus
    rel_me: true
  - name: Bluesky
    handle: marcusgrant.se
    url: https://bsky.app/profile/marcusgrant.se
    rel_me: true
    atproto_did: did:plc:xxxxxxxxxxxxxxxxxxxxxxxx
  - name: GitHub
    handle: marcusgrant
    url: https://github.com/marcusgrant
    rel_me: true
```

The h-card rel-me links, the `/.well-known/atproto-did` file content,
and any future per-silo markup all render from this single source.
Migrating instances or changing platforms means editing one file.

### Verification roundtrip

The Definition of Done for identity anchoring includes:

- Each silo profile linking back to this site.
- This site's rel-me linking to each silo profile.
- The Bluesky DID resolving correctly under the domain handle.

Concrete tests:

- Mastodon shows the green verified check-mark on the site link in the
  profile.
- Bluesky displays the domain handle correctly.

## POSSE

POSSE: Publish on your Own Site, Syndicate Elsewhere.
Canonical content lives here.
Copies go out to silos with backlinks pointing home.

The micro-formats markup is what makes this work.
Once `h-entry` and `u-syndication` are correct, every subsequent layer
of POSSE tooling can be added without retouching templates.

### Minimum viable POSSE in v0.1

- `h-card` on the homepage with `rel-me` links to silo profiles.
- `h-entry` markup on every post (full set above).
- `u-syndication` rendered from the `syndication` frontmatter array.
- web-mention endpoint via webmention.io.
- Manual posting to silos, manual recording of resulting URLs back into
  frontmatter.
- Per-type and combined feeds at canonical URLs.

The manual workflow is treated as a real disciplined workflow.
Syndication URLs go back into frontmatter promptly after posting.
The backlog does not accumulate.

### The POSSE ladder

Each rung adds capability and reduces friction without invalidating
prior work.

1. Bridgy inbound for fediverse.
   - Configure Bridgy to bridge silo replies, boosts, and likes back to
     this site as web-mentions.
   - Zero code, minutes of config.
   - Pain removed: you can finally see what your syndicated posts are
     doing.
2. Display web-mentions on post pages.
   - Build-time fetch from web-mention.io API per post.
   - Render received mentions into the page.
   - Pain removed: the canonical post becomes the aggregation point for
     distributed conversation.
   - This is the rung where the loop closes.
3. Send web-mentions on publish.
   - When publishing a post that links elsewhere, notify those sites.
   - Telegraph service or a build-time script.
   - Pain removed: full participation in the IndieWeb response graph,
     not just reception.
4. Bridgy outbound (automated syndication).
   - Configure Bridgy to push from site to silos based on
     `mp-syndicate-to` markup.
   - Pain removed: the manual posting step disappears.
   - Cost: opinion-forming about which posts syndicate, some loss of
     per-silo formatting control.
5. Custom syndication scripts in the renderer.
   - For platforms Bridgy does not cover, or where per-platform
     formatting matters.
   - Build-time or post-deploy.
   - Pain removed: long-tail platform coverage.
   - Cost: per-platform code, credentials, rate-limit handling.
6. Standalone syndication service.
   - When queueing, retries, and rate-limiting outgrow what is
     reasonable in the renderer's build pipeline.
   - Deferred until concrete need.
   - Standard premature-extraction warning applies.

### The non-obvious sequencing point

Rung 2 is the transition that matters most.
Through rung 1 it is still plumbing.
From rung 2 onward the loop is closed and the site is a working IndieWeb
hub.
Rung 2 is the natural first investment after the renderer ships, not
rung 4.
Automating outbound posting reduces friction but display is what makes
the whole system feel like it is actually working.
