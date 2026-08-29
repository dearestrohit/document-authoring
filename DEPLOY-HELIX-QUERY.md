# Deploy helix-query.yaml to Enable Recipe Listing Index

## ✅ Configuration is Ready

The `helix-query.yaml` file is correctly configured to index only `/recipe-listing/**` pages.

## 📋 Steps to Deploy

### Step 1: Commit helix-query.yaml to GitHub

The `helix-query.yaml` file needs to be in your GitHub repository's **main branch**.

**If you have Git installed locally:**

```bash
# Navigate to your project directory
cd c:\EDS\document-authoring

# Add the helix-query.yaml file
git add helix-query.yaml

# Commit the file
git commit -m "Add helix-query.yaml to index only recipe-listing pages"

# Push to GitHub
git push origin main
```

**Or use GitHub web interface:**

1. Go to: https://github.com/dearestrohit/document-authoring
2. Click "Add file" → "Upload files"
3. Upload `helix-query.yaml` from your local folder
4. Commit directly to main branch

### Step 2: Verify File is in GitHub

Check that the file appears here:
https://github.com/dearestrohit/document-authoring/blob/main/helix-query.yaml

### Step 3: Trigger Reindexing

Once the file is committed to GitHub, trigger a reindex:

**Option A: Using Admin API**

```bash
curl -X POST https://admin.hlx.page/index/dearestrohit/document-authoring/main/*
```

**Option B: Using Index Admin Tool**

1. Visit: https://tools.aem.live/tools/index-admin/index.html?org=dearestrohit&site=document-authoring
2. The tool should detect your `helix-query.yaml` file
3. Click "Reindex"

### Step 4: Wait for Indexing

- Wait 2-3 minutes for the indexing to complete
- The system will read your `helix-query.yaml` configuration
- It will rebuild the index with only `/recipe-listing/**` pages

### Step 5: Verify the Index

Check the query index:
https://listing--document-authoring--dearestrohit.aem.page/query-index.json

**Before (8 pages):**
```json
{
  "total": 8,
  "data": [
    {"path": "/testing", ...},
    {"path": "/nav", ...},
    {"path": "/footer", ...},
    {"path": "/", ...},
    {"path": "/recipe-listing/chaap", ...},
    {"path": "/recipe-listing/pasta", ...},
    {"path": "/recipe-listing/roti", ...},
    {"path": "/recipe-listing/swarma", ...}
  ]
}
```

**After (4 pages):**
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

## 🎯 Test Your Recipe Listing Block

Once the index is updated:

1. Go to your testing page
2. Add the Recipe Listing block (if not already there):
   ```
   | Recipe Listing |
   ```
3. Save and Publish
4. Visit: https://listing--document-authoring--dearestrohit.aem.live/testing
5. You should see only your 4 recipe pages!

## 📊 What helix-query.yaml Does

```yaml
version: 1

indices:
  default:
    include:
      - /recipe-listing/**  # Only index pages from this folder
    target: /query-index.json
    properties:
      title: ...
      description: ...
      image: ...
      # etc.
```

This configuration tells the EDS indexing system:
- ✅ Index all pages under `/recipe-listing/`
- ❌ Exclude all other pages (/, /testing, /nav, /footer, etc.)
- 📄 Save the index to `/query-index.json`
- 🏷️ Extract specific properties (title, description, image, etc.)

## 🔍 Troubleshooting

### If index still shows 8 pages:

1. **Verify file is in GitHub main branch**
   - Check: https://github.com/dearestrohit/document-authoring/blob/main/helix-query.yaml

2. **Trigger reindex again**
   ```bash
   curl -X POST https://admin.hlx.page/index/dearestrohit/document-authoring/main/*
   ```

3. **Wait longer**
   - Sometimes indexing takes 5-10 minutes
   - Clear your browser cache

4. **Check for YAML syntax errors**
   - Make sure indentation is correct
   - No extra spaces or tabs

### If properties are missing:

1. **Add metadata to your recipe pages**
   - Each page needs metadata (Title, Description, Image, etc.)
   - See `RECIPE-LISTING-SETUP.md` for examples

2. **Publish the pages**
   - Pages must be published, not just saved

3. **Wait for reindex**
   - After adding metadata, trigger reindex again

## ✅ Success Checklist

- [ ] helix-query.yaml committed to GitHub main branch
- [ ] File visible at https://github.com/dearestrohit/document-authoring/blob/main/helix-query.yaml
- [ ] Reindex triggered via API or Index Admin Tool
- [ ] Waited 2-3 minutes
- [ ] query-index.json shows only 4 pages
- [ ] Recipe Listing block shows 4 recipe cards
- [ ] All recipe pages have proper metadata

## 🎉 Final Result

Once deployed, your query index will contain ONLY your recipe pages, and the Recipe Listing block will display them beautifully on your website!
