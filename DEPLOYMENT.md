# Euro-Tools Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `euro-tools`
3. Description: `Premium B2B tool rental platform for European engineers in Egypt`
4. Set to **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, run these commands:

```bash
cd "C:\Users\moham\OneDrive\Desktop\GANZ\Euro-Tools"
git remote add origin https://github.com/YOUR_USERNAME/euro-tools.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `euro-tools` repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. **Add Environment Variables** (CRITICAL):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mmavupqyxxmmigsqznfs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYXZ1cHF5eHhtbWlnc3F6bmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMDM0MjQsImV4cCI6MjEwNDc3OTQyNH0.KaK4DntAM1xTMHC2JASTgVWz45nQHjX27wAtHRGXC60
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYXZ1cHF5eHhtbWlnc3F6bmZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIwMzQyNCwiZXhwIjoyMTA0Nzc5NDI0fQ.Rp3Mrbwd17A8m0xoiuX7OAYUe5I1a-loN4k7sedezlM
   DEEPSEEK_API_KEY=sk-b7d39019e1bf4379a949c47686d422f3
   PAYMOB_API_KEY=ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RJek56SXhMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuRnF0WHZxX0tjcEpjU0x6WDFHTW9KY2dPU0stMWRxbDRGb0JNRHIwWnZCaU9YelY0N0dQYU15aGNHZE4xY01FMVR3LXUzRDNLTkV5aHlOYnBnNXJOY2c=
   PAYMOB_PUBLIC_KEY=egy_pk_test_DcCOxK7yDjsPfKs0MTvxY38PcTHnZsbW
   PAYMOB_SECRET_KEY=egy_sk_test_6ab32edeb441faa5ab03754202a52b75867987f6b91e5ff57b86a8dcc40d7827
   PAYMOB_HMAC=EAB6BDFA9FC99FF1D0C1A23F8BF75BBC
   RESEND_API_KEY=re_P4GVJ1EQ_EgnYA24gvgr3Y6sqUfgg2vBP
   EXCHANGE_RATE_API_KEY=30371676e0055ec0a3baf41b
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

6. Click **Deploy**

### Option B: Deploy via Vercel CLI

Install Vercel CLI and deploy:

```bash
npm i -g vercel
cd "C:\Users\moham\OneDrive\Desktop\GANZ\Euro-Tools"
vercel
```

Follow the prompts and make sure to add all environment variables when asked.

## Step 4: Post-Deployment

1. **Update Supabase URL Whitelist**:
   - Go to your Supabase project settings
   - Add your Vercel domain to allowed origins

2. **Test the Chatbot**:
   - Visit your deployed site
   - Click the blue chat button in the bottom-right
   - Test a query like "What tools do you have for electrical work?"

3. **Update NEXT_PUBLIC_APP_URL**:
   - After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable in Vercel
   - Use your actual Vercel domain (e.g., `https://euro-tools.vercel.app`)

## What's Deployed

✅ Complete Euro-Tools platform with:
- AI-powered chatbot (DeepSeek integration)
- Homepage with trust indicators
- Catalog pages
- Authentication flow
- Admin dashboard
- KYC verification system
- Checkout with Paymob test credentials
- Custom tool request system

## Next Steps

1. Test all features on the live site
2. Add production Stripe credentials when ready
3. Upgrade Paymob from test to live keys when approved
4. Add custom domain in Vercel settings (optional)

---

**Need help?** Let me know which step you're on!
