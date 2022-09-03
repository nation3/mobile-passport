import { createClient } from '@supabase/supabase-js'
import { config } from './Config'

export const supabase = createClient(config.dbSupabaseUrl, config.dbSupabaseAnonKey)
