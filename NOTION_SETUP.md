# Notion Integration Setup

This project syncs vendor data from a Notion database. Follow these steps to set it up:

## Step 1: Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name it "Web3 Marketing Agencies" (or whatever you prefer)
4. Select your workspace
5. Copy the **Internal Integration Token** (starts with `ntn_`)

## Step 2: Get Your Database ID

1. Open your vendors database in Notion: https://greendots.notion.site/vendors
2. Click the "**...**" menu in the top right corner
3. Click "**Copy link**"
4. The URL will look like: `https://www.notion.so/workspace/DATABASE_ID?v=VIEW_ID`
5. Extract the **DATABASE_ID** (the long string of letters and numbers between the last `/` and the `?`)

### Example:
If your URL is:
```
https://www.notion.so/greendots/4a1b2c3d4e5f67890abcdef123456789?v=...
```

Your DATABASE_ID is: `4a1b2c3d4e5f67890abcdef123456789`

## Step 3: Share Database with Integration

1. Open your vendors database in Notion
2. Click the "**...**" menu in the top right
3. Scroll down and click "**Connections**" or "**Add connections**"
4. Find and select your integration from Step 1
5. Click "Confirm"

## Step 4: Configure Environment Variables

Create or update your `.env` file in the project root:

```bash
NOTION_API_TOKEN=ntn_your-integration-token-here
NOTION_DATABASE_ID=your-database-id-here
```

Replace `your-database-id-here` with the actual database ID from Step 2.

## Step 5: Sync Data

Run the sync command:

```bash
npm run sync
```

This will:
- Connect to your Notion database
- Fetch all vendor entries
- Parse the data into the correct format
- Update `src/data/vendors.js`

## Database Structure

Your Notion database should have these properties (column names can vary):

### Required Properties:
- **Name** (Title) - Agency name
- **Services** (Multi-select) - Service categories (e.g., "KOL marketing", "PR", "Content")
- **Ex Clients** (Rich text) - Comma-separated list of clients
- **Description** or **Commentary** (Rich text) - Agency description

### Optional Properties:
- **Status** (Select) - Vetted, First-Time, etc.
- **Discount Code** (Rich text) - Special offers
- **Website** (URL) - Agency website
- **Twitter** or **X** (URL) - Twitter/X profile
- **Email** (Rich text) - Contact email

## Commands

```bash
# Sync data from Notion
npm run sync

# Sync and start dev server
npm run dev

# Sync and build for production
npm run build
```

## Troubleshooting

### "❌ NOTION_DATABASE_ID not set!"
- Make sure you added the DATABASE_ID to your `.env` file
- The ID should be a UUID format (32 characters with hyphens)

### "❌ Could not authenticate"
- Verify your NOTION_API_TOKEN is correct
- Make sure you copied the full token (starts with `ntn_`)

### "❌ Database not found"
- Check that you shared the database with your integration (Step 3)
- Verify the DATABASE_ID is correct

### "❌ No vendors found"
- Make sure your database has at least one entry
- Check that the property names match (see Database Structure above)

## Deployment

When deploying to Vercel/Netlify/GitHub Pages:

1. Add environment variables in your deployment platform:
   - `NOTION_API_TOKEN`
   - `NOTION_DATABASE_ID`

2. The sync will run automatically during build

3. Your site will use the latest data from Notion

## Manual Sync

If you prefer to sync manually instead of on every build, update `package.json`:

```json
{
  "scripts": {
    "sync": "node scripts/sync-notion.js",
    "dev": "vite",
    "build": "vite build"
  }
}
```

Then run `npm run sync` whenever you want to update the data.
