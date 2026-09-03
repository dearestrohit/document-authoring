/* eslint-disable */
/* global WebImporter */
/**
 * Hoist authored content that is nested inside block containers out to sibling
 * position, so it survives block parsing (parsers replaceWith() their container).
 *
 * Runs in beforeTransform — before findBlocksOnPage captures element references —
 * so the block parsers only ever see/replace the container they own.
 *
 * Recovers three pieces of content that would otherwise be dropped:
 *  1. "Explore all recipes" heading + subtitle (default content nested inside
 *     .cmp-product-explore-listing) -> moved before the listing container.
 *  2. "#Sunfeastyippee" promo band (hero-promo) nested inside
 *     .cmp-product-explore-listing -> moved after the listing container so it
 *     keeps its source position between the grid and the DIY cards.
 *  3. "Make With Magic Masala!" heading + subheading (default content nested
 *     inside .cmp-cards--yippee-diy) -> moved before the DIY cards container.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const listing = element.querySelector('.cmp-product-explore-listing');
  if (listing && listing.parentNode) {
    const parent = listing.parentNode;
    const title = listing.querySelector('.cmp-product-explore-listing__header-title');
    const subtitle = listing.querySelector('.cmp-product-explore-listing__header-subTitle');
    const teaser = listing.querySelector('.cmp-product-explore-listing__extra-between-section.teaser');

    // Default-content heading + subtitle -> before the listing container.
    if (title) parent.insertBefore(title, listing);
    if (subtitle) parent.insertBefore(subtitle, listing);

    // hero-promo band -> after the listing container (preserves source order).
    if (teaser) {
      if (listing.nextSibling) parent.insertBefore(teaser, listing.nextSibling);
      else parent.appendChild(teaser);
    }
  }

  const diy = element.querySelector('.cmp-cards--yippee-diy');
  if (diy && diy.parentNode) {
    const parent = diy.parentNode;
    const heading = diy.querySelector('.cmp-cards__heading');
    const subheading = diy.querySelector('.cmp-cards__sub-heading');

    // Default-content heading + subheading -> before the DIY cards container.
    if (heading) parent.insertBefore(heading, diy);
    if (subheading) parent.insertBefore(subheading, diy);
  }
}
