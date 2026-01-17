# How to Get Your Notion Database ID

Your current URL `https://greendots.notion.site/vendors` is a **public page URL**, which doesn't show the database ID directly. Here's how to get it:

## Method 1: From Notion Workspace (Easiest)

1. **Open Notion** and log into your workspace (not the public page)
2. **Navigate to your vendors database** inside your workspace
3. Click the **"..."** (three dots) menu in the top right corner
4. Click **"Copy link"**
5. The link will look like:
   ```
   https://www.notion.so/workspace-name/1234567890abcdef1234567890abcdef?v=...
   ```
6. The database ID is the **32-character string** (no hyphens when copied):
   ```
   1234567890abcdef1234567890abcdef
   ```

## Method 2: Using the Helper Script

If you've shared the database with your integration, run:

```bash
node scripts/find-database.js
```

This will list all databases you have access to with their IDs.

## Method 3: From Browser Inspector

If you're viewing the public page:

1. Open `https://greendots.notion.site/vendors` in your browser
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Network** tab
4. Refresh the page
5. Look for requests to `api.notion.com`
6. Find requests with `/databases/` in the URL
7. The database ID will be in the URL like:
   ```
   https://api.notion.com/v1/databases/12345678-90ab-cdef-1234-567890abcdef
   ```

## Method 4: Check Page Source

1. Open the public page: `https://greendots.notion.site/vendors`
2. View page source (Ctrl+U or Right-click → View Page Source)
3. Search for `"database_id"` or `"block_id"`
4. Look for a UUID format like: `12345678-90ab-cdef-1234-567890abcdef`

## Format Notes

Database IDs can be in two formats:
- **With hyphens**: `12345678-90ab-cdef-1234-567890abcdef` (32 chars + 4 hyphens)
- **Without hyphens**: `1234567890abcdef1234567890abcdef` (32 chars)

Both formats work! Just copy it to your `.env` file:

```bash
NOTION_DATABASE_ID=1234567890abcdef1234567890abcdef
```

## Still Having Issues?

If you can't find the ID:

1. **Make sure you own the database** - You need edit access
2. **Check if it's a database** - Not just a page with a table
3. **Share with integration**:
   - Open the database in your workspace
   - Click "..." → "Connections"
   - Add your integration

Then try the helper script:
```bash
node scripts/find-database.js
```

## Quick Test

Once you have the ID in `.env`, test the connection:

```bash
npm run sync
```

If it works, you'll see:
```
✅ Found X vendors in Notion
🎉 Sync complete!
```
