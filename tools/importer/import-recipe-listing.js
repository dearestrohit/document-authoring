/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import recipeListingParser from './parsers/recipe-listing.js';
import heroPromoParser from './parsers/hero-promo.js';
import cardsRecipeParser from './parsers/cards-recipe.js';

// TRANSFORMER IMPORTS
import hoistTransformer from './transformers/sunfeastyippee-hoist.js';
import cleanupTransformer from './transformers/sunfeastyippee-cleanup.js';
import dmImagesTransformer from './transformers/sunfeastyippee-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'recipe-listing': recipeListingParser,
  'hero-promo': heroPromoParser,
  'cards-recipe': cardsRecipeParser,
};

// TRANSFORMER REGISTRY
// hoist runs first (beforeTransform) so nested authored content is moved to
// sibling position before block discovery/parsing captures the containers.
const transformers = [
  hoistTransformer,
  cleanupTransformer,
  dmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'recipe-listing',
  description: 'Recipe listing page: intro heading, dynamic recipe card grid with filters and pagination, an orange promo band, a DIY recipe card set, and an auto-populated footer.',
  urls: [
    'https://sunfeastyippee.com/recipe-listing.html',
  ],
  blocks: [
    {
      name: 'recipe-listing',
      instances: ['.cmp-product-explore-listing'],
    },
    {
      name: 'hero-promo',
      instances: ['.cmp-product-explore-listing__extra-between-section.teaser'],
    },
    {
      name: 'cards-recipe',
      instances: ['.cmp-cards--yippee-diy'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Recipe listing main',
      selector: 'body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.responsivegrid.color-background-background-1.aem-GridColumn.aem-GridColumn--default--12',
      style: null,
      blocks: ['recipe-listing', 'hero-promo', 'cards-recipe'],
      defaultContent: [
        '.cmp-product-explore-listing__header-title',
        '.cmp-product-explore-listing__header-subTitle',
        '.cmp-cards__heading',
        '.cmp-cards__sub-heading',
      ],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
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

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. Execute afterTransform transformers (final cleanup + DM image anchors)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
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
