/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-story.
 * Base: hero (1 column; row 1 = block name, row 2 = optional background image,
 *              row 3 = title + subheading + CTA).
 * Source: https://sunfeastyippee.com/
 * Selector: .cmp-container--multiTitle
 * Generated: 2026-09-03 (da project)
 *
 * Brand-story band: a multi-color title split across several .cmp-title__text spans
 * ("YiPPee" + "eeeeeee" + "eeeeeeeee" + "eeeee!" = "YiPPeeeeeeeeeee!") over a noodle
 * background image, plus a paragraph about round noodles / masala. We emit a
 * single-column hero: an optional background image row, then a content cell with a
 * combined heading and the brand paragraph. Images are lazy-loaded (data-src), so we
 * normalize data-src → src before referencing them.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Row 2 (optional): background image --------------------------------------
  // The noodle "Home-desktop-Noodles BG" scene7 image, if present in the markup.
  const bgImage = element.querySelector(
    'img[class*="bg"], img[class*="background"], img[class*="noodle"], picture img, img'
  );
  if (bgImage) {
    const dataSrc = bgImage.getAttribute('data-src');
    if (dataSrc) bgImage.setAttribute('src', dataSrc);
    cells.push([bgImage]);
  }

  // --- Row 3: content cell (1-column block) ------------------------------------
  const contentCell = [];

  // Combined multi-color title. Concatenate the .cmp-title__text spans into a
  // single heading so it reads as one word ("YiPPeeeeeeeeeee!").
  const titleParts = Array.from(element.querySelectorAll('.cmp-title__text'))
    .map((el) => (el.textContent || '').trim())
    .filter(Boolean);
  if (titleParts.length) {
    const heading = document.createElement('h2');
    heading.textContent = titleParts.join('');
    contentCell.push(heading);
  }

  // Brand paragraph(s) about round noodles / masala.
  const paragraphs = Array.from(element.querySelectorAll('.cmp-text p, p'));
  paragraphs.forEach((p) => contentCell.push(p));

  // Empty-block guard: bail gracefully if there is nothing meaningful to emit.
  if (contentCell.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-story', cells });
  element.replaceWith(block);
}
