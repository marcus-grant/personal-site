# personal-site renderer
# https://marcusgrant.se

default: build

# Materialize content into the renderer's input directory.
sync-content:
    node ./script/sync-content.mjs

# Build the static site.
build: sync-content
    npx @11ty/eleventy

# Run the dev server with live reload.
serve: sync-content
    npx @11ty/eleventy --serve

# Run the test suite.
test:
    node --test test/

# Remove build output and the sync-content cache.
clean:
    rm -rf _site/ .cache/

# Run all verification (currently just tests).
check:
    just test
