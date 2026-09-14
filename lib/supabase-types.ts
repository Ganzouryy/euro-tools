// Supabase type overrides to fix strict type checking issues
import { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseClientType = SupabaseClient<any, 'public', any>

// Helper type for update operations
export type UpdateData<T> = Partial<T>
