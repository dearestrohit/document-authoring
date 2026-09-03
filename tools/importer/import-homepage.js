/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import heroStoryParser from './parsers/hero-story.js';
import cardsRecipeParser from './parsers/cards-recipe.js';
import recipeListingParser from './parsers/recipe-listing.js';
import heroPromoParser from './parsers/hero-promo.js';
import cardsSocialParser from './parsers/cards-social.js';

// TRANSFORMER IMPORTS
import homepageHoistTransformer from './transformers/sunfeastyippee-homepage-hoist.js';
import cleanupTransformer from './transformers/sunfeastyippee-cleanup.js';
import dmImagesTransformer from './transformers/sunfeastyippee-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'hero-story': heroStoryParser,
  'cards-recipe': cardsRecipeParser,
  'recipe-listing': recipeListingParser,
  'hero-promo': heroPromoParser,
  'cards-social': cardsSocialParser,
};

// TRANSFORMER REGISTRY
// hoist runs first (beforeTransform) so nested authored content is moved to
// sibling position before block discovery/parsing captures the containers.
const transformers = [
  homepageHoistTransformer,
  cleanupTransformer,
  dmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Site homepage: hero banner slider, intro heading + brand text, product tabs, recipe carousel, DIY cards, and a #YiPPeelicious social grid.',
  urls: ['https://sunfeastyippee.com/'],
  blocks: [
    { name: 'hero-banner', instances: ['#container-1859b8bd7b > .banneryippee', '.banneryippee:first-of-type'] },
    { name: 'hero-story', instances: ['.cmp-container--multiTitle'] },
    { name: 'cards-recipe', instances: ['.tabs', '.contenttile', '.diycard'] },
    { name: 'recipe-listing', instances: ['.recipetabwithcards'] },
    { name: 'hero-promo', instances: ['#container-ac6f1289e4 .banneryippee'] },
    { name: 'cards-social', instances: ['.socialmediacomp'] },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Homepage main',
      selector: 'body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.responsivegrid.color-background-background-1.aem-GridColumn.aem-GridColumn--default--12',
      style: null,
      blocks: ['hero-banner', 'hero-story', 'cards-recipe', 'recipe-listing', 'hero-promo', 'cards-social'],
      defaultContent: ['.cmp-yippee-banner__seo-h1 h2', '.text .cmp-text h1'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * De-dupes elements matched by more than one selector (e.g. the two
 * hero-banner selectors both resolving to the same node).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (hoist nested default content)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (cleanup + DM image anchors)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Path (root -> /index)
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
