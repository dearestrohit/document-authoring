/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: homepage-specific hoist.
 * Moves authored default content that is nested inside the #YiPPeelicious
 * social block out to sibling position BEFORE block parsing, so it survives
 * (the cards-social parser replaces .socialmediacomp and would otherwise
 * destroy the title/subtitle/CTA).
 *
 * Runs in beforeTransform — before findBlocksOnPage captures element refs.
 *
 * Hoisted from .socialmediacomp:
 *  - "#YiPPeelicious" title (.cmp-social__title h2) -> before the block
 *  - subtitle paragraph (.cmp-social__sub-title p) -> before the block
 *  - "Join us" CTA (.socialButton a / .cmp-button) -> after the block
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const social = element.querySelector('.socialmediacomp');
  if (!social || !social.parentNode) return;
  const parent = social.parentNode;

  const title = social.querySelector('.cmp-social__title .cmp-title__text, .cmp-social__title h2');
  const subtitle = social.querySelector('.cmp-social__sub-title p, .cmp-social__sub-title .cmp-text');
  const cta = social.querySelector('.socialButton a, .cmp-button');

  // Title + subtitle -> before the social block (default content).
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.trim();
    parent.insertBefore(h, social);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent.trim();
    parent.insertBefore(p, social);
  }

  // Join Us CTA -> after the social block (keeps its instagram href).
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '#';
    a.textContent = (cta.textContent || 'Join us').trim();
    p.appendChild(a);
    if (social.nextSibling) parent.insertBefore(p, social.nextSibling);
    else parent.appendChild(p);
  }
}
