import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { emailService } from "@/lib/email-service"
import { confirmationEmailTemplate } from "@/lib/email-templates"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (!token || !email) {
    return NextResponse.redirect(new URL('/early-access?error=invalid_link', request.url))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('early_access_signups')
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .eq('confirmation_token', token)
    .select()

  if (error || !data || data.length === 0) {
    console.error("Confirmation error:", error)
    return NextResponse.redirect(new URL('/early-access?error=invalid_token', request.url))
  }

  // Send confirmation success email
  const confirmationHtml = confirmationEmailTemplate(email)
  await emailService.sendEmail({
    to: email,
    subject: "You're In! Welcome to Lumeo Early Access 🎉",
    html: confirmationHtml,
  })

  // Redirect to success page
  return NextResponse.redirect(new URL('/confirmed', request.url))
}
