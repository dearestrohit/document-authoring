/**
 * Loads and decorates the footer.
 * Content-first: all copy/links/images live in content/footer.plain.html.
 * This module fetches that fragment and assigns structural classes only.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost / aem up),
  // then root (DA/EDS production, where the fragment is served at site root).
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;

  // The fragment is a flat list of top-level section <div>s:
  //   0: brand logo | 1: primary links | 2: secondary links | 3: bottom strip
  const sections = [...container.children].filter((el) => el.tagName === 'DIV');

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // Top band: logo + link columns
  const topBand = document.createElement('div');
  topBand.className = 'footer-top';

  // Bottom strip: ITC portal + copyright + social
  const bottomStrip = document.createElement('div');
  bottomStrip.className = 'footer-bottom';

  sections.forEach((section, i) => {
    if (i === 0) {
      section.className = 'footer-brand';
      topBand.append(section);
    } else if (section.querySelector('ul')) {
      section.className = 'footer-links';
      topBand.append(section);
    } else {
      // bottom strip section: tag ITC / copyright / social rows
      section.className = 'footer-legal';
      const paras = [...section.querySelectorAll('p')];
      paras.forEach((p) => {
        if (p.querySelector('a img')) p.className = 'footer-social';
        else if (/all rights reserved/i.test(p.textContent)) p.className = 'footer-copyright';
        else p.className = 'footer-itc';
      });
      bottomStrip.append(section);
    }
  });

  footer.append(topBand, bottomStrip);
  block.textContent = '';
  block.append(footer);
}
