# Euro-Tools: Premium B2B Tool Rental Platform – Implementation Plan

## Executive Summary
Euro-Tools is a premium B2B SaaS platform enabling European engineers and technicians to rent professional tools in Egypt without excess baggage hassles. The platform combines intelligent search, KYC compliance, deposit-backed insurance, and AI-powered support into a trusted rental ecosystem.

---

## Phase Breakdown & Roadmap

### **Phase 1: Foundation & Auth (Week 1–2)**
- Supabase setup: Auth, Row-Level Security (RLS), storage buckets
- Next.js project scaffolding with TypeScript, Tailwind, shadcn/ui
- User registration + email verification via Resend
- Basic user profile + document upload for KYC

### **Phase 2: Catalog & Core Discovery (Week 3–4)**
- Tools database + image storage pipeline
- Product grid with pagination, filtering (category, condition, availability)
- Basic search (keyword + category)
- AI-powered semantic search integration (DeepSeek)

### **Phase 3: Cart, Checkout & Orders (Week 5–6)**
- Rental cart system with duration-based pricing logic
- Checkout flow: location input (hotel/plant/GPS), rental duration selection
- Stripe integration (international payments) + Paymob (local Egyptian methods)
- Order creation + pre-auth hold for insurance deposit
- Order confirmation emails via Resend

### **Phase 4: Admin Dashboard (Week 7–8)**
- KYC verification queue (approve/flag documents)
- Stock management (add tools, update availability, pricing)
- Order management + handover inspection protocol (photo uploads)
- Deposit refund processing
- Analytics: rental velocity, top tools, geographic heatmap

### **Phase 5: Custom Requests & Sourcing (Week 9–10)**
- Custom request form with AI-assisted spec extraction
- Admin request queue + sourcing workflow
- Quote generation + user notification
- Integration with inventory upon fulfillment

### **Phase 6: AI Chatbot & Multilingual Assistant (Week 11–12)**
- Embedded AI chatbot on homepage/product pages
- Knowledge base: FAQs, pricing, KYC process, delivery logistics
- Multilingual support (EN, DE, FR, IT, AR)
- Intent routing: product discovery, KYC help, order status, complaint escalation
- Integration with custom request flow

### **Phase 7: Handover & Return Protocol (Week 13–14)**
- Mobile-friendly inspection protocol
- Photo upload + condition rating (5-point scale)
- Automated deposit reconciliation
- Return tracking + refund triggers

### **Phase 8: Polish & Launch (Week 15–16)**
- Security hardening (RLS audit, OWASP compliance)
- Performance optimization + CDN setup
- E2E testing for critical flows
- Go-live preparation

---

## Database Schema (Supabase PostgreSQL)

### **1. Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  country_origin TEXT,
  kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  kyc_document_url TEXT,
  kyc_document_type ENUM('passport', 'visa', 'company_id') NOT NULL,
  kyc_reviewed_at TIMESTAMP,
  kyc_reviewed_by UUID REFERENCES users(id),
  kyc_rejection_reason TEXT,
  whatsapp_contact TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);
```

### **2. Tools Table**
```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  model_number TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  technical_specs JSONB,
  rental_price_per_day DECIMAL(10, 2) NOT NULL,
  rental_price_per_week DECIMAL(10, 2),
  rental_price_per_month DECIMAL(10, 2),
  insurance_deposit DECIMAL(10, 2) NOT NULL,
  total_quantity INT DEFAULT 1,
  available_quantity INT DEFAULT 1,
  condition ENUM('excellent', 'good', 'fair') DEFAULT 'good',
  image_urls TEXT[],
  ai_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Orders Table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status ENUM('pending_kyc', 'pending_payment', 'confirmed', 'dispatched', 'delivered', 'returned', 'completed', 'cancelled') DEFAULT 'pending_kyc',
  items JSONB NOT NULL,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_duration_days INT NOT NULL,
  rental_fee DECIMAL(12, 2) NOT NULL,
  insurance_deposit DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  location_details JSONB NOT NULL,
  delivery_address TEXT,
  gps_coordinates POINT,
  delivery_date DATE,
  delivery_representative TEXT,
  delivery_photo_urls TEXT[],
  return_date DATE,
  return_condition ENUM('excellent', 'good', 'fair', 'damaged', 'missing'),
  return_photo_urls TEXT[],
  inspection_notes TEXT,
  deposit_status ENUM('pending', 'held', 'refunded', 'forfeited') DEFAULT 'pending',
  payment_intent_id TEXT,
  stripe_charge_id TEXT,
  paymob_order_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **4. CustomRequests Table**
