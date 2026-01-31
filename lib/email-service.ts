import nodemailer from 'nodemailer'

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface SendEmailOptions {
    to: string
    subject: string
    html: string
}

export const emailService = {
    async sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
        try {
            const info = await transporter.sendMail({
                from: `"Team Lumeo" <${process.env.SMTP_USER || 'lumeohq@gmail.com'}>`,
                to,
                subject,
                html,
            })

            console.log('Email sent:', info.messageId)
            return true
        } catch (error) {
            console.error('Email send error:', error)
            return false
        }
    }
}
