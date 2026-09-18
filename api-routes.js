/**
 * API Routes untuk Alight Motion Premium Dashboard
 * Integrasi dengan sistem dari amprem.js
 * Built by gilz
 */

// ═══════════════ SESSION & CODE STORAGE ═══════════════
class PremiumManager {
  constructor() {
    this.userSessions = new Map()
    this.codeDatabase = new Map()
    this.accountHistory = []
  }

  generateCode() {
    const num = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return `IFZ${num}`
  }

  createSession(userId, email, tempmail, expiresAt) {
    let code = this.generateCode()

    // Ensure unique code
    while (this.codeDatabase.has(code)) {
      code = this.generateCode()
    }

    const session = {
      email,
      tempmail,
      expiresAt,
      code,
      step: 1,
      createdAt: Date.now(),
    }

    this.userSessions.set(userId, session)

    const codeData = {
      userId,
      email,
      tempmail,
      expiresAt,
      loginLink: null,
      used: false,
      createdAt: Date.now(),
      status: 'pending'
    }

    this.codeDatabase.set(code, codeData)

    // Track history
    this.accountHistory.push({
      code,
      email,
      timestamp: Date.now(),
      status: 'created'
    })

    return { code, email, expiresAt }
  }

  getSession(userId) {
    return this.userSessions.get(userId)
  }

  getCodeData(code) {
    return this.codeDatabase.get(code)
  }

  updateCodeStatus(code, status, loginLink = null) {
    const data = this.codeDatabase.get(code)
    if (data) {
      data.status = status
      if (loginLink) data.loginLink = loginLink
      data.updatedAt = Date.now()

      // Update history
      this.accountHistory.push({
        code,
        timestamp: Date.now(),
        status
      })
    }
    return data
  }

  markCodeUsed(code) {
    const data = this.codeDatabase.get(code)
    if (data) {
      data.used = true
      data.usedAt = Date.now()
      data.status = 'claimed'
    }
  }

  isCodeExpired(code) {
    const data = this.codeDatabase.get(code)
    if (!data) return true

    const expiresAt = data.expiresAt ? new Date(data.expiresAt).getTime() : data.createdAt + 5 * 60 * 1000
    return Date.now() > expiresAt
  }

  getAllAccounts() {
    return Array.from(this.codeDatabase.values()).map(data => ({
      code: Array.from(this.codeDatabase.entries()).find(([k, v]) => v === data)?.[0],
      ...data,
      isExpired: this.isCodeExpired(Array.from(this.codeDatabase.entries()).find(([k, v]) => v === data)?.[0])
    }))
  }

  getStats() {
    const all = this.getAllAccounts()
    return {
      total: all.length,
      pending: all.filter(a => a.status === 'pending').length,
      active: all.filter(a => a.status === 'active').length,
      claimed: all.filter(a => a.status === 'claimed').length,
      expired: all.filter(a => a.isExpired).length
    }
  }
}

// ═══════════════ API HANDLER ═══════════════

const manager = new PremiumManager()

// API: Generate new account
export async function generatePremiumAccount(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ status: false, message: 'Method not allowed' })
    }

    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ status: false, message: 'Missing userId' })
    }

    // Check existing active session
    const existing = manager.getSession(userId)
    if (existing && Date.now() - existing.createdAt < 300000) {
      return res.status(200).json({
        status: true,
        message: 'Active session found',
        data: {
          code: existing.code,
          email: existing.email,
          expiresAt: existing.expiresAt
        }
      })
    }

    // Create new tempmail (integrate with tmpmail API)
    const tmpmailRes = await fetch('https://api.kyzznekoo.my.id/api/tools/tmpmail/v2/create?duration=5')
    const tmpmailData = await tmpmailRes.json()

    if (!tmpmailData.status) {
      return res.status(500).json({ status: false, message: 'Failed to create tempmail' })
    }

    const email = tmpmailData.data?.email
    const expiresAt = tmpmailData.data?.expiresAt

    // Send magic link
    const sendRes = await fetch('https://am-premium-xiee.vercel.app/api/am', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)'
      }
    })

    // Create session
    const sessionData = manager.createSession(userId, email, email, expiresAt)

    res.status(200).json({
      status: true,
      message: 'Premium account generated successfully',
      data: sessionData
    })
  } catch (err) {
    console.error('[API ERROR]', err)
    res.status(500).json({ status: false, message: err.message })
  }
}

