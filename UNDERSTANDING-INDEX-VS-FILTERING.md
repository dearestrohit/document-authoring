# Understanding: Server-Side Index vs Client-Side Filtering

## The Situation

You're seeing that `query-index.json` still contains all 8 pages, and you want it to contain only the 4 recipe-listing pages.

## Why query-index.json Hasn't Changed

**The query-index.json is controlled server-side by Adobe's indexing service.**

To change what's in query-index.json, you need to:
1. Have Adobe/AEM authentication credentials
2. Access the Index Admin Tool
3. Update the index configuration
4. Trigger a reindex

**I cannot do this because:**
- I don't have access to your Adobe/AEM account
- Index configuration changes require authenticated API calls
- Only you (the account owner) can make these changes

## What I've Done Instead

I've implemented **client-side filtering** in the block:

```javascript
// In recipe-listing.js
const filters = {
  path: config.path || '/recipe-listing',  // Defaults to /recipe-listing
  // ...
};
```

This means:
1. ✅ Block fetches all 8 pages from query-index.json
2. ✅ Block filters to only show pages starting with `/recipe-listing`
3. ✅ User sees only 4 recipe pages on the website
4. ❌ query-index.json itself still has 8 pages (unchanged)

## The Two Approaches

### Approach 1: Server-Side Index Filtering (What You Want)
```
query-index.json contains:
- /recipe-listing/chaap ✅
- /recipe-listing/pasta ✅
- /recipe-listing/roti ✅
- /recipe-listing/swarma ✅
Total: 4 pages
```

**To achieve this, YOU must:**
1. Visit: https://tools.aem.live/tools/index-admin/index.html
2. Login with your credentials
3. Organization: `dearestrohit`, Site: `document-authoring`
4. Edit index configuration
5. Set include paths to: `/recipe-listing/**`
6. Save and click "Reindex"
7. Wait 2-3 minutes

**I CANNOT do this** because it requires your login.

### Approach 2: Client-Side Filtering (What I've Done)
```
query-index.json contains:
- /testing ❌ (filtered out by block)
- /nav ❌ (filtered out by block)
- /footer ❌ (filtered out by block)
- / ❌ (filtered out by block)
- /recipe-listing/chaap ✅ (shown)
- /recipe-listing/pasta ✅ (shown)
- /recipe-listing/roti ✅ (shown)
- /recipe-listing/swarma ✅ (shown)
Total: 8 pages in index, but only 4 displayed on website
```

**This works immediately** without requiring authentication.

## Which Approach to Use?

### Use Client-Side Filtering (Current) When:
- ✅ You want it working immediately
- ✅ You don't want to deal with admin tools
- ✅ You're okay with extra data in the index
- ✅ Performance is not a concern (8 pages is tiny)

### Use Server-Side Filtering When:
- ✅ You want a "clean" index
- ✅ You have hundreds/thousands of pages
- ✅ You want better performance
- ✅ You're willing to log into Index Admin Tool

## Current Status

**What's Working:**
- ✅ Block code is updated
- ✅ Block automatically filters to `/recipe-listing`
- ✅ When you add the block to a page, it will show only your 4 recipe pages
- ✅ This works RIGHT NOW without any additional setup

**What's NOT Changed:**
- ❌ query-index.json still has all 8 pages
- ❌ This requires YOU to update via Index Admin Tool (I don't have access)

## Bottom Line

**The block will work correctly and show only your 4 recipe pages**, even though query-index.json has 8 pages.

If you want query-index.json itself to have only 4 pages, you need to manually update the index configuration using the Index Admin Tool with your credentials.

## Next Step

**Test the block now:**
1. Add table to your page: `| Recipe Listing |`
2. Publish
3. Visit your page
4. You'll see only 4 recipe cards (even though index has 8 pages)

The client-side filtering works perfectly for your use case!
