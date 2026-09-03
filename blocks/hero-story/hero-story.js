export default function decorate(block) {
  // The source band uses a CSS background image, so authored content has no picture.
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Approximate the source's multi-color trailing-letters headline: split the
  // heading text into four roughly equal segments, each with its own color.
  const heading = block.querySelector('h1, h2, h3');
  if (heading && !heading.querySelector('span')) {
    const text = heading.textContent;
    const parts = 4;
    const size = Math.ceil(text.length / parts);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < parts; i += 1) {
      const chunk = text.slice(i * size, (i + 1) * size);
      if (!chunk) break;
      const span = document.createElement('span');
      span.className = `letter-${i + 1}`;
      span.textContent = chunk;
      frag.append(span);
    }
    heading.textContent = '';
    heading.append(frag);
  }
}
