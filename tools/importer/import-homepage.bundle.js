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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const allImages = Array.from(
      element.querySelectorAll('img.cmp-yippee-banner__item-image-img, img[class*="banner"], picture img, img')
    ).filter((img) => {
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc) img.setAttribute("src", dataSrc);
      const src = img.getAttribute("src") || "";
      return src && !/play-icon/i.test(img.className) && !src.startsWith("data:");
    });
    const bgImage = allImages[0] || null;
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    const seoHeading = element.querySelector(".cmp-yippee-banner__seo-h1 h2");
    if (seoHeading) contentCell.push(seoHeading);
    const slideTitles = Array.from(
      element.querySelectorAll(".cmp-yippee-banner__item-title h2, .cmp-yippee-banner__item-title")
    );
    const slideDescs = Array.from(
      element.querySelectorAll(".cmp-yippee-banner__item-desc, p.cmp-yippee-banner__item-desc")
    );
    slideTitles.forEach((t) => contentCell.push(t));
    slideDescs.forEach((d) => contentCell.push(d));
    if (contentCell.length === 0) {
      const heading = element.querySelector("h1, h2");
      if (heading) contentCell.push(heading);
      Array.from(element.querySelectorAll("p")).forEach((p) => contentCell.push(p));
    }
    if (contentCell.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-story.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const bgImage = element.querySelector(
      'img[class*="bg"], img[class*="background"], img[class*="noodle"], picture img, img'
    );
    if (bgImage) {
      const dataSrc = bgImage.getAttribute("data-src");
      if (dataSrc) bgImage.setAttribute("src", dataSrc);
      cells.push([bgImage]);
    }
    const contentCell = [];
    const titleParts = Array.from(element.querySelectorAll(".cmp-title__text")).map((el) => (el.textContent || "").trim()).filter(Boolean);
    if (titleParts.length) {
      const heading = document2.createElement("h2");
      heading.textContent = titleParts.join("");
      contentCell.push(heading);
    }
    const paragraphs = Array.from(element.querySelectorAll(".cmp-text p, p"));
    paragraphs.forEach((p) => contentCell.push(p));
    if (contentCell.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-recipe.js
  function parse3(element, { document: document2 }) {
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/recipe-listing.js
  function parse4(element, { document: document2 }) {
    const config = [
      ["index", "/query-index.json"],
      ["path", "/recipes"],
      ["limit", "5"]
    ];
    const cells = [];
    config.forEach(([key, value]) => {
      cells.push([key, value]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "recipe-listing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse5(element, { document: document2 }) {
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-social.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const imageLinks = Array.from(
      element.querySelectorAll(".cmp-social__card-column a, .cmp-social__card-container a")
    ).filter((a) => a.querySelector("img"));
    imageLinks.forEach((a) => {
      const img = a.querySelector("img");
      if (!img) return;
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc) img.setAttribute("src", dataSrc);
      const href = a.getAttribute("href") || "";
      const link = document2.createElement("a");
      link.setAttribute("href", href);
      link.textContent = href;
      cells.push([img, link]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sunfeastyippee-homepage-hoist.js
  function transform(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const social = element.querySelector(".socialmediacomp");
    if (!social || !social.parentNode) return;
    const parent = social.parentNode;
    const title = social.querySelector(".cmp-social__title .cmp-title__text, .cmp-social__title h2");
    const subtitle = social.querySelector(".cmp-social__sub-title p, .cmp-social__sub-title .cmp-text");
    const cta = social.querySelector(".socialButton a, .cmp-button");
    if (title) {
      const h = document.createElement("h2");
      h.textContent = title.textContent.trim();
      parent.insertBefore(h, social);
    }
    if (subtitle) {
      const p = document.createElement("p");
      p.textContent = subtitle.textContent.trim();
      parent.insertBefore(p, social);
    }
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.getAttribute("href") || "#";
      a.textContent = (cta.textContent || "Join us").trim();
      p.appendChild(a);
      if (social.nextSibling) parent.insertBefore(p, social.nextSibling);
      else parent.appendChild(p);
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "hero-story": parse2,
    "cards-recipe": parse3,
    "recipe-listing": parse4,
    "hero-promo": parse5,
    "cards-social": parse6
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Site homepage: hero banner slider, intro heading + brand text, product tabs, recipe carousel, DIY cards, and a #YiPPeelicious social grid.",
    urls: ["https://sunfeastyippee.com/"],
    blocks: [
      { name: "hero-banner", instances: ["#container-1859b8bd7b > .banneryippee", ".banneryippee:first-of-type"] },
      { name: "hero-story", instances: [".cmp-container--multiTitle"] },
      { name: "cards-recipe", instances: [".tabs", ".contenttile", ".diycard"] },
      { name: "recipe-listing", instances: [".recipetabwithcards"] },
      { name: "hero-promo", instances: ["#container-ac6f1289e4 .banneryippee"] },
      { name: "cards-social", instances: [".socialmediacomp"] }
    ],
    sections: [
      {
        id: "rc1",
        name: "Homepage main",
        selector: "body > div.root.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.container.responsivegrid.color-background-background-1.aem-GridColumn.aem-GridColumn--default--12",
        style: null,
        blocks: ["hero-banner", "hero-story", "cards-recipe", "recipe-listing", "hero-promo", "cards-social"],
        defaultContent: [".cmp-yippee-banner__seo-h1 h2", ".text .cmp-text h1"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
