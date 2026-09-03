/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-recipe-listing.js
  var import_recipe_listing_exports = {};
  __export(import_recipe_listing_exports, {
    default: () => import_recipe_listing_default
  });

  // tools/importer/parsers/recipe-listing.js
  function parse(element, { document }) {
    const config = [
      ["index", "/query-index.json"],
      ["path", "/recipes"],
      ["limit", "5"]
    ];
    const cells = [];
    config.forEach(([key, value]) => {
      cells.push([key, value]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "recipe-listing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse2(element, { document }) {
    const heading = element.querySelector('.cmp-title__text, h1, h2, h3, [class*="title"]');
    const description = element.querySelector(".cmp-text p, p");
    const cta = element.querySelector('a.cmp-button, a[class*="button"], .cmp-button a, a');
    const bgImage = element.querySelector('img[class*="background"], img[class*="bg"], picture img, img');
    if (!heading && !description && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-recipe.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".cmp-card--yippee-diy"));
    const cells = [];
    cards.forEach((card) => {
      const media = card.querySelector(".cmp-card__media") || card;
      let image = media.querySelector("img.cmp-card__img") || media.querySelector('a[href*="scene7"], a[href*="itcportalprod"]') || media.querySelector("img:not(.play-icon)");
      const title = card.querySelector(".cmp-card__title, h2, h3");
      if (!image && !title) return;
      cells.push([image || "", title || ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sunfeastyippee-hoist.js
  function transform(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const listing = element.querySelector(".cmp-product-explore-listing");
    if (listing && listing.parentNode) {
      const parent = listing.parentNode;
      const title = listing.querySelector(".cmp-product-explore-listing__header-title");
      const subtitle = listing.querySelector(".cmp-product-explore-listing__header-subTitle");
      const teaser = listing.querySelector(".cmp-product-explore-listing__extra-between-section.teaser");
      if (title) parent.insertBefore(title, listing);
      if (subtitle) parent.insertBefore(subtitle, listing);
      if (teaser) {
        if (listing.nextSibling) parent.insertBefore(teaser, listing.nextSibling);
        else parent.appendChild(teaser);
      }
    }
    const diy = element.querySelector(".cmp-cards--yippee-diy");
    if (diy && diy.parentNode) {
      const parent = diy.parentNode;
      const heading = diy.querySelector(".cmp-cards__heading");
      const subheading = diy.querySelector(".cmp-cards__sub-heading");
      if (heading) parent.insertBefore(heading, diy);
      if (subheading) parent.insertBefore(subheading, diy);
    }
  }

  // tools/importer/transformers/sunfeastyippee-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        ".experiencefragment",
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "source",
        "meta"
      ]);
    }
  }

  // tools/importer/transformers/sunfeastyippee-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-recipe-listing.js
  var parsers = {
    "recipe-listing": parse,
    "hero-promo": parse2,
    "cards-recipe": parse3
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "recipe-listing",
    description: "Recipe listing page: intro heading, dynamic recipe card grid with filters and pagination, an orange promo band, a DIY recipe card set, and an auto-populated footer.",
    urls: [
      "https://sunfeastyippee.com/recipe-listing.html"
    ],
    blocks: [
      {
        name: "recipe-listing",
        instances: [".cmp-product-explore-listing"]
      },
      {
        name: "hero-promo",
        instances: [".cmp-product-explore-listing__extra-between-section.teaser"]
      },
      {
        name: "cards-recipe",
        instances: [".cmp-cards--yippee-diy"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Recipe listing main",
        selector: "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.responsivegrid.color-background-background-1.aem-GridColumn.aem-GridColumn--default--12",
        style: null,
        blocks: ["recipe-listing", "hero-promo", "cards-recipe"],
        defaultContent: [
          ".cmp-product-explore-listing__header-title",
          ".cmp-product-explore-listing__header-subTitle",
          ".cmp-cards__heading",
          ".cmp-cards__sub-heading"
        ]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_recipe_listing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_recipe_listing_exports);
})();
