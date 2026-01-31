import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { emailService } from "@/lib/email-service"
import { confirmationEmailTemplate } from "@/lib/email-templates"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    
    if (!token || !email) {
      return NextResponse.json({ 
        error: "Missing confirmation token or email" 
      }, { status: 400 })
    }
    
    // Confirm the signup
    const result = await db.confirmSignup(email, token)
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || "Invalid confirmation link" 
      }, { status: 400 })
    }
    
    // Send confirmation email
    const confirmationHtml = confirmationEmailTemplate(email)
    await emailService.sendEmail({
      to: email,
      subject: "Lumeo Protocol - Verification Complete",
      html: confirmationHtml,
    })
    
    // Redirect to success page
    return NextResponse.redirect(new URL('/confirmed', request.url))
    
  } catch (error) {
    console.error("Confirmation error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()
    
    if (!token || !email) {
      return NextResponse.json({ 
        error: "Missing confirmation token or email" 
      }, { status: 400 })
    }
    
    // Confirm the signup
    const result = await db.confirmSignup(email, token)
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || "Invalid confirmation token" 
      }, { status: 400 })
    }
    
    // Send confirmation email
    const confirmationHtml = confirmationEmailTemplate(email)
    await emailService.sendEmail({
      to: email,
      subject: "Lumeo Protocol - Verification Complete",
      html: confirmationHtml,
    })
    
    return NextResponse.json({ 
      message: "Email confirmed successfully!",
      success: true 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Confirmation error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}