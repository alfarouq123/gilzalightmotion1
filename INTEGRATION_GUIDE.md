# 🎬 Integration Guide - PremiumGenerator UI dengan amprem.js

Dokumentasi lengkap cara integrasikan `PremiumGenerator.jsx` dengan plugin `amprem.js` WhatsApp bot Anda.

---

## 📋 Cara Kerja

### Flow Diagram:
```
User Input Email
      ↓
[GENERATE PREMIUM Button]
      ↓
System Create Tempmail ←─── (amprem.js handler)
      ↓
Send Magic Link ←─── (amprem.js handler)
      ↓
Verify Email ←─── (amprem.js handler)
      ↓
Generate Login Link ←─── (amprem.js handler)
      ↓
Display Kode + Link ←─── UI Component
      ↓
User Copy & Login ←─── Manual step
      ↓
Verify with Kode ←─── (back ke amprem.js)
      ↓
✅ PREMIUM ACTIVATED
```

---

## 🔧 Setup Integration

### Step 1: Create API Routes untuk PremiumGenerator

Buat file di `pages/api/amp/generate-premium.js`:

```javascript
import { randomUUID } from 'crypto'

const userSessions = new Map()
const codeDatabase = new Map()

function generateCode() {
  const num = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `IFZ${num}`
}

async function createTempmail(email) {
  try {
    const response = await fetch(
      'https://api.kyzznekoo.my.id/api/tools/tmpmail/v2/create?duration=5',
      { method: 'GET' }
    )
    const data = await response.json()
    return data
  } catch (err) {
    return { status: false, message: err.message }
  }
}

async function sendMagicLink(email) {
  try {
    const response = await fetch(
      `https://am-premium-xiee.vercel.app/api/am?action=send&email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    )
    const data = await response.json()
    return data
  } catch (err) {
    return { status: false, message: err.message }
  }
}

async function checkInbox(tempmail) {
  try {
    const response = await fetch(
      `https://api.kyzznekoo.my.id/api/tools/tmpmail/v2/inbox/${encodeURIComponent(tempmail)}`,
      { method: 'GET' }
    )
    const data = await response.json()
    return data
  } catch (err) {
    return { status: false, message: err.message }
  }
}

function extractLoginLink(content) {
  if (!content) return null
  const decoded = String(content)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  
  const href = decoded.match(/href=['"]([^'"]*(?:alight|firebaseapp|page\.link|app\.link|oobCode)[^'"]*)['"]/i)?.[1]
  if (href?.startsWith('http')) return href.trim()
  
  const raw = decoded.match(/https?:\/\/[^\s"'<>]+/i)?.[0]
  return raw ? raw.trim() : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ status: false, message: 'Email required' })
  }

  try {
    // Step 1: Create temporary email
    const tmpmailRes = await createTempmail(email)
    if (!tmpmailRes.status) {
      return res.status(500).json({ status: false, message: 'Failed to create tempmail' })
    }

    const tempmail = tmpmailRes.data?.email
    const expiresAt = tmpmailRes.data?.expiresAt

    // Step 2: Generate unique code
    let code = generateCode()
    while (codeDatabase.has(code)) {
      code = generateCode()
    }

    // Step 3: Send magic link
    const sendRes = await sendMagicLink(email)
    if (!sendRes.status) {
      return res.status(500).json({ status: false, message: 'Failed to send magic link' })
    }

    // Store session
    codeDatabase.set(code, {
      email,
      tempmail,
      expiresAt,
      code,
      status: 'pending',
      createdAt: Date.now()
    })

    // Step 4: Wait for email & verify
    let loginLink = null
    let attempts = 0
    
    while (attempts < 20 && !loginLink) {
      await new Promise(r => setTimeout(r, 3000))
      
      const inboxRes = await checkInbox(tempmail)
      const inbox = inboxRes?.data?.inbox || inboxRes?.data?.emails || []
      
      const loginEmail = inbox.find(e => 
        /login ke alight/i.test(e.subject || '') || 
        /sign in to alight/i.test(e.subject || '')
      )
      
      if (loginEmail) {
        const content = loginEmail.content || loginEmail.html || loginEmail.body || ''
        loginLink = extractLoginLink(content)
        
        if (loginLink) break
      }
      
      attempts++
    }

    if (!loginLink) {
      return res.status(202).json({
        status: false,
        message: 'Waiting for verification email',
        data: { code, email, status: 'pending' }
      })
    }

    // Success
    const codeData = codeDatabase.get(code)
    codeData.loginLink = loginLink
    codeData.status = 'ready'

    res.status(200).json({
      status: true,
      message: 'Premium account ready',
      data: {
        code,
        email,
        loginLink,
        tempmail,
        expiresAt,
        status: 'ready'
      }
    })

  } catch (err) {
    console.error('[API ERROR]', err)
    res.status(500).json({ status: false, message: err.message })
  }
}
```

### Step 2: Update PremiumGenerator Component

Edit `generatePremium` function untuk call API:

```javascript
const generatePremium = async (inputEmail) => {
  if (!inputEmail.trim()) {
    addNotification('❌ Email tidak boleh kosong', 'error')
    return
  }

  setLoading(true)
  setCurrentProcess({
    email: inputEmail,
    stage: 'creating',
    code: null,
    loginLink: null,
    progress: 25
  })

  try {
    // Call API
    const response = await fetch('/api/amp/generate-premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputEmail })
    })

    const result = await response.json()

    if (!result.status) {
      addNotification(`❌ ${result.message}`, 'error')
      setLoading(false)
      setCurrentProcess(null)
      return
    }

    // Update dengan response dari API
    setCurrentProcess(prev => ({
      ...prev,
      stage: 'sending',
      progress: 50
    }))

    await new Promise(r => setTimeout(r, 1000))

    setCurrentProcess(prev => ({
      ...prev,
      stage: 'verifying',
      progress: 75
    }))

    await new Promise(r => setTimeout(r, 2000))

    setCurrentProcess(prev => ({
      ...prev,
      stage: 'ready',
      code: result.data.code,
      loginLink: result.data.loginLink,
      progress: 100
    }))

    setCountdownSeconds(300)

    // Add ke generated accounts
    const newAccount = {
      id: Date.now(),
      email: inputEmail,
      code: result.data.code,
      loginLink: result.data.loginLink,
      createdAt: new Date(),
      status: 'ready',
      tempmail: result.data.tempmail
    }

    setGeneratedAccounts([newAccount, ...generatedAccounts])
    addNotification(`✨ ${result.data.code} siap digunakan!`, 'success')
    setEmail('')
    setLoading(false)

  } catch (err) {
    addNotification(`❌ Error: ${err.message}`, 'error')
    setLoading(false)
    setCurrentProcess(null)
  }
}
```

---

## 🔗 Hubungkan dengan amprem.js WhatsApp Bot

### Option 1: Direct API Integration

Di bot handler, integrate dengan API route:

```javascript
// Di amprem.js handler
import fetch from 'node-fetch'

