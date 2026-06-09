import rssPlugin from "@11ty/eleventy-plugin-rss";
import syntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import Image from "@11ty/eleventy-img";

// Responsive image shortcode used in templates as
// {% image "./diagram.png", "Alt text" %}
async function imageShortcode(src, alt, sizes = "100vw") {
  if (alt === undefined) {
    throw new Error(`Missing alt text for image: ${src}`);
  }

  const metadata = await Image(src, {
    widths: [320, 640, 960, 1280],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlightPlugin);

  // Shortcodes
  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/asset");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_include",
      layouts: "_layout",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}