import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { emailService } from "@/lib/email-service"
import { welcomeEmailTemplate } from "@/lib/email-templates"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'hero-form' } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if email already exists
    const { data: existingSignup } = await supabase
      .from('early_access_signups')
      .select('email, confirmed')
      .eq('email', email.toLowerCase())
      .single()

    if (existingSignup) {
      if (existingSignup.confirmed) {
        return NextResponse.json({
          message: "✓ You're already on the early access list! We'll be in touch soon.",
          success: true
        }, { status: 200 })
      } else {
        return NextResponse.json({
          message: "✓ You've already signed up! Check your email for the confirmation link.",
          success: true
        }, { status: 200 })
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex')

    // Store in database
    const { error: insertError } = await supabase
      .from('early_access_signups')
      .insert({
        email: email.toLowerCase(),
        confirmation_token: confirmationToken,
        source,
        confirmed: false,
        created_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error("Database insert error:", insertError)
      if (insertError.code === '23505') {
        return NextResponse.json({
          message: "✓ You're already on the early access list!",
          success: true
        }, { status: 200 })
      }
    }

    // Send welcome email with our beautiful HTML template
    const emailHtml = welcomeEmailTemplate(email, confirmationToken)
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: "Welcome to Lumeo - Your Early Access is Confirmed! 🚀",
      html: emailHtml,
    })

    if (!emailSent) {
      console.error('Failed to send welcome email to:', email)
      return NextResponse.json({
        error: "Failed to send confirmation email. Please try again."
      }, { status: 500 })
    }

    return NextResponse.json({
      message: "✓ Thank you for joining Lumeo! Check your email for next steps.",
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}
