# Notion Sync Complete Setup Guide

Your Notion database is now configured! Here's everything you need to know.

## ✅ What's Configured

**Database:** `greendots.notion.site/vendors`
**Database ID:** `2e38c11d7aa78007b439faed6e7edbaa`
**API Token:** Already set in `.env`

## 🚀 How to Sync Data

### Step 1: Share Database with Integration

Before syncing, you must share the database with your Notion integration:

1. Open the vendors database in your Notion workspace
2. Click the **"..."** menu (three dots) in the top right
3. Scroll to **"Connections"** or **"Add connections"**
4. Find and select your Notion integration
5. Click **"Confirm"**

**Important:** The database must be shared with the integration that has your API token (already configured in `.env`)

### Step 2: Run the Sync

Once the database is shared, run:

```bash
npm run sync
```

You should see:
```
🚀 Starting Notion sync...
📥 Fetching vendors from Notion database...
✅ Found XX vendors in Notion
🎉 Sync complete!
```

This will:
- Connect to your Notion database
- Fetch all vendor entries
- Parse the data
- Update `src/data/vendors.js`
- Preserve Green Dots as the first entry

### Step 3: Build & Deploy

After syncing, build your site:

```bash
npm run build
```

Or sync and build in one command:

```bash
npm run build:notion
```

## 📊 What Data Gets Synced

The script automatically maps Notion properties to the app format:

### Agency Information
- **Name** (Title) → Agency name
- **Services** (Multi-select) → Service categories
- **Ex Clients** (Text) → Comma-separated client list
- **Description/Commentary** (Text) → Agency description

### Contact Information
- **Website** (URL) → Website link
- **Twitter/X** (URL) → Twitter profile
- **Email** (Text) → Contact email

### Metadata
- **Status** (Select) → Vetted/First-Time
- **Code** (Text) → Special discount codes (if any)

## 🔄 Keeping Data Updated

### Manual Sync
Edit your Notion database and run:
```bash
npm run sync
```

### Automatic Sync (Deployment)
The sync can run automatically during deployment:

**Vercel/Netlify/GitHub Pages:**
1. Add environment variables in your deployment platform:
   ```
   NOTION_API_TOKEN=your-notion-api-token
   NOTION_DATABASE_ID=2e38c11d7aa78007b439faed6e7edbaa
   ```

   (Use the same token from your `.env` file)

2. Update build command to:
   ```
   npm run build:notion
   ```

3. Every deployment will fetch fresh data!

## 🛠️ Troubleshooting

### "Database not found" or "Unauthorized"
- ✅ Verify the database is shared with your integration
- ✅ Check that you're using the correct integration token
- ✅ Ensure the database ID is correct

### "No vendors found"
- ✅ Make sure your database has at least one entry
- ✅ Check that property names match (Name, Services, etc.)
- ✅ Verify the database is a database, not just a page

### "Network error" or "fetch failed"
- ✅ Check your internet connection
- ✅ Verify Notion API is accessible (not blocked by firewall)
- ✅ Try running with `--verbose` flag for more details

## 📝 Helper Commands

```bash
# Find all databases you have access to
npm run find-db

# Sync data from Notion
npm run sync

# Build with fresh Notion data
npm run build:notion

# Start dev server (uses existing data)
npm run dev
```

## 🎯 Database Structure in Notion

Your vendors database should have these columns:

**Required:**
- Name (Title type)
- Services (Multi-select type)
- Ex Clients (Text type)
- Description or Commentary (Text type)

**Optional:**
- Status (Select type)
- Website (URL type)
- Twitter or X (URL type)
- Email (Text type)
- Code (Text type)

The sync script is flexible and will try multiple property name variations!

## ✨ Features

✅ **Green Dots Always First** - Automatically sorted to top
✅ **Flexible Property Names** - Works with different column names
✅ **Error Handling** - Clear messages if something goes wrong
✅ **Data Validation** - Skips invalid entries
✅ **Client Parsing** - Automatically splits comma-separated clients
✅ **Status Mapping** - Preserves agency verification status

## 🔐 Security Note

- The `.env` file is gitignored - your token is safe
- Never commit `.env` to version control
- Use environment variables in deployment platforms
- Rotate tokens if compromised

## 📞 Need Help?

If sync isn't working:
1. Check the troubleshooting section above
2. Verify your Notion integration permissions
3. Ensure the database structure matches
4. Check console logs for specific errors

---

**You're all set!** Just share the database with your integration and run `npm run sync` 🚀
