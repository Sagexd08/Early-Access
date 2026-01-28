import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const gmailUser = process.env.GMAIL_USER
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Create nodemailer transporter
const transporter = gmailUser && gmailAppPassword 
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })
  : null

console.log('Gmail email service configured:', !!transporter)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from("early_access_signups")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ message: "Already subscribed", success: true }, { status: 200 })
    }

    // Insert new signup
    const { error } = await supabase.from("early_access_signups").insert({
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    if (transporter) {
      try {
        console.log('Attempting to send email to:', email.toLowerCase())
        const info = await transporter.sendMail({
          from: '"Lumeo" <sohomchatterjee07@gmail.com>',
          to: email.toLowerCase(),
          subject: "Welcome to Lumeo Early Access! 🚀",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                  .header { text-align: center; margin-bottom: 40px; }
                  .logo { font-size: 32px; font-weight: bold; letter-spacing: 0.1em; color: #000; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
                  .badge { display: inline-block; background: #000; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 12px; letter-spacing: 0.1em; margin-bottom: 20px; }
                  .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                  .text { color: #666; margin-bottom: 15px; }
                  .features { margin: 20px 0; }
                  .feature { padding: 15px 0; border-bottom: 1px solid #ddd; }
                  .feature:last-child { border-bottom: none; }
                  .footer { text-align: center; color: #999; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">LUMEO</div>
                  </div>
                  <div class="content">
                    <div class="badge">EARLY ACCESS ✓</div>
                    <h1 class="title">You're on the list!</h1>
                    <p class="text">Welcome to the future of instant payments. You're now part of our exclusive early access program.</p>
                    
                    <div class="features">
                      <div class="feature">
                        <strong>🚀 Quantum Speed</strong><br>
                        <span class="text">Sub-millisecond settlement times</span>
                      </div>
                      <div class="feature">
                        <strong>🔒 Distributed Trust</strong><br>
                        <span class="text">Zero-knowledge proof verification</span>
                      </div>
                      <div class="feature">
                        <strong>🌐 Cross-Chain Flow</strong><br>
                        <span class="text">Seamless value transfer across blockchains</span>
                      </div>
                    </div>
                    
                    <p class="text"><strong>What's Next?</strong></p>
                    <p class="text">We'll keep you updated on our progress and notify you as soon as the platform launches. Expected launch: Q3 2026.</p>
                  </div>
                  <div class="footer">
                    <p>© 2026 Lumeo. All rights reserved.</p>
                    <p>You're receiving this because you signed up for early access.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
        console.log('Email sent successfully:', info.messageId)
      } catch (emailError) {
        console.error("Email send error details:", emailError)
        // Don't fail the request if email fails - user is still subscribed
      }
    } else {
      console.log('Gmail not configured - skipping email')
    }

    return NextResponse.json({ message: "Successfully subscribed", success: true }, { status: 200 })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
