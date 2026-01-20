# Deployment Guide

## 🎯 Step 1: Create Pull Request & Merge to Main

Your branch `claude/web3-flip-card-page-8axWv` is ready to merge!

### Create PR on GitHub:

Visit this URL to create the pull request:
```
https://github.com/Eli5DeFi/web3marketing/compare/main...claude/web3-flip-card-page-8axWv
```

Or:
1. Go to https://github.com/Eli5DeFi/web3marketing
2. Click the yellow "Compare & pull request" button for your branch
3. Review the changes
4. Click "Create pull request"
5. Click "Merge pull request"
6. Click "Confirm merge"

## 🚀 Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select `Eli5DeFi/web3marketing` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:notion`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NOTION_API_TOKEN=<your-notion-api-token-from-env-file>
   NOTION_DATABASE_ID=2e38c11d7aa78007b439faed6e7edbaa
   ```

   **Important:** Use the same `NOTION_API_TOKEN` value from your `.env` file

   Make sure to select "Production", "Preview", and "Development" for both variables.

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - Your site will be live at: `https://your-project-name.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Confirm settings
# - Add environment variables when prompted

# Deploy to production
vercel --prod
```

### Option C: GitHub Integration (Automatic)

1. Connect Vercel to your GitHub repo
2. Enable "Auto Deployment"
3. Every push to `main` will auto-deploy
4. Pull requests get preview deployments

## ⚙️ Vercel Configuration

Your project includes `vercel.json` with optimal settings:

```json
{
  "buildCommand": "npm run build:notion",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 🔄 Update Notion Data

### Before First Deployment:

**Important:** Share your Notion database with the integration first!

1. Open https://greendots.notion.site/vendors in Notion workspace
2. Click "..." → "Connections"
3. Add your integration
4. Click "Confirm"

Without this, the sync will fail during deployment.

### After Deployment:

To update agency data:
1. Edit your Notion database
2. Trigger a new deployment:
   - Push to main branch, OR
   - Click "Redeploy" in Vercel dashboard

## 🌐 Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate will be auto-generated

## 📊 What Happens During Deployment

1. **Install dependencies** (`npm install`)
2. **Sync Notion data** (`npm run sync`)
   - Connects to Notion API
   - Fetches all vendor entries
   - Updates `src/data/vendors.js`
   - Ensures Green Dots is first
3. **Build project** (`vite build`)
   - Compiles React components
   - Optimizes assets
   - Generates static files
4. **Deploy to CDN**
   - Global edge network
   - Automatic HTTPS
   - Instant cache invalidation

## ✅ Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All 92 agencies display
- [ ] Green Dots appears first with green theme
- [ ] Search works
- [ ] Service dropdown filters correctly
- [ ] Client dropdown filters correctly
- [ ] Cards flip on click
- [ ] Links work (website, Twitter)
- [ ] Responsive on mobile
- [ ] Usage guide displays at top

## 🐛 Troubleshooting

### Build Fails with "NOTION_DATABASE_ID not set"
- Add environment variables in Vercel dashboard
- Verify they're set for Production environment

### Build Fails with "Database not found"
- Share database with Notion integration
- Verify database ID is correct: `2e38c11d7aa78007b439faed6e7edbaa`

### No Agencies Showing
- Check Notion database has entries
- Verify sync ran successfully (check build logs)
- Try redeploying

### Stale Data
- Trigger new deployment to refresh
- Or change build command to always sync: `npm run build:notion`

## 📈 Performance Tips

**Already Optimized:**
- ✅ Code splitting enabled
- ✅ CSS minification
- ✅ Tree shaking
- ✅ Gzip compression
- ✅ Asset optimization

**Additional (Optional):**
- Enable Vercel Analytics
- Add caching headers
- Use Vercel Edge Functions for API routes

## 🎉 You're Done!

Once deployed:
1. Share the URL: `https://your-project-name.vercel.app`
2. Update agency data anytime in Notion
3. Redeploy to refresh the site
4. Monitor analytics in Vercel dashboard

---

**Your site is ready to showcase 92 Web3 marketing agencies to the world!** 🚀
