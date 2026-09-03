/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo.
 * Base: hero (1 column; row 1 = block name, row 2 = optional background image,
 *              row 3 = title + subheading + CTA).
 * Source: https://sunfeastyippee.com/recipe-listing.html
 * Selector: .cmp-product-explore-listing__extra-between-section.teaser
 * Generated: 2026-09-03 (da project)
 *
 * Maps the orange promo teaser band: sparkle heading "#Sunfeastyippee",
 * supporting paragraph, and a "Join Us" CTA. The decorative cloud background is
 * a CSS background graphic (no <img> in source), so no background-image row is
 * emitted.
 */
export default function parse(element, { document }) {
  // Heading — sparkle title "#Sunfeastyippee"
  const heading = element.querySelector('.cmp-title__text, h1, h2, h3, [class*="title"]');

  // Supporting paragraph
  const description = element.querySelector('.cmp-text p, p');

  // CTA button ("Join Us"). The anchor wraps a span; keep the anchor so the
  // link (href) and its text are preserved.
  const cta = element.querySelector('a.cmp-button, a[class*="button"], .cmp-button a, a');

  // Optional background image (none in current source — handled defensively).
  const bgImage = element.querySelector('img[class*="background"], img[class*="bg"], picture img, img');

  // Empty-block guard: bail gracefully if there is no meaningful content.
  if (!heading && !description && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 (optional): background image — only if a real image element exists.
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title + subheading + CTA, all in the single content cell (1-column block).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
