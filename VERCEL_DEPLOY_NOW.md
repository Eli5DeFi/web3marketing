# 🚀 Deploy to Vercel NOW - Quick Guide

Your code is ready and pushed to GitHub main branch! Follow these steps to deploy:

## ✅ Step 1: Go to Vercel

Visit: **https://vercel.com**

Click **"Sign In"** and use your GitHub account.

## ✅ Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. In the "Import Git Repository" section, find: **`Eli5DeFi/web3marketing`**
3. Click **"Import"** next to it

## ✅ Step 3: Configure Build Settings

You'll see a configuration page. Set these EXACTLY:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build:notion
Output Directory: dist
Install Command: npm install
```

## ✅ Step 4: Add Environment Variables (CRITICAL!)

Click on **"Environment Variables"** section and add these TWO variables:

### Variable 1:
- **Name**: `NOTION_API_TOKEN`
- **Value**: `<use-your-notion-api-token-from-env-file>`
- **Environments**: Check ALL three boxes (Production, Preview, Development)
- **Note**: Get this from your `.env` file (starts with `ntn_`)

### Variable 2:
- **Name**: `NOTION_DATABASE_ID`
- **Value**: `2e38c11d7aa78007b439faed6e7edbaa`
- **Environments**: Check ALL three boxes (Production, Preview, Development)

## ✅ Step 5: Deploy!

1. Click the big **"Deploy"** button
2. Wait 1-2 minutes while Vercel:
   - Installs dependencies
   - Syncs data from Notion
   - Builds your project
   - Deploys to global CDN

## 🎉 Step 6: Your Site is Live!

Once deployment completes, Vercel will show you:
- ✅ Your live URL: `https://your-project-name.vercel.app`
- The deployment will have all 92+ agencies with logos
- All visual enhancements (blue glow, purple button, etc.)

## 🔄 Automatic Future Deployments

After this initial setup:
- Every push to `main` branch will auto-deploy
- Pull requests will get preview deployments
- You can manually redeploy from Vercel dashboard

## 📊 What Happens During Build

1. ✅ npm install (installs all dependencies)
2. ✅ npm run sync (fetches fresh data from Notion)
3. ✅ vite build (builds optimized production bundle)
4. ✅ Deploy to CDN (global edge network)

## ⚠️ IMPORTANT: Notion Database Sharing

Before the first deploy, make sure your Notion database is shared:

1. Open: https://greendots.notion.site/vendors
2. Click **"..."** menu → **"Connections"**
3. Add your Notion integration
4. Click **"Confirm"**

Without this, the build will fail with "Database not found" error.

## 🐛 Troubleshooting

### Build fails with "NOTION_API_TOKEN not set"
- Go to Vercel dashboard → Project Settings → Environment Variables
- Verify both variables are added
- Make sure "Production" is checked

### Build fails with "Database not found"
- Share the database with your Notion integration (see above)
- Verify the database ID is correct: `2e38c11d7aa78007b439faed6e7edbaa`

### No agencies showing on site
- Check build logs in Vercel dashboard
- Make sure sync ran successfully (look for "✅ Found XX vendors")
- Try redeploying

## 🎯 Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

**Ready to deploy? Go to https://vercel.com and follow the steps above!** 🚀
