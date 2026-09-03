export default function decorate(block) {
  const rows = [...block.children];
  // Row 1 = media (banner image), Row 2 = stacked slide content
  const mediaRow = rows[0];
  const textRow = rows[1];

  const picture = mediaRow ? mediaRow.querySelector('picture') : null;

  // Build the media column
  const media = document.createElement('div');
  media.className = 'hero-banner-media';
  if (picture) media.append(picture);

  // The captured slider stacked all headings first, then all paragraphs.
  // Pair them back together by index (heading[i] <-> paragraph[i]).
  const textCell = textRow ? (textRow.querySelector(':scope > div') || textRow) : null;
  const headings = textCell ? [...textCell.querySelectorAll('h1, h2, h3')] : [];
  const paras = textCell ? [...textCell.querySelectorAll('p')] : [];

  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  headings.forEach((heading, i) => {
    const item = document.createElement('div');
    item.className = i === 0 ? 'hero-banner-slide primary' : 'hero-banner-slide secondary';
    item.append(heading);
    if (paras[i]) item.append(paras[i]);
    content.append(item);
  });

  // Group de-emphasized "other slides" into a tidy block below the primary one
  const secondaries = [...content.querySelectorAll('.hero-banner-slide.secondary')];
  if (secondaries.length) {
    const more = document.createElement('div');
    more.className = 'hero-banner-more';
    secondaries.forEach((s) => more.append(s));
    content.append(more);
  }

  block.textContent = '';
  if (picture) block.append(media);
  block.append(content);

  if (!picture) block.classList.add('no-image');
}