// API: Verify code and get login link
export async function verifyPremiumCode(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ status: false, message: 'Method not allowed' })
    }

    const { code } = req.body

    if (!code) {
      return res.status(400).json({ status: false, message: 'Missing code' })
    }

    const codeData = manager.getCodeData(code)

    if (!codeData) {
      return res.status(404).json({ status: false, message: 'Code not found' })
    }

    if (manager.isCodeExpired(code)) {
      return res.status(410).json({ status: false, message: 'Code expired' })
    }

    if (codeData.used) {
      return res.status(409).json({ status: false, message: 'Code already used' })
    }

    // Check inbox for login email
    const inboxRes = await fetch(`https://api.kyzznekoo.my.id/api/tools/tmpmail/v2/inbox/${encodeURIComponent(codeData.email)}`)
    const inboxData = await inboxRes.json()

    const inbox = inboxData?.data?.inbox || inboxData?.data?.emails || []
    const loginEmail = inbox.find(e => /login ke alight/i.test(e.subject || ''))

    if (!loginEmail) {
      manager.updateCodeStatus(code, 'pending')
      return res.status(202).json({
        status: false,
        message: 'Waiting for login verification email',
        data: { code, email: codeData.email, status: 'pending' }
      })
    }

    // Extract login link
    const content = loginEmail.content || loginEmail.html || ''
    const loginLink = extractLoginLink(content)

    if (!loginLink) {
      return res.status(500).json({ status: false, message: 'Login link not found' })
    }

    manager.updateCodeStatus(code, 'active', loginLink)
    manager.markCodeUsed(code)

    res.status(200).json({
      status: true,
      message: 'Login link ready',
      data: {
        code,
        email: codeData.email,
        loginLink,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    })
  } catch (err) {
    console.error('[VERIFY ERROR]', err)
    res.status(500).json({ status: false, message: err.message })
  }
}

// API: Get all accounts
export async function getAllAccounts(req, res) {
  try {
    const accounts = manager.getAllAccounts()
    const stats = manager.getStats()

    res.status(200).json({
      status: true,
      data: {
        accounts,
        stats
      }
    })
  } catch (err) {
    console.error('[GET ACCOUNTS ERROR]', err)
    res.status(500).json({ status: false, message: err.message })
  }
}

// API: Get stats
export async function getStats(req, res) {
  try {
    const stats = manager.getStats()
    res.status(200).json({ status: true, data: stats })
  } catch (err) {
    res.status(500).json({ status: false, message: err.message })
  }
}

// API: Check code status
export async function checkCodeStatus(req, res) {
  try {
    const { code } = req.query

    if (!code) {
      return res.status(400).json({ status: false, message: 'Missing code' })
    }

    const codeData = manager.getCodeData(code)

    if (!codeData) {
      return res.status(404).json({ status: false, message: 'Code not found' })
    }

    const isExpired = manager.isCodeExpired(code)

    res.status(200).json({
      status: true,
      data: {
        code,
        status: codeData.status,
        email: codeData.email,
        used: codeData.used,
        isExpired,
        createdAt: codeData.createdAt,
        usedAt: codeData.usedAt,
        loginLink: codeData.loginLink
      }
    })
  } catch (err) {
    res.status(500).json({ status: false, message: err.message })
  }
}

// ═══════════════ UTILITY FUNCTIONS ═══════════════

function decodeHtml(content = '') {
  return String(content)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractLoginLink(content) {
  if (!content) return null

  const decoded = decodeHtml(content)

  // Try to find Alight/Firebase link
  const href = decoded.match(/href=['"]([^'"]*(?:alight|firebaseapp|page\.link|app\.link|oobCode)[^'"]*)['"]/i)?.[1]
  if (href?.startsWith('http')) return href.trim()

  // Fallback to any http link
  const raw = decoded.match(/https?:\/\/[^\s"'<>]+/i)?.[0]
  return raw ? raw.trim() : null
}

// ═══════════════ VERCEL ROUTES EXPORT ═══════════════

export const config = {
  runtime: 'nodejs'
}

// Main handler for Vercel
export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  // Route handlers
  if (pathname === '/api/amp/generate' && req.method === 'POST') {
    return generatePremiumAccount(req, res)
  }

  if (pathname === '/api/amp/verify' && req.method === 'POST') {
    return verifyPremiumCode(req, res)
  }

  if (pathname === '/api/amp/accounts' && req.method === 'GET') {
    return getAllAccounts(req, res)
  }

  if (pathname === '/api/amp/stats' && req.method === 'GET') {
    return getStats(req, res)
  }

  if (pathname === '/api/amp/status' && req.method === 'GET') {
    return checkCodeStatus(req, res)
  }

  res.status(404).json({ status: false, message: 'Route not found' })
}
