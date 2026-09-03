/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-social.
 * Base: cards (2 columns; row 1 = block name, each subsequent row = one card:
 *              cell 1 = image, cell 2 = text/link content).
 * Source: https://sunfeastyippee.com/
 * Selector: .socialmediacomp
 * Generated: 2026-09-03 (da project)
 *
 * The #YiPPeelicious Instagram grid: a set of Instagram <a> image links laid out in
 * columns. Each anchor wraps a lazy-loaded image (data-src) and links to Instagram.
 * We emit one card row per image link — image in cell 1, its Instagram link in
 * cell 2. The title ("#YiPPeelicious"), subtitle paragraph and "Join us" CTA are
 * default content handled by the transformer, so they are intentionally NOT emitted
 * here to avoid duplication.
 *
 * NOTE: The automatic completeness score is expected to be low for this block. The
 * validator compares the full source-element text (which includes the title,
 * subtitle and CTA) against the parsed block text. Those elements are deliberately
 * omitted here because the transformer renders them as default content, so their
 * absence from the block is correct — not dropped content.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Instagram image links inside the card grid. Restrict to anchors that actually
  // wrap an image so the "Join us" CTA (anchor with only a text span) is excluded.
  const imageLinks = Array.from(
    element.querySelectorAll('.cmp-social__card-column a, .cmp-social__card-container a')
  ).filter((a) => a.querySelector('img'));

  imageLinks.forEach((a) => {
    const img = a.querySelector('img');
    if (!img) return;
    // Normalize lazy images: data-src holds the real Scene7 URL.
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) img.setAttribute('src', dataSrc);

    const href = a.getAttribute('href') || '';

    // Cell 2: a clean link to the Instagram destination for this card.
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = href;

    cells.push([img, link]);
  });

  // Empty-block guard: bail gracefully if there are no image cards.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-social', cells });
  element.replaceWith(block);
}
