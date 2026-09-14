// Database type definitions for proper TypeScript support
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
          image_urls: string[] | null
          ai_tags: string[] | null
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
          image_urls?: string[] | null
          ai_tags?: string[] | null
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
          image_urls?: string[] | null
          ai_tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          items: Json
          rental_start_date: string
          rental_end_date: string
          rental_duration_days: number
          rental_fee: number
          insurance_deposit: number
          total_amount: number
          location_details: Json
          delivery_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: string
          items: Json
          rental_start_date: string
          rental_end_date: string
          rental_duration_days: number
          rental_fee: number
          insurance_deposit: number
          total_amount: number
          location_details: Json
          delivery_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          items?: Json
          rental_start_date?: string
          rental_end_date?: string
          rental_duration_days?: number
          rental_fee?: number
          insurance_deposit?: number
          total_amount?: number
          location_details?: Json
          delivery_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      custom_requests: {
        Row: {
          id: string
          user_id: string
          request_number: string
          status: string
          tool_name: string
          technical_specs: Json | null
          ai_extracted_specs: Json | null
          use_case_description: string | null
          estimated_rental_duration_days: number | null
          urgency_level: string
          estimated_price: number | null
          final_quote_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          request_number: string
          status?: string
          tool_name: string
          technical_specs?: Json | null
          ai_extracted_specs?: Json | null
          use_case_description?: string | null
          estimated_rental_duration_days?: number | null
          urgency_level?: string
          estimated_price?: number | null
          final_quote_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          request_number?: string
          status?: string
          tool_name?: string
          technical_specs?: Json | null
          ai_extracted_specs?: Json | null
          use_case_description?: string | null
          estimated_rental_duration_days?: number | null
          urgency_level?: string
          estimated_price?: number | null
          final_quote_price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
