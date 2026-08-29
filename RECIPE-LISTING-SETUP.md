# Recipe Listing Setup for Your Site

## ✅ Your Current Setup

I can see you have a `/recipe-listing` folder with 4 pages:
- chaap
- pasta
- roti
- swarma

The configuration has been updated to **only index pages from `/recipe-listing/**`**

## 📋 Step-by-Step Setup

### Step 1: Configure Query Index

1. Visit: https://tools.aem.live/tools/index-admin/index.html

2. Enter:
   - **Organization**: `dearestrohit`
   - **Site**: `document-authoring`

3. Click **"Add Index"**

4. Add these properties (one by one):
   - `title`
   - `description`
   - `image`
   - `category`
   - `tags`
   - `author`
   - `date`

5. Click **"Save"**

6. Click **"Reindex"**

### Step 2: Add Metadata to Your Recipe Pages

For each of your recipe pages (chaap, pasta, roti, swarma), add metadata at the top:

**Example for `/recipe-listing/chaap`:**

Open in DA.live and add metadata section at the top:

```
---
Title: Delicious Chaap Recipe
Description: Spicy and flavorful chaap recipe with authentic Indian spices
Image: [upload or link to image]
Category: Indian Cuisine
Tags: indian, vegetarian, spicy
Author: Your Name
Publication Date: 2026-08-29
---

# Delicious Chaap Recipe

[Your recipe content here...]
```

**Example for `/recipe-listing/pasta`:**

```
---
Title: Classic Pasta Recipe
Description: Italian pasta with rich tomato sauce
Image: [upload or link to image]
Category: Italian Cuisine
Tags: italian, pasta, quick
Author: Your Name
Publication Date: 2026-08-29
---

# Classic Pasta Recipe

[Your recipe content here...]
```

**Example for `/recipe-listing/roti`:**

```
---
Title: Homemade Roti
Description: Soft and fluffy Indian flatbread
Image: [upload or link to image]
Category: Indian Bread
Tags: indian, bread, vegetarian
Author: Your Name
Publication Date: 2026-08-29
---

# Homemade Roti

[Your recipe content here...]
```

**Example for `/recipe-listing/swarma`:**

```
---
Title: Swarma Recipe
Description: Middle Eastern swarma with tender meat and flavorful spices
Image: [upload or link to image]
Category: Middle Eastern
Tags: middle-eastern, meat, spicy
Author: Your Name
Publication Date: 2026-08-29
---

# Swarma Recipe

[Your recipe content here...]
```

### Step 3: Publish All Recipe Pages

1. Open each page in DA.live
2. Add the metadata (as shown above)
3. Save the page
4. Use AEM Sidekick to **Publish** each page
5. Wait 2-3 minutes for indexing

### Step 4: Add Recipe Listing Block to Your Page

1. Go to: https://da.live/edit#/dearestrohit/document-authoring/testing

2. Add a table:
   ```
   | Recipe Listing |          |
   |----------------|----------|
   | path           | /recipe-listing |
   ```

   This will show ONLY pages from `/recipe-listing` folder

3. Save and Publish

### Step 5: Test

1. Wait 2-3 minutes for indexing to complete

2. Check if index exists:
   - https://listing--document-authoring--dearestrohit.aem.page/query-index.json

3. Visit your page:
   - https://listing--document-authoring--dearestrohit.aem.live/testing

You should see your 4 recipe pages (chaap, pasta, roti, swarma) displayed as cards!

## 🎨 Configuration Options

### Show All Recipe Listing Pages
```
| Recipe Listing |
```

### Show Only 3 Items
```
| Recipe Listing |                |
|----------------|----------------|
| path           | /recipe-listing |
| limit          | 3              |
```

### Filter by Category
```
| Recipe Listing |                |
|----------------|----------------|
| path           | /recipe-listing |
| category       | Indian Cuisine |
```

### Filter by Tag
```
| Recipe Listing |                |
|----------------|----------------|
| path           | /recipe-listing |
| tag            | vegetarian     |
```

## 📊 What the helix-query.yaml Does

```yaml
include:
  - /recipe-listing/**  # Only index pages from /recipe-listing folder
```

This means:
- ✅ `/recipe-listing/chaap` - WILL be indexed
- ✅ `/recipe-listing/pasta` - WILL be indexed
- ✅ `/recipe-listing/roti` - WILL be indexed
- ✅ `/recipe-listing/swarma` - WILL be indexed
- ❌ `/testing` - will NOT be indexed
- ❌ Any other folder - will NOT be indexed

## 🔍 Checking Your Index

After setup, visit:
https://listing--document-authoring--dearestrohit.aem.page/query-index.json

You should see JSON with your 4 recipes:
```json
{
  "total": 4,
  "offset": 0,
  "limit": 4,
  "data": [
    {
      "path": "/recipe-listing/chaap",
      "title": "Delicious Chaap Recipe",
      "description": "...",
      "category": "Indian Cuisine",
      ...
    },
    {
      "path": "/recipe-listing/pasta",
      "title": "Classic Pasta Recipe",
      ...
    },
    ...
  ]
}
```

## 🚀 Demo Mode

Until you complete the setup, the block will show sample data with a blue banner saying "Demo Mode". 

Once your query index is set up and has data, it will automatically switch to showing your actual recipe pages!

## ✅ Checklist

- [ ] Configure query index at Index Admin Tool
- [ ] Add metadata to chaap page and publish
- [ ] Add metadata to pasta page and publish
- [ ] Add metadata to roti page and publish
- [ ] Add metadata to swarma page and publish
- [ ] Wait 2-3 minutes for indexing
- [ ] Check query-index.json exists
- [ ] Add recipe listing block to testing page
- [ ] Publish testing page
- [ ] Verify all 4 recipes show up

## 💡 Tips

- **Metadata is required** - Without metadata, pages won't have titles/images in the listing
- **Publish each page** - Pages must be published (not just saved) to appear in index
- **Wait for indexing** - After publishing, wait 2-3 minutes for the index to update
- **Category/Tags are optional** - But useful for filtering later

Your configuration is now set to only index the `/recipe-listing` folder!
