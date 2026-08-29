# Dynamic Page Listing in EDS (Edge Delivery Services)

## Overview
In AEM, you use listing components (like Recipe Listing) to dynamically display pages. In EDS, you achieve the same functionality using the **Query Index** feature, which automatically indexes your published pages and makes them available as JSON data for client-side filtering and rendering.

## How It Works

### 1. Query Index System
- EDS automatically creates an index of all published pages
- The index is available as JSON at `/query-index.json` by default
- Properties are extracted from each page's HTML using CSS selectors
- You can filter and display this data dynamically in your blocks

### 2. Key Differences from AEM
| AEM | EDS |
|-----|-----|
| Server-side query (JCR) | Client-side fetch from JSON |
| Manual component configuration | Automatic indexing on publish |
| Template-based filtering | Path-based filtering |
| ResourceResolver | Fetch API |

## Implementation Steps

### Step 1: Configure Query Index (helix-query.yaml)

Create a `helix-query.yaml` file in your project root:

```yaml
version: 1

indices:
  default:
    include:
      - /**
    exclude:
      - /drafts/**
      - /fragments/**
    target: /query-index.json
    properties:
      # Basic page properties
      title:
        select: head > meta[property="og:title"]
        value: attribute(el, "content")
      
      description:
        select: head > meta[name="description"]
        value: attribute(el, "content")
      
      image:
        select: head > meta[property="og:image"]
        value: attribute(el, "content")
      
      # Recipe-specific properties
      category:
        select: head > meta[name="category"]
        value: attribute(el, "content")
      
      tags:
        select: head > meta[name="article:tag"]
        values: attribute(el, "content")
      
      author:
        select: head > meta[name="author"]
        value: attribute(el, "content")
      
      date:
        select: head > meta[name="publication-date"]
        value: attribute(el, "content")
      
      lastModified:
        select: none
        value: parseTimestamp(headers["last-modified"], "ddd, DD MMM YYYY hh:mm:ss GMT")
      
      # Custom recipe properties
      cookTime:
        select: head > meta[name="cook-time"]
        value: attribute(el, "content")
      
      difficulty:
        select: head > meta[name="difficulty"]
        value: attribute(el, "content")
      
      servings:
        select: head > meta[name="servings"]
        value: attribute(el, "content")

  # Separate index for recipes only
  recipes:
    include:
      - /recipes/**
    target: /recipes/query-index.json
    properties:
      title:
        select: head > meta[property="og:title"]
        value: attribute(el, "content")
      description:
        select: head > meta[name="description"]
        value: attribute(el, "content")
      image:
        select: head > meta[property="og:image"]
        value: attribute(el, "content")
      category:
        select: head > meta[name="category"]
        value: attribute(el, "content")
      cookTime:
        select: head > meta[name="cook-time"]
        value: attribute(el, "content")
      difficulty:
        select: head > meta[name="difficulty"]
        value: attribute(el, "content")
```

### Step 2: Set Up Index Using Admin Tools

