export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          first_name: string
          last_name: string
          company_name: string | null
          country_origin: string | null
          kyc_status: 'pending' | 'verified' | 'rejected'
          kyc_document_url: string | null
          kyc_document_type: 'passport' | 'visa' | 'company_id' | null
          kyc_reviewed_at: string | null
          kyc_reviewed_by: string | null
          kyc_rejection_reason: string | null
          whatsapp_contact: string | null
          preferred_currency: string
          created_at: string
          updated_at: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          first_name: string
          last_name: string
          company_name?: string | null
          country_origin?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_document_url?: string | null
          kyc_document_type?: 'passport' | 'visa' | 'company_id' | null
          kyc_reviewed_at?: string | null
          kyc_reviewed_by?: string | null
          kyc_rejection_reason?: string | null
          whatsapp_contact?: string | null
          preferred_currency?: string
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          first_name?: string
          last_name?: string
          company_name?: string | null
          country_origin?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_document_url?: string | null
          kyc_document_type?: 'passport' | 'visa' | 'company_id' | null
          kyc_reviewed_at?: string | null
          kyc_reviewed_by?: string | null
          kyc_rejection_reason?: string | null
          whatsapp_contact?: string | null
          preferred_currency?: string
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          description: string | null
          model_number: string | null
          category: string
          sub_category: string | null
          technical_specs: Json | null
          rental_price_per_day: number
          rental_price_per_week: number | null
          rental_price_per_month: number | null
          insurance_deposit: number
          total_quantity: number
          available_quantity: number
          condition: 'excellent' | 'good' | 'fair'
          image_urls: string[]
          ai_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          model_number?: string | null
          category: string
          sub_category?: string | null
          technical_specs?: Json | null
          rental_price_per_day: number
          rental_price_per_week?: number | null
          rental_price_per_month?: number | null
          insurance_deposit: number
          total_quantity?: number
          available_quantity?: number
          condition?: 'excellent' | 'good' | 'fair'
          image_urls?: string[]
          ai_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          model_number?: string | null
          category?: string
          sub_category?: string | null
          technical_specs?: Json | null
          rental_price_per_day?: number
          rental_price_per_week?: number | null
          rental_price_per_month?: number | null
          insurance_deposit?: number
          total_quantity?: number
          available_quantity?: number
          condition?: 'excellent' | 'good' | 'fair'
          image_urls?: string[]
          ai_tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending_kyc' | 'pending_payment' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'completed' | 'cancelled'
          items: Json
          rental_start_date: string
          rental_end_date: string
          rental_duration_days: number
          rental_fee: number
          insurance_deposit: number
          total_amount: number
          location_details: Json
          delivery_address: string | null
          delivery_date: string | null
          delivery_representative: string | null
          delivery_photo_urls: string[] | null
          return_date: string | null
          return_condition: string | null
          return_notes: string | null
          return_photo_urls: string[] | null
          inspection_notes: string | null
          deposit_status: 'pending' | 'held' | 'refunded' | 'forfeited'
          payment_intent_id: string | null
          stripe_charge_id: string | null
          paymob_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: 'pending_kyc' | 'pending_payment' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'completed' | 'cancelled'
          items: Json
          rental_start_date: string
          rental_end_date: string
          rental_duration_days: number
          rental_fee: number
          insurance_deposit: number
          total_amount: number
          location_details: Json
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_representative?: string | null
          delivery_photo_urls?: string[] | null
          return_date?: string | null
          return_condition?: string | null
          return_notes?: string | null
          return_photo_urls?: string[] | null
          inspection_notes?: string | null
          deposit_status?: 'pending' | 'held' | 'refunded' | 'forfeited'
          payment_intent_id?: string | null
          stripe_charge_id?: string | null
          paymob_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending_kyc' | 'pending_payment' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'completed' | 'cancelled'
          items?: Json
          rental_start_date?: string
          rental_end_date?: string
          rental_duration_days?: number
          rental_fee?: number
          insurance_deposit?: number
          total_amount?: number
          location_details?: Json
          delivery_address?: string | null
          delivery_date?: string | null
          delivery_representative?: string | null
          delivery_photo_urls?: string[] | null
          return_date?: string | null
          return_condition?: string | null
          return_notes?: string | null
          return_photo_urls?: string[] | null
          inspection_notes?: string | null
          deposit_status?: 'pending' | 'held' | 'refunded' | 'forfeited'
          payment_intent_id?: string | null
          stripe_charge_id?: string | null
          paymob_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      custom_requests: {
        Row: {
          id: string
          user_id: string
          request_number: string
          status: 'submitted' | 'in_sourcing' | 'quote_sent' | 'approved' | 'tool_added' | 'cancelled' | 'rejected'
          tool_name: string
          technical_specs: Json | null
          ai_extracted_specs: Json | null
          use_case_description: string | null
          estimated_rental_duration_days: number | null
          urgency_level: 'low' | 'medium' | 'high' | 'critical'
          estimated_price: number | null
          final_quote_price: number | null
          quote_issued_at: string | null
          admin_notes: string | null
          assigned_to_admin: string | null
          source_vendor: string | null
          procurement_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          request_number: string
          status?: 'submitted' | 'in_sourcing' | 'quote_sent' | 'approved' | 'tool_added' | 'cancelled' | 'rejected'
          tool_name: string
          technical_specs?: Json | null
          ai_extracted_specs?: Json | null
          use_case_description?: string | null
          estimated_rental_duration_days?: number | null
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          estimated_price?: number | null
          final_quote_price?: number | null
          quote_issued_at?: string | null
          admin_notes?: string | null
          assigned_to_admin?: string | null
          source_vendor?: string | null
          procurement_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          request_number?: string
          status?: 'submitted' | 'in_sourcing' | 'quote_sent' | 'approved' | 'tool_added' | 'cancelled' | 'rejected'
          tool_name?: string
          technical_specs?: Json | null
          ai_extracted_specs?: Json | null
          use_case_description?: string | null
          estimated_rental_duration_days?: number | null
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          estimated_price?: number | null
          final_quote_price?: number | null
          quote_issued_at?: string | null
          admin_notes?: string | null
          assigned_to_admin?: string | null
          source_vendor?: string | null
          procurement_cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      deposit_ledger: {
        Row: {
          id: string
          order_id: string
          user_id: string
          amount: number
          status: 'pending' | 'held' | 'released' | 'forfeited'
          release_reason: 'clean_return' | 'minor_damage_deducted' | 'tool_missing' | 'admin_decision' | null
          deduction_amount: number
          refund_method: 'original_card' | 'bank_transfer' | 'wallet'
          stripe_refund_id: string | null
          processed_at: string | null
          processed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          amount: number
          status?: 'pending' | 'held' | 'released' | 'forfeited'
          release_reason?: 'clean_return' | 'minor_damage_deducted' | 'tool_missing' | 'admin_decision' | null
          deduction_amount?: number
          refund_method?: 'original_card' | 'bank_transfer' | 'wallet'
          stripe_refund_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'held' | 'released' | 'forfeited'
          release_reason?: 'clean_return' | 'minor_damage_deducted' | 'tool_missing' | 'admin_decision' | null
          deduction_amount?: number
          refund_method?: 'original_card' | 'bank_transfer' | 'wallet'
          stripe_refund_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_identifier: string
          language: 'en' | 'de' | 'fr' | 'it' | 'ar'
          messages: Json
          intent_detected: string | null
          resolved: boolean
          escalated_to_admin: boolean
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_identifier: string
          language?: 'en' | 'de' | 'fr' | 'it' | 'ar'
          messages?: Json
          intent_detected?: string | null
          resolved?: boolean
          escalated_to_admin?: boolean
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_identifier?: string
          language?: 'en' | 'de' | 'fr' | 'it' | 'ar'
          messages?: Json
          intent_detected?: string | null
          resolved?: boolean
          escalated_to_admin?: boolean
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
