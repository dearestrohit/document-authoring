# How to Use the Recipe Listing Block

## Quick Start

### 1. Set Up Your Query Index

The `helix-query.yaml` file has been created in your project root. This configures what properties are indexed from your pages.

After making changes to this file:
1. Visit [Index Admin Tool](https://tools.aem.live/tools/index-admin/index.html)
2. Enter your organization and site
3. Click "Reindex"

### 2. Add Metadata to Your Pages

When authoring pages you want to list, add metadata like this:

```markdown
---
title: My Amazing Recipe
description: A delicious recipe everyone will love
image: /images/my-recipe.jpg
category: Desserts
tags: chocolate, baking, easy
author: Jane Doe
publication-date: 2026-08-29
---

# My Amazing Recipe

Your page content here...
```

### 3. Use the Recipe Listing Block

In your document where you want to display the listing, add a table:

#### Example 1: Simple Listing (All Items)
```
| Recipe Listing |
```

#### Example 2: Filter by Category
```
| Recipe Listing |           |
|----------------|-----------|
| category       | Desserts  |
| limit          | 6         |
```

#### Example 3: Filter by Path (e.g., only /recipes folder)
```
| Recipe Listing |           |
|----------------|-----------|
| path           | /recipes  |
| limit          | 12        |
```

#### Example 4: Filter by Tag
```
| Recipe Listing |           |
|----------------|-----------|
| tag            | chocolate |
| limit          | 9         |
```

#### Example 5: Custom Index Path
```
| Recipe Listing |                          |
|----------------|--------------------------|
| index          | /recipes/query-index.json |
| category       | Main Courses             |
```

## Available Configuration Options

| Parameter | Description | Example |
|-----------|-------------|---------|
| `index` | Path to query index JSON | `/query-index.json` |
| `path` | Filter by path prefix | `/recipes` |
| `category` | Filter by category | `Desserts` |
| `tag` | Filter by tag | `vegetarian` |
| `limit` | Maximum number of items | `12` |

## Testing Locally

1. Start your local development server:
```bash
aem up
```

2. Navigate to your page with the recipe listing block

3. The block will fetch from `/query-index.json` and display filtered results

## Debugging

### Check Your Index
Visit: `https://main--your-site--your-org.aem.page/query-index.json`

This shows all indexed pages and their properties.

### Print Index During Development
```bash
aem up --print-index
```

This will print the index data for each page you visit in the console.

### Common Issues

**Problem**: "No items found"
- Check that pages are published
- Verify metadata is present on pages
- Check filter parameters are correct

**Problem**: Index not updating
- Run reindex in Index Admin Tool
- Verify helix-query.yaml syntax
- Check that CSS selectors match your HTML

**Problem**: Images not showing
- Verify `image` metadata contains full path
- Check image URLs are accessible
- Ensure og:image meta tag exists

## Customizing the Block

### Modify Display
Edit `blocks/recipe-listing/recipe-listing.css` to change styling

### Add More Fields
1. Add property to `helix-query.yaml`
2. Update `createCard()` function in `blocks/recipe-listing/recipe-listing.js`
3. Add corresponding CSS

### Add Search Functionality
See the advanced examples in `EDS-DYNAMIC-LISTING-GUIDE.md`

## Next Steps

1. Publish some pages with proper metadata
2. Set up your query index via Index Admin Tool
3. Add a recipe listing block to a page
4. Test and refine filters as needed

For more detailed information, see `EDS-DYNAMIC-LISTING-GUIDE.md`
