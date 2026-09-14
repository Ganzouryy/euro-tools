# Euro-Tools - Premium B2B Tool Rental Platform

Professional tool rental platform for European engineers and technicians working in Egypt.

## Setup Instructions

### 1. Database Setup (Supabase)

1. Go to your Supabase project: https://mmavupqyxxmmigsqznfs.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

### 2. Storage Buckets Setup

In Supabase Dashboard → Storage, create these buckets:

1. **tool-images** (Public)
   - Public access for tool catalog images
   
2. **kyc-documents** (Private)
   - Private bucket for identity verification documents
   - Enable RLS policies
   
3. **inspection-photos** (Private)
   - Private bucket for delivery/return inspection photos
   - Enable RLS policies

### 3. Environment Variables

Already configured in `.env.local`. Add your API keys:

- `DEEPSEEK_API_KEY` - For AI search and chatbot
- `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY` - For payments
- `PAYMOB_API_KEY` - For Egyptian local payments
- `RESEND_API_KEY` - For transactional emails
- `EXCHANGE_RATE_API_KEY` - (Optional) For currency conversion

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── catalog/           # Tool catalog
│   ├── checkout/          # Checkout flow
│   ├── dashboard/         # User dashboard
│   └── admin/             # Admin panel
├── components/            # React components
├── lib/                   # Utilities & services
├── types/                 # TypeScript types
└── supabase/             # Database schema
```

## Key Features

- ✅ AI-powered tool search (DeepSeek)
- ✅ Multi-currency support (USD base with real-time conversion)
- ✅ KYC verification workflow
- ✅ Stripe + Paymob payment integration
- ✅ Representative-driven return inspection
- ✅ Insurance deposit management
- ✅ Custom tool request system
- ✅ Multilingual AI chatbot (EN, DE, FR, IT, AR)

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Admin Access

To create the first admin user, manually update the `is_admin` field in the `users` table after registration.
