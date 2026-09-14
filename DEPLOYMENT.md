# Euro-Tools Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- GitHub account
- Vercel account (sign up at https://vercel.com)
- All API keys ready (Supabase, DeepSeek, Paymob, Resend, etc.)

---

## Step 1: Push to GitHub

The project is already configured with the GitHub repository:
- Repository: `https://github.com/Ganzouryy/euro-tools.git`
- Branch: `main`

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `Ganzouryy/euro-tools` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables** (CRITICAL):

   Click "Environment Variables" and add each of these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
   DEEPSEEK_API_KEY=<your_deepseek_api_key>
   PAYMOB_API_KEY=<your_paymob_api_key>
   PAYMOB_PUBLIC_KEY=<your_paymob_public_key>
   PAYMOB_SECRET_KEY=<your_paymob_secret_key>
   PAYMOB_HMAC=<your_paymob_hmac>
   RESEND_API_KEY=<your_resend_api_key>
   EXCHANGE_RATE_API_KEY=<your_exchange_rate_api_key>
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

   Replace all placeholder values with your actual API keys from `.env.local`

6. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
cd "C:\Users\moham\OneDrive\Desktop\GANZ\Euro-Tools"
vercel
```

Follow the prompts and add environment variables when asked.

---

## Step 3: Configure Supabase

After deployment, you need to set up the database schema:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL schema from [PLAN.md](PLAN.md) to create all tables
4. Create storage buckets:
   - `tool-images` (public)
   - `kyc-documents` (private)
5. Enable Row Level Security policies

---

## Step 4: Test the Deployment

Once deployed, test these critical flows:

1. **Homepage**: Verify AI chatbot loads and responds
2. **Catalog**: Browse tools and search functionality
3. **Authentication**: Register and login
4. **Checkout**: Test the payment flow (demo mode)
5. **Admin**: Access admin dashboard

---

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database schema deployed
- [ ] Storage buckets created
- [ ] Test user registration flow
- [ ] Test tool browsing
- [ ] Test AI chatbot
- [ ] Test checkout flow
- [ ] Verify admin dashboard access
- [ ] Check mobile responsiveness

---

## Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Node.js version compatibility (16.x or higher)
- Review build logs in Vercel dashboard

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check RLS policies are configured
- Ensure database schema is deployed

### Payment Integration Issues
- Verify Paymob credentials are correct
- Check webhook endpoints are configured
- Test in demo mode first

---

## Support

For issues or questions:
- Review [STATUS.md](STATUS.md) for project status
- Check [AUDIT_REPORT.md](AUDIT_REPORT.md) for known issues
- Open an issue on GitHub

---

## Security Notes

- Never commit `.env.local` to git
- Rotate API keys if accidentally exposed
- Use Vercel's environment variable encryption
- Enable Vercel's password protection for staging deployments
