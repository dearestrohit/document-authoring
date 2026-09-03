/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: sunfeastyippee site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Non-authorable content removed:
 *  - Header experience fragment (search, main nav, breadcrumb, social icons)
 *    -> div.experiencefragment wrapper + .cmp-experiencefragment--header
 *       (cleaned.html lines 5-186)
 *  - Footer experience fragment (footer nav, ITC titles, social media)
 *    -> .cmp-experiencefragment--footer (cleaned.html lines 729-816)
 *  - Tracking iframes (doubleclick / empty iframe) (cleaned.html lines 818, 833)
 *  - Leftover non-authorable elements: link, noscript, source, meta
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Header + footer site chrome (experience fragments) and tracking iframes.
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      '.experiencefragment',
      'iframe',
    ]);

    // Leftover non-authorable elements scattered in the source markup.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'source',
      'meta',
    ]);
  }
}
