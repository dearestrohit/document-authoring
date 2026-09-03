/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner.
 * Base: hero (1 column; row 1 = block name, row 2 = optional background image,
 *              row 3 = title + subheading + CTA).
 * Source: https://sunfeastyippee.com/
 * Selector: #container-1859b8bd7b > .banneryippee, .banneryippee:first-of-type
 * Generated: 2026-09-03 (da project)
 *
 * The homepage banner is a JSON-driven rotating slider (.cmp-yippee-banner with a
 * data-endpoint). On the live page the slides are rendered at runtime, each with a
 * title (h2) and a description (p), plus a lazy-loaded slide image. We emit a
 * single-column hero that captures the SEO heading and every slide's heading +
 * description (and any slide images), so no source content is dropped. Images are
 * lazy-loaded via data-src, so we normalize data-src → src before referencing them.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Row 2 (optional): background / first slide image ------------------------
  // Normalize lazy images (data-src → src) and keep the first real slide image as
  // the block background.
  const allImages = Array.from(
    element.querySelectorAll('img.cmp-yippee-banner__item-image-img, img[class*="banner"], picture img, img')
  ).filter((img) => {
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) img.setAttribute('src', dataSrc);
    const src = img.getAttribute('src') || '';
    // Skip decorative sprites / play icons and inline data URIs.
    return src && !/play-icon/i.test(img.className) && !src.startsWith('data:');
  });
  const bgImage = allImages[0] || null;
  if (bgImage) {
    cells.push([bgImage]);
  }

  // --- Row 3: content cell (1-column block) ------------------------------------
  const contentCell = [];

  // SEO heading (hidden on page but part of source content).
  const seoHeading = element.querySelector('.cmp-yippee-banner__seo-h1 h2');
  if (seoHeading) contentCell.push(seoHeading);

  // Each rendered slide: title (h2) + description (p).
  const slideTitles = Array.from(
    element.querySelectorAll('.cmp-yippee-banner__item-title h2, .cmp-yippee-banner__item-title')
  );
  const slideDescs = Array.from(
    element.querySelectorAll('.cmp-yippee-banner__item-desc, p.cmp-yippee-banner__item-desc')
  );
  slideTitles.forEach((t) => contentCell.push(t));
  slideDescs.forEach((d) => contentCell.push(d));

  // Fallback: if nothing slide-specific was found, capture any headings/paragraphs.
  if (contentCell.length === 0) {
    const heading = element.querySelector('h1, h2');
    if (heading) contentCell.push(heading);
    Array.from(element.querySelectorAll('p')).forEach((p) => contentCell.push(p));
  }

  // Empty-block guard: bail gracefully if there is nothing meaningful to emit.
  if (contentCell.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