async function generatePremiumViaUI(userEmail) {
  try {
    const response = await fetch('http://localhost:3000/api/amp/generate-premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })

    const data = await response.json()
    return data
  } catch (err) {
    return { status: false, message: err.message }
  }
}
```

### Option 2: Share Code Database

Gunakan database yang sama untuk sync antara UI dan bot:

```javascript
// Database shared (bisa pakai Redis, MongoDB, atau file-based)

class PremiumDatabase {
  constructor() {
    this.codes = new Map() // {code: {email, status, loginLink, ...}}
  }

  saveCode(code, data) {
    this.codes.set(code, { ...data, createdAt: Date.now() })
  }

  getCode(code) {
    return this.codes.get(code)
  }

  getAllCodes() {
    return Array.from(this.codes.values())
  }

  updateCodeStatus(code, status) {
    const data = this.codes.get(code)
    if (data) data.status = status
  }
}

export const db = new PremiumDatabase()
```

---

## 📊 Status Lifecycle

```
┌─────────────────────────────────────────┐
│          PENDING                        │
│  ✓ Kode created                         │
│  ✓ Magic link sent                      │
│  ✗ Login email belum verified           │
└─────────────────────────────────────────┘
              ↓ (email verified)
┌─────────────────────────────────────────┐
│          READY                          │
│  ✓ Kode created                         │
│  ✓ Magic link sent                      │
│  ✓ Login link ready                     │
│  ✗ User belum verifikasi                │
└─────────────────────────────────────────┘
              ↓ (user verify)
┌─────────────────────────────────────────┐
│          CLAIMED                        │
│  ✓ All steps done                       │
│  ✓ Account premium activated            │
│  ✓ Kode used                            │
└─────────────────────────────────────────┘
```

---

## 🚀 Deployment Setup

### For Vercel:

```bash
# 1. Deploy ke Vercel
vercel --prod

# 2. Set environment variables di Vercel dashboard
TMPMAIL_API=https://api.kyzznekoo.my.id/api/tools/tmpmail/v2
ALIGHT_API=https://am-premium-xiee.vercel.app/api/am

# 3. Update API calls dengan production URL
# http://localhost:3000 → https://yourdomain.vercel.app
```

### For Self-hosted:

```bash
# 1. Update .env.local
NEXT_PUBLIC_API_URL=https://your-domain.com
TMPMAIL_API=https://api.kyzznekoo.my.id/api/tools/tmpmail/v2
ALIGHT_API=https://am-premium-xiee.vercel.app/api/am

# 2. Build
npm run build

# 3. Start
npm start

# 4. Expose dengan Nginx/Apache (HTTPS required)
```

---

## 🔍 Testing

### Test Email Submission:

```bash
curl -X POST http://localhost:3000/api/amp/generate-premium \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Expected Response:

```json
{
  "status": true,
  "message": "Premium account ready",
  "data": {
    "code": "IFZ1234",
    "email": "test@example.com",
    "loginLink": "https://alight...",
    "status": "ready"
  }
}
```

---

## ⚠️ Common Issues & Solutions

### "Failed to create tempmail"
- Cek tmpmail API status
- Check network connectivity
- Verify API endpoint masih aktif

### "Waiting for verification email"
- Email belum sampai ke tempmail
- Tunggu lebih lama (adjust timeout)
- Cek apakah email benar ter-send

### "Login link not found"
- Email diterima tapi link tidak ter-extract
- Coba manual open tempmail inbox
- Check regex pattern untuk extract link

### "Timeout on verification"
- Increase attempts loop (default 20)
- Increase wait time antara polling (default 3s)
- Check apakah system overloaded

---

## 📝 Monitoring

Track premium generation:

```javascript
// Di component atau API
const logPremiumGeneration = (email, code, status) => {
  console.log(`[PREMIUM] ${new Date().toISOString()} | ${email} | ${code} | ${status}`)
  
  // Or save ke database
  // db.savePremiumLog({ email, code, status, timestamp: Date.now() })
}
```

---

## 🎯 Next Steps

1. ✅ Copy `PremiumGenerator.jsx` ke components
2. ✅ Copy API route ke pages/api/amp/
3. ✅ Update imports di pages/index.js
4. ✅ Test locally
5. ✅ Deploy ke GitHub
6. ✅ Deploy ke Vercel/VPS
7. ✅ Monitor & maintain

---

**By gilz** 🎬✨
