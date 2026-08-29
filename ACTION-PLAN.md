# Action Plan: Getting Your Recipe Listing Working

## ✅ What I've Done For You

1. **Created the Recipe Listing Block** 
   - `blocks/recipe-listing/recipe-listing.js` - Now includes demo mode with sample data
   - `blocks/recipe-listing/recipe-listing.css` - Beautiful responsive styling
   
2. **Added Demo Mode**
   - The block will automatically show 6 sample recipes if query index doesn't exist
   - You can test it immediately!

3. **Created Configuration Files**
   - `helix-query.yaml` - Ready to use index configuration
   - Complete documentation in `EDS-DYNAMIC-LISTING-GUIDE.md`

## 🎯 What You Need to Do Next

### Option A: Test Demo Mode Immediately (5 minutes)

**Step 1:** Edit your test page `/testing` in Google Docs or SharePoint

**Step 2:** Add this table to the page:

```
┌─────────────────┐
│ Recipe Listing  │
└─────────────────┘
```

Or to test with a limit:

```
┌─────────────────┬─────┐
│ Recipe Listing  │     │
├─────────────────┼─────┤
│ limit           │ 4   │
└─────────────────┴─────┘
```

**Step 3:** Click "Preview" to see it in the Sidekick

**Step 4:** If it looks good, click "Publish"

**Step 5:** Visit your page:
- https://listing--document-authoring--dearestrohit.aem.live/testing

You should see 6 (or 4 if you set limit) beautiful recipe cards with images from Unsplash!

---

### Option B: Set Up Full Production Mode (30 minutes)

This requires 3 manual steps that only you can complete:

#### 1. Configure Query Index (Admin Access Required)

**You must do this manually because it requires authentication:**

1. Open: https://tools.aem.live/tools/index-admin/index.html
2. Enter:
   - Organization: `dearestrohit`
   - Site: `document-authoring`
3. Click **"Add Index"**
4. In the Properties section, add these properties one by one:
   - `title` 
   - `description`
   - `image`
   - `category`
   - `tags`
   - `author`
   - `date`
5. Click **"Save"**
6. Click **"Reindex"**

#### 2. Create Sample Content Pages

**You need to create at least 2-3 test pages with metadata:**

Create a page at `/recipes/chocolate-cake`:
```
Metadata:
---
Title: Chocolate Cake Recipe
Description: Delicious chocolate cake
Image: (upload an image or use a URL)
Category: Desserts
Tags: chocolate, baking
Author: Your Name
Publication Date: 2026-08-29
---

# Chocolate Cake Recipe

Ingredients:
- 2 cups flour
- 1 cup sugar
...

Instructions:
1. Preheat oven to 350°F
2. Mix dry ingredients
...
```

Create another page at `/recipes/pasta`:
```
Metadata:
---
Title: Pasta Recipe  
Description: Classic Italian pasta
Image: (upload an image)
Category: Main Courses
Tags: italian, pasta
---

# Pasta Recipe

Your content here...
```

**Important:** PUBLISH each page after creating it!

#### 3. Add Block to Your Page

Same as Option A - add the Recipe Listing table to `/testing` and publish.

#### 4. Wait & Test

- Wait 2-3 minutes for indexing to complete
- Check if index exists: https://listing--document-authoring--dearestrohit.aem.page/query-index.json
- Visit your test page: https://listing--document-authoring--dearestrohit.aem.live/testing
- You should now see your actual published pages!

---

## 🎨 Customization Examples

Once it's working, you can customize by editing the table in your document:

### Filter by Category
```
┌─────────────────┬─────────────┐
│ Recipe Listing  │             │
├─────────────────┼─────────────┤
│ category        │ Desserts    │
│ limit           │ 6           │
└─────────────────┴─────────────┘
```

### Filter by Path
```
┌─────────────────┬───────────┐
│ Recipe Listing  │           │
├─────────────────┼───────────┤
│ path            │ /recipes  │
│ limit           │ 12        │
└─────────────────┴───────────┘
```

### Filter by Tag
```
┌─────────────────┬────────────┐
│ Recipe Listing  │            │
├─────────────────┼────────────┤
│ tag             │ vegetarian │
│ limit           │ 8          │
└─────────────────┴────────────┘
```

---

## ❓ Why Can't I Do These Steps For You?

1. **Index Admin Tool** - Requires your Adobe authentication
2. **Content Creation** - Needs access to your Google Docs/SharePoint
3. **Publishing** - Only you can publish content to your site

But I've made it as easy as possible - the code is ready and will work immediately with demo data!

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console for errors (F12 in browser)
2. Verify the table is correctly formatted in your document
3. Make sure you clicked "Preview" and then "Publish"
4. Clear browser cache and try again

The demo mode means you can see it working RIGHT NOW without any setup. Just add the table to your page and publish!