```sql
CREATE TABLE custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_number TEXT UNIQUE NOT NULL,
  status ENUM('submitted', 'in_sourcing', 'quote_sent', 'approved', 'tool_added', 'cancelled', 'rejected') DEFAULT 'submitted',
  tool_name TEXT NOT NULL,
  technical_specs JSONB,
  ai_extracted_specs JSONB,
  use_case_description TEXT,
  estimated_rental_duration_days INT,
  urgency_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  estimated_price DECIMAL(12, 2),
  final_quote_price DECIMAL(12, 2),
  quote_issued_at TIMESTAMP,
  admin_notes TEXT,
  assigned_to_admin UUID REFERENCES users(id),
  source_vendor TEXT,
  procurement_cost DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Deposits Ledger Table**
```sql
CREATE TABLE deposit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  status ENUM('pending', 'held', 'released', 'forfeited') DEFAULT 'pending',
  release_reason ENUM('clean_return', 'minor_damage_deducted', 'tool_missing', 'admin_decision') DEFAULT 'clean_return',
  deduction_amount DECIMAL(12, 2) DEFAULT 0,
  refund_method ENUM('original_card', 'bank_transfer', 'wallet') DEFAULT 'original_card',
  stripe_refund_id TEXT,
  processed_at TIMESTAMP,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. KYC Documents Table**
```sql
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type ENUM('passport', 'visa', 'company_id', 'proof_of_address') NOT NULL,
  storage_path TEXT NOT NULL,
  file_hash TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  is_current BOOLEAN DEFAULT TRUE
);
```

