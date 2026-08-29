# Quick Setup Steps for Recipe Listing Block

## Current Status
✅ Block code created (`blocks/recipe-listing/`)
✅ Configuration file created (`helix-query.yaml`)
❌ Query index not set up yet
❌ Block not added to test page yet

## Step 1: Set Up Query Index

You need to configure the indexing system:

### Option A: Using Index Admin Tool (Recommended)
1. Visit: https://tools.aem.live/tools/index-admin/index.html
2. Enter:
   - **Organization**: `dearestrohit`
   - **Site**: `document-authoring`
3. Click **"Add Index"**
4. Configure properties:
   - Add `title`, `description`, `image`, `category`, `tags`, `author`, `date`
5. Click **"Save"**
6. Click **"Reindex"**

### Option B: Using Admin API
Alternatively, you can push the `helix-query.yaml` configuration via the Admin API.

## Step 2: Add Recipe Listing Block to Your Page

Edit your test page at `/testing` and add the recipe listing block:

### In Google Docs or SharePoint:
Add a table like this:

```
┌─────────────────┐
│ Recipe Listing  │
└─────────────────┘
```

Or with filters:

```
┌─────────────────┬───────────┐
│ Recipe Listing  │           │
├─────────────────┼───────────┤
│ limit           │ 10        │
└─────────────────┴───────────┘
```

Then **Preview** and **Publish** the page.

## Step 3: Create Sample Pages to List

Create some test pages with metadata to see them in the listing:

### Example Page 1: `/recipes/chocolate-cake`
```
Metadata:
---
title: Chocolate Cake Recipe
description: Delicious chocolate cake
category: Desserts
tags: chocolate, baking
---

Content:
# Chocolate Cake Recipe
Your recipe content here...
```

### Example Page 2: `/recipes/pasta`
```
Metadata:
---
title: Pasta Recipe
description: Classic Italian pasta
category: Main Courses
tags: italian, pasta
---

Content:
# Pasta Recipe
Your recipe content here...
```

**Important**: Publish all these pages for them to appear in the index.

## Step 4: Wait for Indexing

After publishing pages:
1. The indexing system runs automatically
2. Wait 1-2 minutes for index to build
3. Check if index exists: https://listing--document-authoring--dearestrohit.aem.page/query-index.json

## Step 5: Test Your Listing

Once the index exists, visit your test page:
https://listing--document-authoring--dearestrohit.aem.live/testing

You should see the recipe listing block displaying your published pages!

## Troubleshooting

### If query-index.json still returns 404:
- Verify you clicked "Reindex" in Index Admin Tool
- Make sure at least one page is published
- Wait a few minutes for the index to generate

### If the block shows "No items found":
- Check that pages have the required metadata (title, description, etc.)
- Verify the pages are published (not just saved as drafts)
- Check filter parameters match your page metadata

### If the block doesn't appear:
- Make sure you added the table to your document
- Preview and Publish the page
- Clear browser cache and reload

## Quick Test Without Setup

If you want to test the block immediately without creating pages, you can:

1. Modify the block to use a sample JSON:
   ```javascript
   // In recipe-listing.js, temporarily change:
   const items = await fetchItems(config.index || '/query-index.json', filters);
   
   // To use sample data:
   const items = [
     {
       path: '/test1',
       title: 'Test Recipe 1',
       description: 'Sample description',
       category: 'Desserts',
       image: 'https://via.placeholder.com/300x200'
     },
     {
       path: '/test2',
       title: 'Test Recipe 2',
       description: 'Another sample',
       category: 'Main Courses',
       image: 'https://via.placeholder.com/300x200'
     }
   ];
   ```

2. Test locally with `aem up`
3. Navigate to your page to see the block working with sample data

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify helix-query.yaml syntax
3. Use `aem up --print-index` to debug locally
4. Check the Log Viewer Tool: https://tools.aem.live/tools/log-viewer/index.html
