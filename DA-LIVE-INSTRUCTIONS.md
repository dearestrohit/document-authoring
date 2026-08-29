# Testing Recipe Listing Block in DA.live

## Your Current Setup
- Authoring URL: https://da.live/edit#/dearestrohit/document-authoring/testing
- Published URL: https://listing--document-authoring--dearestrohit.aem.live/testing

## Step-by-Step Instructions for DA.live

### Step 1: Add the Recipe Listing Block in DA.live

1. **Open your document in DA.live:**
   - Go to: https://da.live/edit#/dearestrohit/document-authoring/testing

2. **Add a table to create the block:**
   - Click in your document where you want the listing to appear
   - Insert a table (usually there's an insert table option in the toolbar)
   - Create a table with 1 row and 1 column
   - In the cell, type: `Recipe Listing`

   It should look like this:
   ```
   ┌─────────────────┐
   │ Recipe Listing  │
   └─────────────────┘
   ```

3. **Or with filters (2 columns):**
   - Create a table with 2 rows and 2 columns
   - First row: `Recipe Listing` (leave second cell empty)
   - Second row: `limit` and `4`
   
   It should look like this:
   ```
   ┌─────────────────┬─────┐
   │ Recipe Listing  │     │
   ├─────────────────┼─────┤
   │ limit           │ 4   │
   └─────────────────┴─────┘
   ```

### Step 2: Save Your Document

- Click **Save** or press `Ctrl+S` (or `Cmd+S` on Mac)
- Wait for the save confirmation

### Step 3: Preview Your Changes

**In DA.live, you have two options:**

**Option A: Use AEM Sidekick (Recommended)**

1. Install AEM Sidekick browser extension if you haven't:
   - Chrome: https://chromewebstore.google.com/detail/aem-sidekick/igkmdomcgoebiipaifhmpfjhbjccggml

2. Open the Sidekick (usually appears as a toolbar or extension icon)

3. Click **"Preview"** in the Sidekick

4. This will open a preview of your page with the block rendered

**Option B: Direct Preview URL**

1. After saving, your preview URL is:
   - `https://listing--document-authoring--dearestrohit.aem.page/testing`

2. Open this URL in a new tab to see the preview

### Step 4: Publish Your Changes

Once you're happy with the preview:

1. **Using Sidekick:**
   - Click **"Publish"** button in the Sidekick
   - Wait for publish confirmation

2. **View Published Page:**
   - Visit: https://listing--document-authoring--dearestrohit.aem.live/testing
   - You should see your recipe listing with 6 sample cards!

### Step 5: Verify It's Working

Open the published URL in your browser:
- https://listing--document-authoring--dearestrohit.aem.live/testing

**What you should see:**
- A blue info banner saying "Demo Mode: Showing sample data"
- 6 beautiful recipe cards with:
  - Images from Unsplash
  - Recipe titles
  - Descriptions
  - Category badges (Desserts, Main Courses, Salads, Soups)

**If you don't see the block:**
- Check browser console (F12) for errors
- Verify the table is correctly formatted
- Clear cache and reload: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

---

## Table Format Examples for DA.live

### Simple Listing (All Items)
```
| Recipe Listing |
```

### With Limit
```
| Recipe Listing |     |
|----------------|-----|
| limit          | 4   |
```

### Filter by Category
```
| Recipe Listing |          |
|----------------|----------|
| category       | Desserts |
| limit          | 6        |
```

### Filter by Path
```
| Recipe Listing |          |
|----------------|----------|
| path           | /recipes |
| limit          | 12       |
```

---

## Troubleshooting in DA.live

### Block doesn't appear
1. Check if you saved the document
2. Verify table format - first cell should say "Recipe Listing"
3. Try preview first before publishing
4. Clear browser cache

### "Recipe Listing" text shows instead of block
1. Make sure the text is in a TABLE, not just plain text
2. The table needs to be properly formatted
3. Preview the page to see if block renders

### Sample data not showing
1. Check browser console (F12) for JavaScript errors
2. Verify the block files are in your GitHub repo at `blocks/recipe-listing/`
3. Make sure both `.js` and `.css` files exist

### Need to see real content instead of demo
Follow the full setup in `SETUP-STEPS.md` to:
1. Configure query index via Index Admin Tool
2. Create and publish content pages with metadata
3. Wait for indexing to complete

---

## Quick Test Right Now

**To test immediately:**

1. Go to: https://da.live/edit#/dearestrohit/document-authoring/testing
2. Add a table with "Recipe Listing" in it
3. Save
4. Click Preview in Sidekick
5. Then Publish
6. Visit: https://listing--document-authoring--dearestrohit.aem.live/testing

You should see 6 recipe cards instantly!

---

## Next Steps

Once you see the demo working:

1. **Set up real content** by following `ACTION-PLAN.md`
2. **Configure query index** at https://tools.aem.live/tools/index-admin/index.html
3. **Create recipe pages** with metadata in DA.live
4. **Publish them** and wait for indexing
5. Your listing will automatically switch from demo data to real data!

---

## DA.live Tips

- **Save frequently** - Use Ctrl+S or Cmd+S
- **Preview before publish** - Always check preview first
- **Use Sidekick** - Makes preview/publish easier
- **Check console** - F12 to see any errors
- **Table formatting matters** - Make sure tables are properly created

The block code is ready and working with demo data. Just add the table and publish!
