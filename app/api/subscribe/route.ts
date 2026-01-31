import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'hero-form' } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Initialize Supabase Admin Client (Service Role) to send magic link
    // We use service role to avoid RLS issues if any, or just standard client if preferred.
    // For signInWithOtp, standard public key client usually works client-side, 
    // but server-side we can use service role for higher limits or specific admin actions.
    // However, for just Auth, standard client created with NEXT_PUBLIC_... works fine too.
    // Let's use the standard flow to mimic a user signing up.

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Trigger Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // You can set this to your confirmation page URL:
        // emailRedirectTo: `${request.nextUrl.origin}/confirm`,
        data: {
          signup_source: source
        }
      }
    })

    if (error) {
      console.error("Supabase Auth Error:", error.message)
      return NextResponse.json({
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      message: "✓ Check your email for the secure login link.",
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}
