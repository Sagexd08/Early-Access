import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from("early_access_signups")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ message: "Already subscribed", success: true }, { status: 200 })
    }

    // Insert new signup
    const { error: dbError } = await supabase.from("early_access_signups").insert({
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Supabase insert error:", dbError)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    // Trigger Supabase Auth to send the confirmation email (using project SMTP)
    // We create a user with a random password since this is just a waitlist.
    const { error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: crypto.randomUUID(), // Random password as we only want the email verification
      options: {
        data: {
          source: 'early_access_waitlist'
        }
      }
    })

    if (authError) {
      console.error("Supabase Auth error:", authError)
      // We don't fail the request here because the DB insert succeeded, 
      // but we log it. The user is on the list, just didn't get the email.
    } else {
      console.log('Supabase Auth signup triggered for:', email.toLowerCase())
    }

    return NextResponse.json({ message: "Successfully subscribed", success: true }, { status: 200 })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
