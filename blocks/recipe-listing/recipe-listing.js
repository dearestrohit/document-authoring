/**
 * Fetches the query index and filters items
 * @param {string} indexPath - Path to query index
 * @param {object} filters - Filters to apply
 * @returns {Promise<Array>} Filtered items
 */
async function fetchItems(indexPath = '/query-index.json', filters = {}) {
  try {
    const response = await fetch(indexPath);
    if (!response.ok) {
      // If index doesn't exist yet, return sample data for demo
      console.warn('Query index not found, using sample data');
      return getSampleData();
    }

    const json = await response.json();
    let items = json.data || [];

    // Apply path filter
    if (filters.path) {
      items = items.filter((item) => item.path.startsWith(filters.path));
    }

    // Apply category filter
    if (filters.category) {
      items = items.filter((item) => item.category?.toLowerCase() === filters.category.toLowerCase());
    }

    // Apply tag filter
    if (filters.tag) {
      items = items.filter((item) => {
        if (Array.isArray(item.tags)) {
          return item.tags.includes(filters.tag);
        }
        return item.tags?.includes(filters.tag);
      });
    }

    // Apply limit
    if (filters.limit) {
      items = items.slice(0, filters.limit);
    }

    // Sort by date (newest first) or lastModified
    items.sort((a, b) => {
      const dateA = new Date(a.date || a.lastModified || 0);
      const dateB = new Date(b.date || b.lastModified || 0);
      return dateB - dateA;
    });

    return items;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching items:', error);
    return getSampleData();
  }
}

/**
 * Returns sample data for demo purposes
 * @returns {Array} Sample items
 */
function getSampleData() {
  return [
    {
      path: '/recipes/chocolate-cake',
      title: 'Chocolate Cake Recipe',
      description: 'A rich and moist chocolate cake perfect for any occasion. Made with premium cocoa and topped with creamy frosting.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      category: 'Desserts',
      tags: ['chocolate', 'baking', 'cake'],
      date: '2026-08-25',
    },
    {
      path: '/recipes/pasta-carbonara',
      title: 'Classic Pasta Carbonara',
      description: 'Traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper. Simple yet elegant.',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
      category: 'Main Courses',
      tags: ['italian', 'pasta', 'quick'],
      date: '2026-08-24',
    },
    {
      path: '/recipes/greek-salad',
      title: 'Fresh Greek Salad',
      description: 'Crisp vegetables, feta cheese, and olives with a tangy lemon dressing. Healthy and delicious.',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      category: 'Salads',
      tags: ['healthy', 'vegetarian', 'mediterranean'],
      date: '2026-08-23',
    },
    {
      path: '/recipes/chicken-stir-fry',
      title: 'Asian Chicken Stir Fry',
      description: 'Quick and flavorful chicken with colorful vegetables in a savory sauce. Ready in 20 minutes.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      category: 'Main Courses',
      tags: ['asian', 'quick', 'chicken'],
      date: '2026-08-22',
    },
    {
      path: '/recipes/blueberry-muffins',
      title: 'Homemade Blueberry Muffins',
      description: 'Soft and fluffy muffins bursting with fresh blueberries. Perfect for breakfast or snack time.',
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop',
      category: 'Desserts',
      tags: ['baking', 'breakfast', 'blueberries'],
      date: '2026-08-21',
    },
    {
      path: '/recipes/tomato-soup',
      title: 'Creamy Tomato Soup',
      description: 'Smooth and comforting soup made with ripe tomatoes and a touch of cream. Serve with crusty bread.',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      category: 'Soups',
      tags: ['soup', 'comfort-food', 'vegetarian'],
      date: '2026-08-20',
    },
  ];
}

/**
 * Creates a card element for a list item
 * @param {object} item - Item data from query index
 * @returns {HTMLElement} Card element
 */
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'recipe-listing-card';

  const link = document.createElement('a');
  link.href = item.path;
  link.className = 'recipe-listing-card-link';

  // Image
  if (item.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'recipe-listing-card-image';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    imageDiv.appendChild(img);
    link.appendChild(imageDiv);
  }

  // Content
  const content = document.createElement('div');
  content.className = 'recipe-listing-card-body';

  // Category badge
  if (item.category) {
    const badge = document.createElement('span');
    badge.className = 'recipe-listing-card-category';
    badge.textContent = item.category;
    content.appendChild(badge);
  }

  // Title
  if (item.title) {
    const title = document.createElement('h3');
    title.textContent = item.title;
    content.appendChild(title);
  }

  // Description
  if (item.description) {
    const desc = document.createElement('p');
    desc.textContent = item.description;
    content.appendChild(desc);
  }

  link.appendChild(content);
  card.appendChild(link);

  return card;
}

/**
 * Decorates the recipe listing block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Parse configuration from block
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      config[key] = value;
    }
  });

  // Clear block
  block.innerHTML = '';

  // Show loading state
  const loadingMsg = document.createElement('p');
  loadingMsg.textContent = 'Loading items...';
  loadingMsg.style.textAlign = 'center';
  loadingMsg.style.padding = '2rem';
  block.appendChild(loadingMsg);

  // Prepare filters
  const filters = {
    path: config.path || '',
    category: config.category || '',
    tag: config.tag || '',
    limit: parseInt(config.limit || '0', 10) || undefined,
  };

  // Fetch and display items
  const items = await fetchItems(config.index || '/query-index.json', filters);

  block.innerHTML = '';

  if (items.length === 0) {
    const noResults = document.createElement('p');
    noResults.textContent = 'No items found.';
    noResults.style.textAlign = 'center';
    noResults.style.padding = '2rem';
    block.appendChild(noResults);
    return;
  }

  // Add info message if using sample data
  if (!config.index || config.index === '/query-index.json') {
    const infoMsg = document.createElement('div');
    infoMsg.className = 'recipe-listing-info';
    infoMsg.innerHTML = '<p><strong>Demo Mode:</strong> Showing sample data. Set up your query index to see your actual content.</p>';
    infoMsg.style.background = '#f0f7ff';
    infoMsg.style.border = '1px solid #0066cc';
    infoMsg.style.borderRadius = '4px';
    infoMsg.style.padding = '1rem';
    infoMsg.style.marginBottom = '2rem';
    infoMsg.style.textAlign = 'center';
    block.appendChild(infoMsg);
  }

  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'recipe-listing-grid';

  // Create cards
  items.forEach((item) => {
    const card = createCard(item);
    grid.appendChild(card);
  });

  block.appendChild(grid);
}
