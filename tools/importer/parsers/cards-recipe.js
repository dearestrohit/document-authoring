/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-recipe.
 * Base: cards (2 columns; row 1 = block name, each subsequent row = one card
 *              [image | text content]).
 * Source: https://sunfeastyippee.com/recipe-listing.html
 * Selector: .cmp-cards--yippee-diy
 * Generated: 2026-09-03 (da project; DIY card set only; heading/subheading = default content)
 *
 * Maps the DIY recipe card set ("Make With Magic Masala!"). Each card is a
 * Scene7 DM image with a decorative play-button overlay and a linked title.
 * The section heading ("Make With Magic Masala!") and subheading are DEFAULT
 * CONTENT extracted separately by the transformer (see section.defaultContent),
 * so they are intentionally not emitted into this block.
 *
 * Scene7 image note: the DM/Scene7 transformer converts Scene7 <img> elements
 * into anchors before this parser runs in the import pipeline, so the main card
 * media is captured whether it is still an <img> (live validation) or already an
 * <a> (post-transform). The local play-icon PNG overlay is decorative and is
 * deliberately excluded.
 */
export default function parse(element, { document }) {
  // Each card in the DIY set.
  const cards = Array.from(element.querySelectorAll('.cmp-card--yippee-diy'));

  const cells = [];

  cards.forEach((card) => {
    const media = card.querySelector('.cmp-card__media') || card;

    // Main card image: prefer the Scene7 image / its DM anchor; never the
    // local play-icon overlay (class "play-icon" / local ./images PNG).
    let image = media.querySelector('img.cmp-card__img')
      || media.querySelector('a[href*="scene7"], a[href*="itcportalprod"]')
      || media.querySelector('img:not(.play-icon)');

    // Title (styled as heading in the card content cell).
    const title = card.querySelector('.cmp-card__title, h2, h3');

    // Skip cards with no meaningful content.
    if (!image && !title) return;

    // Cell 1: image (pad with empty string if absent to keep 2 columns).
    // Cell 2: text content (title).
    cells.push([image || '', title || '']);
  });

  // Empty-block guard: if no cards were found, unwrap rather than emit an empty block.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-recipe', cells });
  element.replaceWith(block);
}
