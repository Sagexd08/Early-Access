export const welcomeEmailTemplate = (email: string, confirmationToken: string) => {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumeo Protocol - Access Granted</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background-color: #000000; 
            font-family: 'Courier New', Courier, monospace; 
            color: #e5e5e5; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #0a0a0a; 
            border: 1px solid #1a1a1a; 
        }
        .header { 
            padding: 40px 20px; 
            border-bottom: 1px solid #f97316; 
            text-align: center; 
            background: linear-gradient(180deg, rgba(249, 115, 22, 0.05) 0%, rgba(0,0,0,0) 100%); 
        }
        .logo { 
            color: #f97316; 
            font-size: 24px; 
            letter-spacing: 0.3em; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .badge { 
            display: inline-block; 
            background: rgba(249, 115, 22, 0.1); 
            color: #f97316; 
            padding: 6px 12px; 
            border: 1px solid rgba(249, 115, 22, 0.2); 
            font-size: 10px; 
            letter-spacing: 0.2em; 
            margin-bottom: 24px; 
            text-transform: uppercase; 
        }
        h1 { 
            font-size: 28px; 
            font-weight: normal; 
            margin: 0 0 24px 0; 
            letter-spacing: -0.02em; 
            color: #ffffff; 
        }
        p { 
            line-height: 1.8; 
            font-size: 14px; 
            color: #888; 
            margin-bottom: 24px; 
        }
        .highlight { 
            color: #fff; 
        }
        .divider { 
            height: 1px; 
            background: #1a1a1a; 
            margin: 30px 0; 
            width: 100%; 
        }
        .data-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            font-size: 12px; 
        }
        .label { 
            color: #444; 
            letter-spacing: 0.1em; 
            text-transform: uppercase; 
        }
        .value { 
            color: #f97316; 
            font-family: monospace; 
        }
        .footer { 
            padding: 30px; 
            text-align: center; 
            border-top: 1px solid #1a1a1a; 
            font-size: 10px; 
            color: #444; 
            letter-spacing: 0.1em; 
        }
        .btn { 
            display: inline-block; 
            background: #f97316; 
            color: #000; 
            padding: 14px 28px; 
            text-decoration: none; 
            font-weight: bold; 
            font-size: 12px; 
            letter-spacing: 0.1em; 
            text-transform: uppercase; 
            margin-top: 10px; 
            border-radius: 0;
        }
        .scanline { 
            height: 2px; 
            width: 100%; 
            background: repeating-linear-gradient(90deg, #f97316 0%, #f97316 50%, transparent 50%, transparent 100%); 
            background-size: 10px 100%; 
            opacity: 0.3; 
            margin-bottom: 20px; 
        }
        .pulse { 
            animation: pulse 2s infinite; 
        }
        @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">QORE // LABS</div>
        </div>
        <div class="content">
            <div class="scanline pulse"></div>
            <div class="badge">System Access :: Granted</div>
            <h1>Initiation Sequence Complete.</h1>
            <p>Welcome to the node network. Your request for early access has been <span class="highlight">successfully registered</span> on the sequence chain.</p>
            <p>Lumeo is dismantling the friction of legacy banking, building a wallet-native, non-custodial protocol where money moves at the speed of data.</p>
            
            <div class="divider"></div>
            
            <div class="data-row">
                <span class="label">Status</span>
                <span class="value">WAITLIST_VERIFIED</span>
            </div>
            <div class="data-row">
                <span class="label">Node ID</span>
                <span class="value">${email.split('@')[0].toUpperCase()}_${Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div class="data-row">
                <span class="label">Confirmation</span>
                <span class="value"><a href="${confirmationUrl}" style="color: #f97316; text-decoration: none;">VERIFY_NOW</a></span>
            </div>
            <div class="data-row">
                <span class="label">Est. Access</span>
                <span class="value">Q3 2026</span>
            </div>
            
            <div class="divider"></div>
            
            <p>Click the verification link above to confirm your position in the protocol queue. This ensures secure transmission of future signals.</p>
            <p>We will transmit further signals as we approach the Genesis Block launch. Stand by for encrypted communications.</p>
            
            <a href="${confirmationUrl}" class="btn">VERIFY ACCESS</a>
        </div>
        <div class="footer">
            QORE LABS <br>
            DECENTRALIZED SETTLEMENT LAYER
        </div>
    </div>
</body>
</html>`
}

export const confirmationEmailTemplate = (email: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumeo Protocol - Verification Complete</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background-color: #000000; 
            font-family: 'Courier New', Courier, monospace; 
            color: #e5e5e5; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #0a0a0a; 
            border: 1px solid #1a1a1a; 
        }
        .header { 
            padding: 40px 20px; 
            border-bottom: 1px solid #10b981; 
            text-align: center; 
            background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 100%); 
        }
        .logo { 
            color: #10b981; 
            font-size: 24px; 
            letter-spacing: 0.3em; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .badge { 
            display: inline-block; 
            background: rgba(16, 185, 129, 0.1); 
            color: #10b981; 
            padding: 6px 12px; 
            border: 1px solid rgba(16, 185, 129, 0.2); 
            font-size: 10px; 
            letter-spacing: 0.2em; 
            margin-bottom: 24px; 
            text-transform: uppercase; 
        }
        h1 { 
            font-size: 28px; 
            font-weight: normal; 
            margin: 0 0 24px 0; 
            letter-spacing: -0.02em; 
            color: #ffffff; 
        }
        p { 
            line-height: 1.8; 
            font-size: 14px; 
            color: #888; 
            margin-bottom: 24px; 
        }
        .highlight { 
            color: #10b981; 
        }
        .footer { 
            padding: 30px; 
            text-align: center; 
            border-top: 1px solid #1a1a1a; 
            font-size: 10px; 
            color: #444; 
            letter-spacing: 0.1em; 
        }
        .scanline { 
            height: 2px; 
            width: 100%; 
            background: repeating-linear-gradient(90deg, #10b981 0%, #10b981 50%, transparent 50%, transparent 100%); 
            background-size: 10px 100%; 
            opacity: 0.3; 
            margin-bottom: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">QORE // LABS</div>
        </div>
        <div class="content">
            <div class="scanline"></div>
            <div class="badge">Verification :: Complete</div>
            <h1>Node Authenticated.</h1>
            <p>Your position in the protocol queue has been <span class="highlight">confirmed and secured</span>.</p>
            <p>You will receive priority access to Lumeo's revolutionary settlement layer when we launch in Q3 2026.</p>
            <p>Stay tuned for exclusive updates, beta access opportunities, and technical previews as we approach the Genesis Block.</p>
        </div>
        <div class="footer">
            QORE LABS <br>
            DECENTRALIZED SETTLEMENT LAYER
        </div>
    </div>
</body>
</html>`
}