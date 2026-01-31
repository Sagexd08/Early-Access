export const welcomeEmailTemplate = (email: string, confirmationToken: string) => {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`
  const nodeId = `${email.split('@')[0].toUpperCase()}_${Date.now().toString(36).toUpperCase()}`
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumeo Protocol - Access Granted</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%); 
            font-family: 'JetBrains Mono', 'Courier New', monospace; 
            color: #e5e5e5; 
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%); 
            border: 1px solid #1a1a1a; 
            box-shadow: 0 0 50px rgba(249, 115, 22, 0.1);
            position: relative;
            overflow: hidden;
        }
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #f97316, transparent);
            animation: scan 3s linear infinite;
        }
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .header { 
            padding: 50px 30px 40px; 
            border-bottom: 1px solid rgba(249, 115, 22, 0.3); 
            text-align: center; 
            background: radial-gradient(circle at center, rgba(249, 115, 22, 0.08) 0%, transparent 70%); 
            position: relative;
        }
        .logo { 
            color: #f97316; 
            font-size: 28px; 
            letter-spacing: 0.4em; 
            font-weight: 700; 
            text-transform: uppercase; 
            text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
            margin-bottom: 8px;
        }
        .tagline {
            font-size: 11px;
            color: #666;
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }
        .content { 
            padding: 50px 40px; 
            position: relative;
        }
        .status-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            margin-right: 12px;
            animation: pulse-dot 2s infinite;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }
        @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
        }
        .badge { 
            display: inline-block; 
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05)); 
            color: #f97316; 
            padding: 8px 16px; 
            border: 1px solid rgba(249, 115, 22, 0.3); 
            font-size: 10px; 
            letter-spacing: 0.2em; 
            text-transform: uppercase; 
            font-weight: 500;
            border-radius: 2px;
        }
        h1 { 
            font-size: 32px; 
            font-weight: 500; 
            margin: 30px 0; 
            letter-spacing: -0.02em; 
            color: #ffffff; 
            text-align: center;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }
        .intro-text { 
            line-height: 1.8; 
            font-size: 15px; 
            color: #aaa; 
            margin-bottom: 30px; 
            text-align: center;
        }
        .highlight { 
            color: #fff; 
            font-weight: 500;
        }
        .accent { 
            color: #f97316; 
            font-weight: 500;
        }
        .data-panel {
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(10, 10, 10, 0.9));
            border: 1px solid #2a2a2a;
            padding: 25px;
            margin: 30px 0;
            border-radius: 4px;
            position: relative;
        }
        .data-panel::before {
            content: 'NODE REGISTRATION DATA';
            position: absolute;
            top: -8px;
            left: 20px;
            background: #0a0a0a;
            color: #666;
            font-size: 9px;
            letter-spacing: 0.2em;
            padding: 0 8px;
        }
        .data-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 15px; 
            font-size: 13px; 
            padding: 8px 0;
            border-bottom: 1px solid rgba(42, 42, 42, 0.5);
        }
        .data-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .label { 
            color: #666; 
            letter-spacing: 0.1em; 
            text-transform: uppercase; 
            font-size: 11px;
            font-weight: 500;
        }
        .value { 
            color: #f97316; 
            font-family: 'JetBrains Mono', monospace; 
            font-weight: 500;
            text-align: right;
        }
        .value a {
            color: #f97316;
            text-decoration: none;
            border-bottom: 1px solid rgba(249, 115, 22, 0.3);
            transition: all 0.3s ease;
        }
        .value a:hover {
            border-bottom-color: #f97316;
        }
        .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%);
            border-radius: 4px;
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #f97316, #ea580c); 
            color: #000; 
            padding: 16px 32px; 
            text-decoration: none; 
            font-weight: 700; 
            font-size: 12px; 
            letter-spacing: 0.15em; 
            text-transform: uppercase; 
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
            transition: all 0.3s ease;
            border: 1px solid #f97316;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(249, 115, 22, 0.4);
        }
        .security-note {
            background: rgba(16, 185, 129, 0.05);
            border: 1px solid rgba(16, 185, 129, 0.2);
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #888;
        }
        .security-note .icon {
            color: #10b981;
            margin-right: 8px;
        }
        .footer { 
            padding: 40px 30px; 
            text-align: center; 
            border-top: 1px solid rgba(26, 26, 26, 0.8); 
            font-size: 11px; 
            color: #444; 
            letter-spacing: 0.1em; 
            background: linear-gradient(180deg, transparent, rgba(10, 10, 10, 0.5));
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: #666;
            text-decoration: none;
            margin: 0 10px;
            font-size: 10px;
            letter-spacing: 0.1em;
            transition: color 0.3s ease;
        }
        .social-links a:hover {
            color: #f97316;
        }
        .grid-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="grid-bg"></div>
        <div class="header">
            <div class="logo">LUMEO</div>
            <div class="tagline">Decentralized Settlement Protocol</div>
        </div>
        <div class="content">
            <div class="status-indicator">
                <div class="status-dot"></div>
                <div class="badge">System Access :: Granted</div>
            </div>
            
            <h1>Welcome to the Network</h1>
            
            <p class="intro-text">
                Your request for early access has been <span class="highlight">successfully registered</span> 
                in our protocol queue. You're now part of an exclusive group building the future of 
                <span class="accent">decentralized finance</span>.
            </p>
            
            <div class="data-panel">
                <div class="data-row">
                    <span class="label">Status</span>
                    <span class="value">WAITLIST_VERIFIED</span>
                </div>
                <div class="data-row">
                    <span class="label">Node ID</span>
                    <span class="value">${nodeId}</span>
                </div>
                <div class="data-row">
                    <span class="label">Email</span>
                    <span class="value">${email}</span>
                </div>
                <div class="data-row">
                    <span class="label">Priority Level</span>
                    <span class="value">EARLY_ACCESS</span>
                </div>
                <div class="data-row">
                    <span class="label">Est. Launch</span>
                    <span class="value">Q3 2026</span>
                </div>
            </div>
            
            <div class="security-note">
                <span class="icon">🔒</span>
                <strong>Security Notice:</strong> Please verify your email address to secure your position 
                in the protocol queue and ensure you receive all future communications.
            </div>
            
            <div class="cta-section">
                <p style="margin-bottom: 20px; color: #aaa; font-size: 14px;">
                    Click below to confirm your registration and activate your early access status.
                </p>
                <a href="${confirmationUrl}" class="btn">Verify Email Address</a>
            </div>
            
            <p style="font-size: 13px; color: #666; text-align: center; margin-top: 30px;">
                We'll keep you updated with exclusive previews, technical insights, and beta access 
                opportunities as we approach launch. Stay tuned for encrypted communications.
            </p>
        </div>
        <div class="footer">
            <div>LUMEO PROTOCOL</div>
            <div style="margin-top: 5px;">Building the Future of Decentralized Settlement</div>
            <div class="social-links">
                <a href="#">Twitter</a>
                <a href="#">Discord</a>
                <a href="#">GitHub</a>
                <a href="#">Documentation</a>
            </div>
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