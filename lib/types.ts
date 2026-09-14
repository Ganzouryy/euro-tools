// Database Types

export interface User {
  id: string
  email: string
  phone?: string
  first_name: string
  last_name: string
  company_name?: string
  country_origin?: string
  kyc_status: 'pending' | 'verified' | 'rejected'
  kyc_document_url?: string
  kyc_document_type?: 'passport' | 'visa' | 'company_id'
  kyc_reviewed_at?: string
  kyc_reviewed_by?: string
  kyc_rejection_reason?: string
  whatsapp_contact?: string
  created_at: string
  updated_at: string
  is_admin: boolean
}

export interface Tool {
  id: string
  name: string
  description?: string
  model_number?: string
  category: string
  sub_category?: string
  technical_specs?: Record<string, any>
  rental_price_per_day: number
  rental_price_per_week?: number
  rental_price_per_month?: number
  insurance_deposit: number
  total_quantity: number
  available_quantity: number
  condition: 'excellent' | 'good' | 'fair'
  image_urls?: string[]
  ai_tags?: string[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending_kyc' | 'pending_payment' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'completed' | 'cancelled'
  items: OrderItem[]
  rental_start_date: string
  rental_end_date: string
  rental_duration_days: number
  rental_fee: number
  insurance_deposit: number
  total_amount: number
  location_details: LocationDetails
  delivery_address?: string
  gps_coordinates?: string
  delivery_date?: string
  delivery_representative?: string
  return_date?: string
  return_condition?: string
  inspection_notes?: string
  deposit_status: 'pending' | 'held' | 'refunded' | 'forfeited'
  payment_intent_id?: string
  paymob_order_id?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  tool_id: string
  tool_name: string
  quantity: number
  rental_days: number
  price_per_day: number
  insurance_deposit: number
}

export interface LocationDetails {
  deliveryType: 'hotel' | 'plant' | 'gps'
  locationName: string
  address: string
  gpsLink?: string
  city: string
  contactPerson: string
  contactPhone: string
}

export interface CustomRequest {
  id: string
  user_id: string
  request_number: string
  status: 'submitted' | 'in_sourcing' | 'quote_sent' | 'approved' | 'tool_added' | 'cancelled' | 'rejected'
  tool_name: string
  technical_specs?: Record<string, any>
  ai_extracted_specs?: Record<string, any>
  use_case_description?: string
  estimated_rental_duration_days?: number
  urgency_level: 'low' | 'medium' | 'high' | 'critical'
  estimated_price?: number
  final_quote_price?: number
  quote_issued_at?: string
  admin_notes?: string
  assigned_to_admin?: string
  source_vendor?: string
  procurement_cost?: number
  created_at: string
  updated_at: string
}

export interface DepositLedger {
  id: string
  order_id: string
  user_id: string
  amount: number
  status: 'pending' | 'held' | 'released' | 'forfeited'
  release_reason?: 'clean_return' | 'minor_damage_deducted' | 'tool_missing' | 'admin_decision'
  deduction_amount: number
  refund_method?: 'original_card' | 'bank_transfer' | 'wallet'
  processed_at?: string
  processed_by?: string
  created_at: string
}

export interface ChatSession {
  id: string
  user_id?: string
  session_identifier: string
  language: 'en' | 'de' | 'fr' | 'it' | 'ar'
  messages?: Record<string, any>
  intent_detected?: string
  resolved: boolean
  escalated_to_admin: boolean
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  tool_id: string
  tool_name: string
  quantity: number
  rental_days: number
  price_per_day: number
  insurance_deposit: number
}
