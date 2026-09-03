import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-social-card-image';
      else div.className = 'cards-social-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* each card is an image that links to Instagram (matching source); drop the raw URL text */
  ul.querySelectorAll('li').forEach((li) => {
    const imageCell = li.querySelector('.cards-social-card-image');
    const bodyCell = li.querySelector('.cards-social-card-body');
    const picture = imageCell?.querySelector('picture');
    const link = bodyCell?.querySelector('a');
    if (imageCell && picture && link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.className = 'cards-social-card-link';
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener');
      anchor.setAttribute('aria-label', 'View on Instagram');
      anchor.append(picture);
      imageCell.textContent = '';
      imageCell.append(anchor);
    }
    if (bodyCell) bodyCell.remove();
  });

  block.textContent = '';
  block.append(ul);
}
