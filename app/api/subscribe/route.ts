import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { emailService } from "@/lib/email-service"
import { welcomeEmailTemplate } from "@/lib/email-templates"
import crypto from "crypto"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string, email: string): string {
  return `${ip}:${email}`
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(key)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return false
  }
  
  if (limit.count >= 3) { // Max 3 attempts per minute
    return true
  }
  
  limit.count++
  return false
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'hero-form' } = await request.json()
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }
    
    // Get client info
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Rate limiting
    const rateLimitKey = getRateLimitKey(clientIP, email)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ 
        error: "Too many requests. Please try again later." 
      }, { status: 429 })
    }
    
    // Check if email already exists
    const existingSignup = await db.findSignupByEmail(email)
    if (existingSignup) {
      if (existingSignup.confirmed) {
        return NextResponse.json({ 
          message: "You're already on the waitlist and confirmed!", 
          success: true 
        }, { status: 200 })
      } else {
        return NextResponse.json({ 
          message: "Please check your email and confirm your signup.", 
          success: true 
        }, { status: 200 })
      }
    }
    
    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex')
    
    // Create signup record
    const signupResult = await db.createSignup({
      email,
      confirmation_token: confirmationToken,
      confirmed: false,
      source,
      user_agent: userAgent,
      ip_address: clientIP,
    })
    
    if (!signupResult.success) {
      return NextResponse.json({ 
        error: "Failed to register. Please try again." 
      }, { status: 500 })
    }
    
    // Send welcome email
    const emailHtml = welcomeEmailTemplate(email, confirmationToken)
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: "Lumeo Protocol - Access Granted",
      html: emailHtml,
    })
    
    if (!emailSent) {
      console.error('Failed to send welcome email to:', email)
      // Don't fail the request - user is still registered
    }
    
    return NextResponse.json({ 
      message: "✓ Welcome to the alpha. Check your email for next steps.",
      success: true 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