1. Visit [Index Admin Tool](https://tools.aem.live/tools/index-admin/index.html)
2. Enter your organization and site
3. Add properties you want to index
4. Click "Save" and "Reindex"

### Step 3: Add Metadata to Your Pages

In your document metadata, add the properties you want indexed:

```
---
title: Chocolate Chip Cookies
description: Delicious homemade chocolate chip cookies
image: /recipes/media/cookies.jpg
category: Desserts
tags: baking, cookies, dessert, chocolate
author: John Smith
publication-date: 2026-08-15
cook-time: 30 minutes
difficulty: Easy
servings: 24 cookies
---
```

### Step 4: Create a Listing Block

Create `blocks/recipe-listing/recipe-listing.js`:

```javascript
/**
 * Fetches the query index and filters recipes
 * @param {string} indexPath - Path to query index
 * @param {object} filters - Filters to apply
 * @returns {Promise<Array>} Filtered recipes
 */
async function fetchRecipes(indexPath = '/recipes/query-index.json', filters = {}) {
  try {
    const response = await fetch(indexPath);
    if (!response.ok) throw new Error('Failed to fetch index');
    
    const json = await response.json();
    let recipes = json.data || [];
    
    // Apply filters
    if (filters.category) {
      recipes = recipes.filter(recipe => 
        recipe.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.difficulty) {
      recipes = recipes.filter(recipe => 
        recipe.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    
    if (filters.tag) {
      recipes = recipes.filter(recipe => 
        recipe.tags?.includes(filters.tag)
      );
    }
    
    if (filters.limit) {
      recipes = recipes.slice(0, filters.limit);
    }
    
    // Sort by date (newest first)
    recipes.sort((a, b) => {
      const dateA = new Date(a.date || a.lastModified || 0);
      const dateB = new Date(b.date || b.lastModified || 0);
      return dateB - dateA;
    });
    
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Creates a recipe card element
 * @param {object} recipe - Recipe data
 * @returns {HTMLElement} Recipe card
 */
function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  
  const link = document.createElement('a');
  link.href = recipe.path;
  link.className = 'recipe-card-link';
  
  // Image
  if (recipe.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'recipe-card-image';
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.title || '';
    img.loading = 'lazy';
    imageDiv.appendChild(img);
    link.appendChild(imageDiv);
  }
  
  // Content
  const content = document.createElement('div');
  content.className = 'recipe-card-body';
  
  // Category badge
  if (recipe.category) {
    const badge = document.createElement('span');
    badge.className = 'recipe-card-category';
    badge.textContent = recipe.category;
    content.appendChild(badge);
  }
  
  // Title
  if (recipe.title) {
    const title = document.createElement('h3');
    title.textContent = recipe.title;
    content.appendChild(title);
  }
  
  // Description
  if (recipe.description) {
    const desc = document.createElement('p');
    desc.textContent = recipe.description;
    content.appendChild(desc);
  }
  
  // Meta info (cook time, difficulty, servings)
  const meta = document.createElement('div');
  meta.className = 'recipe-card-meta';
  
  if (recipe.cookTime) {
    const time = document.createElement('span');
    time.innerHTML = `⏱️ ${recipe.cookTime}`;
    meta.appendChild(time);
  }
  
  if (recipe.difficulty) {
    const diff = document.createElement('span');
    diff.innerHTML = `📊 ${recipe.difficulty}`;
    meta.appendChild(diff);
  }
  
  if (recipe.servings) {
    const serv = document.createElement('span');
    serv.innerHTML = `🍽️ ${recipe.servings}`;
    meta.appendChild(serv);
  }
  
  if (meta.children.length > 0) {
    content.appendChild(meta);
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
  block.innerHTML = '<p>Loading recipes...</p>';
  
  // Prepare filters
  const filters = {
    category: config.category || '',
    difficulty: config.difficulty || '',
    tag: config.tag || '',
    limit: parseInt(config.limit || '0', 10) || undefined,
  };
  
  // Fetch and display recipes
  const recipes = await fetchRecipes(config.index || '/query-index.json', filters);
  
  block.innerHTML = '';
  
  if (recipes.length === 0) {
    block.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  
  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'recipe-listing-grid';
  
  // Create recipe cards
  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    grid.appendChild(card);
  });
  
  block.appendChild(grid);
}
```

Create `blocks/recipe-listing/recipe-listing.css`:

```css
.recipe-listing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.recipe-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.recipe-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.recipe-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.recipe-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-card-image img {
  transform: scale(1.05);
}

.recipe-card-body {
  padding: 1.5rem;
}

.recipe-card-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.75rem;
}

.recipe-card-body h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.recipe-card-body p {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #888;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.recipe-card-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .recipe-listing-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .recipe-listing-grid {
    grid-template-columns: 1fr;
  }
}
```

### Step 5: Author the Listing Block

In your document, add the recipe listing block:

```
| Recipe Listing |                    |
|----------------|---------------------|
| category       | Desserts           |
| limit          | 6                  |
```

Or for a simple listing without filters:

```
| Recipe Listing |
```

Or with custom index path:

```
| Recipe Listing |                          |
|----------------|--------------------------|
| index          | /recipes/query-index.json |
| difficulty     | Easy                     |
| limit          | 12                       |
```

## Advanced Examples

### Example 1: Filter by Multiple Tags

```javascript
// In your block's decorate function
if (filters.tags) {
  const tagList = filters.tags.split(',').map(t => t.trim());
  recipes = recipes.filter(recipe => 
    tagList.some(tag => recipe.tags?.includes(tag))
  );
}
```

### Example 2: Search Functionality

```javascript
function addSearchFilter(block, recipes) {
  const searchBox = document.createElement('input');
  searchBox.type = 'search';
  searchBox.placeholder = 'Search recipes...';
  searchBox.className = 'recipe-search';
  
  searchBox.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = recipes.filter(recipe => 
      recipe.title?.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query)
    );
    
    // Re-render results
    renderRecipes(block, filtered);
  });
  
  block.prepend(searchBox);
}
```

### Example 3: Pagination

```javascript
function addPagination(block, recipes, pageSize = 12) {
  let currentPage = 1;
  const totalPages = Math.ceil(recipes.length / pageSize);
  
  function showPage(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageRecipes = recipes.slice(start, end);
    renderRecipes(block, pageRecipes);
    
    // Update pagination controls
    updatePaginationControls(page, totalPages);
  }
  
  showPage(1);
}
```

## Best Practices

1. **Index Configuration**
   - Only index properties you need
   - Use specific CSS selectors for accuracy
   - Test selectors with `aem up --print-index`

2. **Performance**
   - Cache query index responses
   - Use limit parameter for large datasets
   - Implement lazy loading for images

3. **Filtering**
   - Do filtering client-side for better UX
   - Consider creating multiple specialized indices
   - Use path-based indices for large sites

4. **SEO**
   - Ensure recipe pages have proper metadata
   - Use semantic HTML in recipe cards
   - Include structured data (JSON-LD) on recipe pages

5. **Maintenance**
   - Reindex after changing helix-query.yaml
   - Monitor index size and performance
   - Document your custom properties

## Troubleshooting

### Index not updating
- Check if pages are published
- Verify helix-query.yaml configuration
- Use [Index Admin Tool](https://tools.aem.live/tools/index-admin/index.html) to reindex

### Properties not extracted
- Verify CSS selectors with browser dev tools
- Check HTML source (not DOM)
- Test with `aem up --print-index`

### Performance issues
- Reduce number of indexed properties
- Use path-based filtering in helix-query.yaml
- Implement client-side caching

## Comparison: AEM vs EDS

```javascript
// AEM (Server-side)
List<Page> recipes = pageManager.getPage("/content/site/recipes")
    .listChildren(new PageFilter()
        .withProperty("category", "Desserts")
        .withLimit(10));

// EDS (Client-side)
const response = await fetch('/query-index.json');
const recipes = response.data
    .filter(r => r.category === "Desserts")
    .slice(0, 10);
```

## Additional Resources

- [EDS Indexing Documentation](https://www.aem.live/developer/indexing)
- [Indexing Reference](https://www.aem.live/docs/indexing-reference)
- [Index Admin Tool](https://tools.aem.live/tools/index-admin/index.html)
- [Helix Query Configuration](https://github.com/adobe/helix-shared/blob/main/docs/indexconfig.md)
