# Euro-Tools: Implementation Updates

## ✅ Confirmed Decisions (Updated 2026-09-12)

1. **Hosting**: Vercel deployment
2. **Currency**: USD only (no multi-currency conversion needed)
3. **Tool Return Process**: Representative-driven workflow
   - Representative logs condition in admin panel immediately upon tool receipt
   - Admin sees instant notification with refund amount pre-calculated
   - One-click refund approval (no searching for client info)
   - No client photo uploads (security risk - can be faked)
4. **Payment Integration**: Paymob only (handles both international + Egyptian payments)
   - Stripe removed from architecture
   - Paymob processes Visa/Mastercard from Europe + local Egyptian methods
5. **Chatbot Hosting**: Self-hosted on Vercel via Next.js API routes
6. **Deposit Deductions**: Admin approval required for each deduction

---

## 🔄 Updated Architecture

### Payment Flow (Paymob Only)
```
User selects payment → Paymob gateway (international cards + Egyptian methods)
→ Webhook confirms payment → Pre-auth hold for deposit → Order confirmed
```

### Representative Refund Workflow
```
Representative receives tool → Logs condition in mobile-friendly admin form
→ Admin dashboard shows:
  ┌─────────────────────────────────────────────┐
  │ Pending Refunds Queue                       │
  ├─────────────────────────────────────────────┤
  │ Order #RT-2401 | John Smith | +20-XXX-XXXX │
  │ Tool: Torque Wrench Model TX-500           │
  │ Deposit: $250 USD                           │
  │ Rep Note: "Minor scratches on handle"       │
  │ [Refund Full $250] [Deduct & Refund $___]  │
  └─────────────────────────────────────────────┘
```

---

## 📋 Updated Database Schema Changes

### Orders Table - Remove Client Photo Fields
```sql
-- REMOVE these fields:
-- delivery_photo_urls TEXT[]
-- return_photo_urls TEXT[]

-- KEEP representative notes:
inspection_notes TEXT
return_condition TEXT
```

### New: Refund Queue View (Admin Dashboard)
```sql
CREATE VIEW pending_refunds AS
SELECT 
  o.id,
  o.order_number,
  u.first_name || ' ' || u.last_name AS client_name,
  u.whatsapp_contact,
  o.insurance_deposit,
  o.inspection_notes,
  o.return_condition,
  o.return_date
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'returned' 
  AND o.deposit_status = 'held'
ORDER BY o.return_date DESC;
```

---

## 🔧 Environment Variables (Updated)

### Required Now:
```env
# Supabase (✅ Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://mmavupqyxxmmigsqznfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# DeepSeek AI (✅ Already configured)
DEEPSEEK_API_KEY=sk-b7d39019e1bf4379a949c47686d422f3

# Paymob (⏳ Waiting for colleague)
PAYMOB_API_KEY=your_paymob_key_here
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id

# Resend (📧 Recommended - get from resend.com)
RESEND_API_KEY=re_YOUR_KEY_HERE
```

### Removed:
```env
# ❌ NO LONGER NEEDED:
# STRIPE_SECRET_KEY
# STRIPE_PUBLISHABLE_KEY
# STRIPE_WEBHOOK_SECRET
# EXCHANGE_RATE_API_KEY
```

---

## 📄 Website Status - All Pages Created

### ✅ Public Pages:
- `/` - Homepage with hero, features, chatbot embed
- `/catalog` - Tool grid with search & filters
- `/catalog/[id]` - Tool detail page
- `/about` - About us
- `/pricing` - Pricing tiers
- `/delivery` - Delivery information
- `/contact` - Contact form
- `/help` - Help center
- `/kyc-guide` - KYC requirements guide
- `/terms` - Terms of service

### ✅ Auth Pages:
- `/auth/register` - User registration
- `/auth/login` - Login
- `/auth/kyc` - KYC document upload

### ✅ User Dashboard:
- `/dashboard` - User dashboard (orders, profile)
- `/dashboard/custom-requests/new` - Request custom tool
- `/custom-request` - Custom request form
- `/checkout` - Checkout flow

### ✅ Admin Dashboard:
- `/admin/dashboard` - Admin overview
- `/admin/tools` - Tool management
- `/admin/orders` - Order management
- `/admin/kyc-queue` - KYC verification queue
- `/admin/refunds` - **NEW: Quick refund approval interface**

---

## 🚀 Next Steps

### Immediate (Waiting on APIs):
1. **Get Paymob API keys** from colleague
2. **Get Resend API key** (optional but recommended for emails)

### Ready to Implement (Once APIs arrive):
1. Paymob payment integration (`/api/checkout/paymob-*`)
2. Email notifications via Resend
3. Admin refund queue interface
4. Representative mobile-friendly return logging

### Database Setup (Ready to Deploy):
1. Run Supabase migrations (see PLAN.md for full schema)
2. Create storage buckets:
   - `tool-images` (public)
   - `kyc-documents` (private)
3. Set up Row Level Security (RLS) policies

---

## 🎯 MVP Launch Checklist

- [✅] Frontend pages created
- [✅] Basic routing working
- [⏳] Paymob API keys
- [⏳] Resend API key
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] RLS policies enabled
- [ ] Payment integration tested
- [ ] Deploy to Vercel

---

## 📞 API Service Setup Guide

### 1. Paymob (CRITICAL - Waiting)
- Sign up at https://paymob.com
- Request "International Card Processing" during onboarding
- Get: API Key, Integration ID, iFrame ID

### 2. Resend (RECOMMENDED)
- Sign up at https://resend.com (free: 100 emails/day)
- Get API key (starts with `re_...`)
- Use for: order confirmations, KYC approvals, refund receipts

---

## 🔒 Security Notes

1. **No client photo uploads** - Eliminates fake evidence risk
2. **Representative authentication** - Admin panel has mobile-friendly auth
3. **Refund approval workflow** - All refunds require admin click
4. **USD only** - Simplifies compliance, no exchange rate manipulation
