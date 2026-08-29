# Fix Index to Show Only Recipe-Listing Pages

## Current Problem
Your query index currently shows ALL pages:
- `/testing` ❌
- `/nav` ❌
- `/footer` ❌
- `/` ❌
- `/recipe-listing/chaap` ✅
- `/recipe-listing/swarma` ✅
- `/recipe-listing/pasta` ✅
- `/recipe-listing/roti` ✅

**We need to filter out everything except `/recipe-listing/**` pages.**

## Solution: Update Index Configuration

### Option 1: Using Index Admin Tool (Recommended)

1. **Open Index Admin Tool:**
   - Visit: https://tools.aem.live/tools/index-admin/index.html

2. **Connect to Your Site:**
   - Organization: `dearestrohit`
   - Site: `document-authoring`

3. **Edit the Index Configuration:**
   - Click on your existing index
   - Look for "Included Paths" or "Include" section
   - **Change it to:** `/recipe-listing/**`
   - Or if there's an "Excluded Paths" section, add:
     - `/testing`
     - `/nav`
     - `/footer`
     - `/`

4. **Save the Configuration**

5. **Click "Reindex":**
   - This will rebuild the index with only `/recipe-listing` pages
   - Wait 2-3 minutes

6. **Verify:**
   - Check: https://listing--document-authoring--dearestrohit.aem.live/query-index.json
   - Should now show only 4 items (chaap, pasta, roti, swarma)

### Option 2: Using Admin API

If the Index Admin Tool doesn't have UI for include/exclude paths, you can use the Admin API:

**Update Index Configuration:**

```bash
curl -X POST \
  'https://admin.hlx.page/config/dearestrohit/document-authoring/main.json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "indices": {
      "default": {
        "include": ["/recipe-listing/**"],
        "target": "/query-index.json"
      }
    }
  }'
```

**Then trigger reindex:**

```bash
curl -X POST \
  'https://admin.hlx.page/index/dearestrohit/document-authoring/main/*'
```

### Option 3: Client-Side Filtering (Temporary Workaround)

If you can't update the index configuration right now, update the block to filter client-side:

The block already has path filtering built-in! Just use it in your document:

```
| Recipe Listing |                |
|----------------|----------------|
| path           | /recipe-listing |
```

This will filter the results to show only pages that start with `/recipe-listing`.

## Testing the Fix

After updating and reindexing:

1. **Check the Index:**
   ```
   https://listing--document-authoring--dearestrohit.aem.live/query-index.json
   ```
   
   Should return:
   ```json
   {
     "total": 4,
     "data": [
       {"path": "/recipe-listing/chaap", ...},
       {"path": "/recipe-listing/pasta", ...},
       {"path": "/recipe-listing/roti", ...},
       {"path": "/recipe-listing/swarma", ...}
     ]
   }
   ```

2. **Test Your Page:**
   - Visit: https://listing--document-authoring--dearestrohit.aem.live/testing
   - Should show only your 4 recipe pages

## Quick Fix - Use Path Filter Now

**While waiting for index configuration update, add this to your block:**

In your `/testing` page in DA.live, change the table to:

```
| Recipe Listing |                |
|----------------|----------------|
| path           | /recipe-listing |
```

This will immediately filter out `/testing`, `/nav`, `/footer`, and `/` from the results, showing only your recipe pages!

## Understanding the Configuration

The `helix-query.yaml` file in your repository is a **template/reference**.

To actually change what gets indexed, you need to:
1. Configure via Index Admin Tool, OR
2. Push config via Admin API, OR
3. Use client-side path filtering (as shown above)

## Recommended Approach

**For immediate results:**
- Use path filter: `| path | /recipe-listing |` in your block table

**For long-term solution:**
- Update index configuration in Index Admin Tool
- Set include path to `/recipe-listing/**`
- Reindex
- Remove path filter from block (or keep it for extra safety)

The path filter in the block will work immediately without waiting for reindex!
