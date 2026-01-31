import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export type EarlyAccessSignup = Database['public']['Tables']['early_access_signups']['Row']
export type EarlyAccessSignupInsert = Database['public']['Tables']['early_access_signups']['Insert']
export type EarlyAccessSignupUpdate = Database['public']['Tables']['early_access_signups']['Update']

export class DatabaseService {
  async createSignup(signup: EarlyAccessSignup): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .insert({
          email: signup.email.toLowerCase(),
          confirmation_token: signup.confirmation_token,
          confirmed: false,
          created_at: new Date().toISOString(),
          source: signup.source || 'hero-form',
          user_agent: signup.user_agent,
          ip_address: signup.ip_address,
        })
        .select()
        .single()

      if (error) {
        console.error('Database insert error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Database service error:', error)
      return { success: false, error: 'Database operation failed' }
    }
  }

  async findSignupByEmail(email: string): Promise<EarlyAccessSignup | null> {
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Database select error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Database service error:', error)
      return null
    }
  }

  async confirmSignup(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .update({
          confirmed: true,
          confirmed_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase())
        .eq('confirmation_token', token)
        .select()

      if (error) {
        console.error('Database update error:', error)
        return { success: false, error: error.message }
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'Invalid confirmation token or email' }
      }

      return { success: true }
    } catch (error) {
      console.error('Database service error:', error)
      return { success: false, error: 'Confirmation failed' }
    }
  }

  async getSignupStats(): Promise<{ total: number; confirmed: number; recent: number }> {
    try {
      // Get total signups
      const { count: total } = await supabase
        .from('early_access_signups')
        .select('*', { count: 'exact', head: true })

      // Get confirmed signups
      const { count: confirmed } = await supabase
        .from('early_access_signups')
        .select('*', { count: 'exact', head: true })
        .eq('confirmed', true)

      // Get recent signups (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { count: recent } = await supabase
        .from('early_access_signups')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString())

      return {
        total: total || 0,
        confirmed: confirmed || 0,
        recent: recent || 0,
      }
    } catch (error) {
      console.error('Database stats error:', error)
      return { total: 0, confirmed: 0, recent: 0 }
    }
  }
}

export const db = new DatabaseService()