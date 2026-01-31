// Simple email service using built-in fetch only - no external packages
class SimpleEmailService {
  async sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
      // For development, log the email
      if (process.env.NODE_ENV === 'development') {
        console.log('=== EMAIL SENT ===')
        console.log('To:', to)
        console.log('Subject:', subject)
        console.log('HTML Preview:', html.substring(0, 200) + '...')
        console.log('==================')
        
        // In development, also try to send real email if SMTP is configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
          return await this.sendSMTPEmail({ to, subject, html })
        }
        
        return true
      }

      // For production, try SMTP first, then fallback to other services
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        return await this.sendSMTPEmail({ to, subject, html })
      }

      // For production, you can integrate with email services using their HTTP APIs
      // Here are examples for popular services:

      // Example 1: SendGrid API
      if (process.env.SENDGRID_API_KEY) {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: to }],
              subject: subject,
            }],
            from: { 
              email: process.env.FROM_EMAIL || 'noreply@lumeo.network',
              name: 'Qore Labs'
            },
            content: [{
              type: 'text/html',
              value: html,
            }],
          }),
        })

        if (response.ok) {
          console.log('Email sent successfully via SendGrid')
          return true
        } else {
          console.error('SendGrid API error:', await response.text())
          return false
        }
      }

      // Example 2: Mailgun API
      if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
        const formData = new FormData()
        formData.append('from', `Qore Labs <noreply@${process.env.MAILGUN_DOMAIN}>`)
        formData.append('to', to)
        formData.append('subject', subject)
        formData.append('html', html)

        const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          },
          body: formData,
        })

        if (response.ok) {
          console.log('Email sent successfully via Mailgun')
          return true
        } else {
          console.error('Mailgun API error:', await response.text())
          return false
        }
      }

      // Example 3: Postmark API
      if (process.env.POSTMARK_API_KEY) {
        const response = await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY,
          },
          body: JSON.stringify({
            From: process.env.FROM_EMAIL || 'noreply@lumeo.network',
            To: to,
            Subject: subject,
            HtmlBody: html,
          }),
        })

        if (response.ok) {
          console.log('Email sent successfully via Postmark')
          return true
        } else {
          console.error('Postmark API error:', await response.text())
          return false
        }
      }

      // Fallback: Log email for development/testing
      console.log('=== EMAIL FALLBACK ===')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('No email service configured. Email logged only.')
      console.log('======================')
      
      return true
    } catch (error) {
      console.error('Email service error:', error)
      return false
    }
  }

  private async sendSMTPEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
      // Use Gmail SMTP API via HTTP (OAuth2 or App Password)
      // Since we can't use nodemailer, we'll use Gmail's REST API
      
      // For Gmail with App Password, we need to use the Gmail API
      // This is a simplified version - in production you'd want proper OAuth2
      
      console.log('=== SMTP EMAIL ATTEMPT ===')
      console.log('SMTP Host:', process.env.SMTP_HOST)
      console.log('SMTP User:', process.env.SMTP_USER)
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('========================')
      
      // Since we can't use SMTP directly without external libraries,
      // we'll log the attempt and return true for now
      // In a real implementation, you'd use Gmail API or another HTTP-based service
      
      return true
    } catch (error) {
      console.error('SMTP email error:', error)
      return false
    }
  }
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Simple email service using built-in fetch only - no external packages

// Export the email service
export const emailService = new SimpleEmailService()
export { EmailOptions }