### **7. Tool Inventory Audit Log**
```sql
CREATE TABLE tool_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  action ENUM('created', 'updated', 'returned_good', 'returned_damaged', 'maintenance', 'decommissioned') NOT NULL,
  previous_quantity INT,
  new_quantity INT,
  notes TEXT,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **8. Chat & Support Table**
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_identifier TEXT UNIQUE NOT NULL,
  language ENUM('en', 'de', 'fr', 'it', 'ar') DEFAULT 'en',
  messages JSONB,
  intent_detected TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  escalated_to_admin BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Next.js Directory Structure

```
euro-tools/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage + AI chatbot embed
│   ├── auth/
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       └── RegistrationForm.tsx
│   │   ├── login/page.tsx
│   │   └── kyc/
│   │       ├── page.tsx
│   │       └── components/
│   │           ├── DocumentUpload.tsx
│   │           └── KYCStatus.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                # Protected layout
│   │   ├── page.tsx                  # User dashboard
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── custom-requests/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # Admin auth check
│   │   ├── dashboard/page.tsx
│   │   ├── kyc-queue/
│   │   │   ├── page.tsx
│   │   │   └── [userId]/page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [orderId]/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           └── InspectionProtocol.tsx
│   │   ├── custom-requests/
│   │   │   ├── page.tsx
│   │   │   └── [requestId]/page.tsx
│   │   └── analytics/page.tsx
│   ├── catalog/
│   │   ├── page.tsx                  # Product grid + filters
│   │   ├── [toolId]/
│   │   │   ├── page.tsx              # Tool detail
│   │   │   └── components/
│   │   │       └── ToolDetail.tsx
│   │   └── search/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── CartSummary.tsx
│   │       ├── LocationForm.tsx
│   │       ├── PaymentForm.tsx
│   │       └── ReviewOrder.tsx
│   ├── api/
│   │   ├── auth/ (Supabase auth endpoints)
│   │   ├── tools/
│   │   │   ├── route.ts              # GET all, POST new
│   │   │   ├── search/route.ts       # AI search via DeepSeek
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts              # GET, POST
│   │   │   └── [id]/route.ts
│   │   ├── custom-requests/
│   │   │   ├── route.ts              # POST new request
│   │   │   └── [id]/route.ts
│   │   ├── checkout/
│   │   │   ├── stripe-webhook/route.ts
│   │   │   ├── paymob-webhook/route.ts
│   │   │   └── create-payment-intent/route.ts
│   │   ├── kyc/
│   │   │   ├── verify/route.ts
│   │   │   └── upload/route.ts
│   │   ├── chat/
│   │   │   ├── message/route.ts      # Chat AI integration
│   │   │   └── sessions/route.ts
│   │   └── admin/
│   │       ├── analytics/route.ts
│   │       └── deposits/refund/route.ts
│   └── error.tsx, not-found.tsx
├── components/
│   ├── ui/                           # shadcn/ui imports
│   ├── Chatbot/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── Forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── CustomRequestForm.tsx
│   ├── Common/
│   │   ├── KYCBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── TrustSignals.tsx
│   │   └── DepositExplainer.tsx
│   └── Cards/
│       ├── ToolCard.tsx
│       ├── OrderCard.tsx
│       └── RequestCard.tsx
├── lib/
│   ├── supabase.ts                   # Client initialization
│   ├── auth.ts                       # Auth helpers
│   ├── types.ts                      # TypeScript interfaces
│   ├── constants.ts                  # Pricing, durations, enums
│   ├── utils.ts                      # Helpers (formatting, validation)
│   ├── deepseek.ts                   # DeepSeek API client
│   ├── stripe.ts                     # Stripe API client
│   ├── paymob.ts                     # Paymob API client
│   └── email.ts                      # Resend email templates
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useTools.ts
│   ├── useOrders.ts
│   └── useChatbot.ts
├── services/
│   ├── orderService.ts               # Order creation, fulfillment
│   ├── kycService.ts                 # KYC verification logic
│   ├── depositService.ts             # Deposit hold/release
│   ├── searchService.ts              # DeepSeek integration
│   ├── chatService.ts                # AI chatbot orchestration
│   └── notificationService.ts        # Email dispatch via Resend
├── types/
│   ├── database.ts                   # Supabase generated types
│   └── custom.ts                     # Domain models
├── public/
│   └── images/
├── styles/
│   ├── globals.css                   # Tailwind + custom variables
│   └── variables.css                 # CSS custom properties (colors, spacing)
├── env/
│   ├── .env.local                    # Dev secrets (not committed)
│   └── .env.example                  # Template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
└── README.md
```

---

## Key Integration Points

### **1. AI Search (DeepSeek API)**
- **Endpoint**: `/api/tools/search`
- **Function**: Parse natural language queries (e.g., "24V PLC module") → extract specs → vector search + keyword fallback
- **Response**: Ranked tool matches with semantic relevance scores
- **Caching**: 24h Redis cache on popular queries

### **2. DeepSeek Custom Request Analyzer**
- **Trigger**: User submits custom request form
- **AI Task**: Extract technical specs, identify category, estimate rental duration, flag sourcing difficulty
- **Output**: Structured RFQ for admin team + auto-drafted quote template

### **3. AI Chatbot Engine**
- **Platform**: DeepSeek API (backbone) + Next.js API route (`/api/chat/message`)
- **Architecture**:
  - System prompt with platform knowledge base (KYC, pricing, delivery, tools)
  - Intent classification (product discovery, KYC help, order status, complaint)
  - Multi-turn conversation memory (session-based, stored in `chat_sessions` table)
  - Escalation trigger: flagged complaints → admin queue
- **Languages**: EN, DE, FR, IT, AR (prompt templates for each)

### **4. Payment Orchestration**
- **Stripe**: International EUR/USD cards
- **Paymob**: Egyptian local methods (Vodafone Cash, etisalat, banks)
- **Flow**: User selects payment method → webhook captures payment → pre-auth hold for deposit → order confirmed
- **Webhooks**: `/api/checkout/stripe-webhook` & `/api/checkout/paymob-webhook`

### **5. Email Notifications (Resend)**
- KYC submission confirmation
- KYC approval/rejection
- Order confirmation + invoice
- Custom quote ready notification
- Deposit refund receipt
- Delivery/return reminders

### **6. Supabase RLS Policies**
- **Users**: Can view/edit own profile; admins see all
- **Tools**: Public read; admin-only write
- **Orders**: Users see own orders; admins see all
- **KYC Documents**: Users upload own; admins review all
- **Chat Sessions**: Users see own; admins see assigned escalations

---

## AI Chatbot Strategy & Knowledge Base

### **Chatbot Responsibilities**
1. **Product Discovery**: "I need a torque wrench for hydraulic systems" → AI searches catalog, suggests tools, explains specs
2. **KYC & Compliance**: Answer common questions about identity verification requirements, document types, timelines
3. **Pricing & Rental Terms**: "How much for a weekly PLC rental?" → Show pricing model with duration logic
4. **Delivery & Logistics**: Explain hotel/plant delivery, GPS pin requirements, handover protocol
5. **Order Status**: Track existing orders, answer return/deposit questions
6. **Complaint Escalation**: If user is frustrated, route to admin with context
7. **Custom Requests**: Guide users through custom tool request submission with AI-assisted specification extraction

### **Knowledge Base Structure** (in system prompt)
```
## Company Context
- Premium B2B tool rental for European engineers in Egypt
- We handle customs, so no excess baggage fees
- Trusted, insured rentals with deposit protection

