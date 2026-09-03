/* eslint-disable */
/* global WebImporter */
/**
 * Parser for recipe-listing.
 * Base: recipe-listing (existing purpose-built local block; no library convention).
 * Source: https://sunfeastyippee.com/recipe-listing.html
 * Selector: .cmp-product-explore-listing
 * Generated: 2026-09-03 (da project; dynamic query-driven block, config-only output)
 *
 * The recipe-listing block renders a dynamic recipe grid from query-index.json.
 * Its authored content is a set of optional 2-column key/value config rows
 * (index, path, category, tag, limit) — the block's decorate() reads rows with
 * exactly 2 cells as key/value pairs. The category tabs, individual recipe cards,
 * filters and "Load More" pagination in the source HTML are all rendered
 * dynamically by the block at runtime, so they are NOT extracted here.
 *
 * Config values are taken from the authoring analysis for this page:
 *   index=/query-index.json, path=/recipes, limit=5
 *
 * NOTE ON COMPLETENESS: The validation completeness score is intentionally low
 * for this block. The source element's visible text (heading, subheading,
 * category tabs, recipe card titles, "Load More") is either DEFAULT CONTENT
 * handled outside the block (header title/subtitle) or dynamically generated at
 * runtime from query-index.json. None of it is authored inside the block, so it
 * must not be emitted into the config table.
 */
export default function parse(element, { document }) {
  // Fixed 2-column config rows consumed by blocks/recipe-listing/recipe-listing.js.
  // Each row: [key, value]. Keys are lowercased by the block at decorate time.
  const config = [
    ['index', '/query-index.json'],
    ['path', '/recipes'],
    ['limit', '5'],
  ];

  const cells = [];
  config.forEach(([key, value]) => {
    cells.push([key, value]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'recipe-listing', cells });
  element.replaceWith(block);
}
