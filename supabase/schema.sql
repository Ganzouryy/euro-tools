-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  country_origin TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_document_url TEXT,
  kyc_document_type TEXT CHECK (kyc_document_type IN ('passport', 'visa', 'company_id')),
  kyc_reviewed_at TIMESTAMPTZ,
  kyc_reviewed_by UUID REFERENCES public.users(id),
  kyc_rejection_reason TEXT,
  whatsapp_contact TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Tools Table
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  model_number TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  technical_specs JSONB,
  rental_price_per_day NUMERIC(10, 2) NOT NULL,
  rental_price_per_week NUMERIC(10, 2),
  rental_price_per_month NUMERIC(10, 2),
  insurance_deposit NUMERIC(10, 2) NOT NULL,
  total_quantity INTEGER DEFAULT 1,
  available_quantity INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair')),
  image_urls TEXT[] DEFAULT '{}',
  ai_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending_kyc' CHECK (status IN ('pending_kyc', 'pending_payment', 'confirmed', 'dispatched', 'delivered', 'returned', 'completed', 'cancelled')),
  items JSONB NOT NULL,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_duration_days INTEGER NOT NULL,
  rental_fee NUMERIC(12, 2) NOT NULL,
  insurance_deposit NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  location_details JSONB NOT NULL,
  delivery_address TEXT,
  delivery_date DATE,
  delivery_representative TEXT,
  delivery_photo_urls TEXT[],
  return_date DATE,
  return_condition TEXT,
  return_notes TEXT,
  return_photo_urls TEXT[],
  inspection_notes TEXT,
  deposit_status TEXT DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'held', 'refunded', 'forfeited')),
  payment_intent_id TEXT,
  stripe_charge_id TEXT,
  paymob_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Requests Table
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  request_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_sourcing', 'quote_sent', 'approved', 'tool_added', 'cancelled', 'rejected')),
  tool_name TEXT NOT NULL,
  technical_specs JSONB,
  ai_extracted_specs JSONB,
  use_case_description TEXT,
  estimated_rental_duration_days INTEGER,
  urgency_level TEXT DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  estimated_price NUMERIC(12, 2),
  final_quote_price NUMERIC(12, 2),
  quote_issued_at TIMESTAMPTZ,
  admin_notes TEXT,
  assigned_to_admin UUID REFERENCES public.users(id),
  source_vendor TEXT,
  procurement_cost NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deposit Ledger Table
CREATE TABLE IF NOT EXISTS public.deposit_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'forfeited')),
  release_reason TEXT CHECK (release_reason IN ('clean_return', 'minor_damage_deducted', 'tool_missing', 'admin_decision')),
  deduction_amount NUMERIC(12, 2) DEFAULT 0,
  refund_method TEXT DEFAULT 'original_card' CHECK (refund_method IN ('original_card', 'bank_transfer', 'wallet')),
  stripe_refund_id TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  session_identifier TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'de', 'fr', 'it', 'ar')),
  messages JSONB DEFAULT '[]',
  intent_detected TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  escalated_to_admin BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool Audit Log Table
CREATE TABLE IF NOT EXISTS public.tool_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'returned_good', 'returned_damaged', 'maintenance', 'decommissioned')),
  previous_quantity INTEGER,
  new_quantity INTEGER,
  notes TEXT,
  performed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_available ON public.tools(available_quantity);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_id ON public.custom_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON public.custom_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_ledger_order_id ON public.deposit_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_deposit_ledger_status ON public.deposit_ledger(status);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Tools
CREATE POLICY "Anyone can view tools" ON public.tools FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can insert tools" ON public.tools FOR INSERT WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update tools" ON public.tools FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can delete tools" ON public.tools FOR DELETE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Custom Requests
CREATE POLICY "Users can view own requests" ON public.custom_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own requests" ON public.custom_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON public.custom_requests FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update all requests" ON public.custom_requests FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Deposit Ledger
CREATE POLICY "Users can view own deposits" ON public.deposit_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all deposits" ON public.deposit_ledger FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can update deposits" ON public.deposit_ledger FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can insert deposits" ON public.deposit_ledger FOR INSERT WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Chat Sessions
CREATE POLICY "Users can view own chats" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own chats" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own chats" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view all chats" ON public.chat_sessions FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for Tool Audit Log
CREATE POLICY "Admins can view audit log" ON public.tool_audit_log FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins can insert audit log" ON public.tool_audit_log FOR INSERT WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_requests_updated_at BEFORE UPDATE ON public.custom_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets (run these in Supabase dashboard -> Storage)
-- Tool images bucket (public)
-- KYC documents bucket (private)
-- Inspection photos bucket (private)