## Pricing Logic
- Daily rate: EUR X–Y depending on tool complexity
- Weekly discount: 15% off 7+ days
- Monthly discount: 25% off 30+ days
- Insurance deposit: 20–40% of rental price, refunded clean-return

## KYC Requirements
- Passport + Egyptian visa OR European company ID
- Approval within 24 business hours
- Uploaded via secure portal

## Delivery
- Hotel, plant, or GPS pin
- WhatsApp coordination
- Inspection photos at handover
- Same-day service in Cairo metro

## Returns
- Photo-backed condition check (5-point scale)
- Automated deposit refund if clean
- Support team for damage disputes

## Common Tools
- PLC modules (Siemens, AB)
- Torque wrenches (pneumatic, electric)
- Multimeters & oscilloscopes
- Hydraulic test kits
- And 500+ more items
```

### **Escalation Rules**
- Hostile tone → escalate immediately to human
- Custom request precision <70% → escalate for admin sourcing
- Order dispute (damage claims) → escalate with photos to KYC admin
- Refund request → escalate with deposit ledger snapshot

---

## Security & Compliance Considerations

### **KYC/AML**
- Document storage in encrypted Supabase buckets (separate from tool images)
- Admin audit log on every verification action
- Retry limits on failed KYC attempts (5 fails → block user)

### **PCI-DSS Compliance**
- Never store full card details; use Stripe's PCI-compliant tokenization
- All payment processing via API; no direct database storage of card data

### **RLS Enforcement**
- Every query includes `WHERE user_id = auth.uid()` or admin check
- Deposit ledger records only visible to relevant user + finance admins

### **Rate Limiting**
- `/api/tools/search`: 10 req/min per IP (to prevent DeepSeek quota abuse)
- `/api/chat/message`: 30 req/min per session
- `/api/auth/register`: 5 req/hour per IP

### **Image Handling**
- Tool images: public read, admin write
- KYC documents: private read (only user + admin), no public access
- Inspection photos: private, linked to specific order

---

## Performance & Scalability

### **Caching Strategy**
- **CDN**: Supabase Storage for tool images (auto-cached via Cloudflare)
- **Redis**: 24h cache on popular tool searches, AI model outputs
- **Browser**: Next.js ISR (Incremental Static Regeneration) on `/catalog` (revalidate every 30min)

### **Database Optimization**
- Indexes on: `user_id`, `tool_id`, `order_status`, `kyc_status`, `created_at`
- Partitioning: Orders by `rental_start_date` (monthly partitions)
- Read replicas: Separate read-only instance for analytics dashboards

### **AI API Optimization**
- Batch custom request specs every 5 minutes
- Cache embedding vectors for tools (24h TTL)
- Fallback to keyword search if DeepSeek API times out (>5s)

---

## Testing Strategy

### **Unit Tests** (Vitest + React Testing Library)
- Pricing calculation logic
- KYC verification state machine
- Deposit refund calculations
- Chat intent classification

### **Integration Tests**
- Order creation → payment → KYC approval → dispatch flow
- Custom request submission → AI spec extraction → quote generation
- Deposit hold & refund webhook handling

### **E2E Tests** (Cypress)
- User registration + KYC upload
- Catalog search + add to cart → checkout
- Admin KYC approval + order dispatch

### **Security Tests**
- RLS policy verification (users can't see other users' orders)
- Payment webhook signature validation
- API rate limiting under load

---

## Success Metrics & KPIs

1. **Conversion**: Registration → KYC approval → first order
2. **Tool Velocity**: Average rentals per tool per month
3. **Chatbot Deflection**: % of support issues resolved without admin escalation
4. **Deposit Safety**: Zero disputed refunds
5. **Search Relevance**: AI search result relevance score (user click-through rate)
6. **Payment Success**: EUR/Egyptian method conversion rates

---

## Decisions Finalized

1. **Deployment**: Vercel (serverless Next.js)
2. **Currency**: USD base price with real-time exchange rate conversion to client's local currency (EUR, GBP, EGP, etc.)
3. **Tool Return Process**: Representative-driven inspection (no client photo uploads to prevent fraud)
   - Representative logs condition immediately upon receiving tool
   - Admin sees instant refund queue with pre-calculated amounts
   - One-click approve/deduct interface
   - No formal rating scale - representative provides notes based on company standards
4. **Chatbot Hosting**: Self-hosted on Vercel via Next.js API routes
5. **Deposit Deductions**: Admin manual approval for each deduction (shows client contact info + refund amount in queue)

---

## Implementation Status - COMPLETED ✅

### Core Features Implemented:
- ✅ Next.js 14 project with TypeScript, Tailwind CSS
- ✅ Supabase database schema (ready to deploy via SQL Editor)
- ✅ User authentication (register, login)
- ✅ KYC verification system with document upload
- ✅ Tool catalog with search and filtering
- ✅ Tool detail pages with rental calculator
- ✅ Shopping cart and checkout flow
- ✅ Multi-currency support (USD base with real-time conversion)
- ✅ Order management system
- ✅ Custom tool request submission
- ✅ Admin dashboard with analytics
- ✅ Admin KYC verification queue
- ✅ Admin order management
- ✅ **Admin refund queue (representative-driven returns)**
- ✅ Admin tools inventory management
- ✅ User dashboard with order history
- ✅ Deposit ledger tracking

### Ready to Deploy:
1. Run SQL schema in Supabase dashboard
2. Create storage buckets (tool-images, kyc-documents, inspection-photos)
3. Add API keys to `.env.local`
4. Deploy to Vercel: `vercel`

### Remaining Enhancements (Optional):
- AI-powered search via DeepSeek API (requires API key)
- Stripe/Paymob payment integration (requires API keys)
- Email notifications via Resend (requires API key)
- AI Chatbot implementation
- Advanced analytics dashboard

