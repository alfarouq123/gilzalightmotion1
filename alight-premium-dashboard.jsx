import React, { useState, useEffect, useRef } from 'react'
import { Copy, Zap, CheckCircle, Clock, AlertCircle, RefreshCw, Mail } from 'lucide-react'

const AMP = () => {
  const [accounts, setAccounts] = useState([])
  const [generating, setGenerating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentCode, setCurrentCode] = useState(null)
  const [currentEmail, setCurrentEmail] = useState(null)
  const [countdownSeconds, setCountdownSeconds] = useState(0)
  const [notifications, setNotifications] = useState([])
  const countdownRef = useRef(null)

  // Countdown timer
  useEffect(() => {
    if (countdownSeconds <= 0) return
    
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdownSeconds])

  // Format countdown
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Generate new account
  const generateAccount = async () => {
    setGenerating(true)
    
    try {
      // Simulating API call - replace dengan real endpoint
      await new Promise(r => setTimeout(r, 2000))
      
      const code = `IFZ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      const mockEmails = [
        `user${Math.floor(Math.random() * 9999)}@tempmail.io`,
        `creator${Math.floor(Math.random() * 9999)}@mailbox.dev`,
        `alight${Math.floor(Math.random() * 9999)}@inbox.cf`
      ]
      const email = mockEmails[Math.floor(Math.random() * mockEmails.length)]
      
      const newAccount = {
        id: Date.now(),
        code,
        email,
        status: 'pending', // pending, active, claimed
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        loginAttempts: 0
      }

      setAccounts([newAccount, ...accounts])
      setCurrentCode(code)
      setCurrentEmail(email)
      setCountdownSeconds(300) // 5 menit
      setGenerating(false)
      
      addNotification('success', 'Kode premium berhasil dibuat!')
    } catch (err) {
      addNotification('error', 'Gagal membuat kode. Coba lagi.')
      setGenerating(false)
    }
  }

  const addNotification = (type, message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    addNotification('success', `${label} disalin!`)
  }

  const updateAccountStatus = (id, status) => {
    setAccounts(prev => 
      prev.map(acc => acc.id === id ? { ...acc, status } : acc)
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      active: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
      claimed: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30'
    }
    return colors[status] || colors.pending
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Menunggu Login' },
      active: { bg: 'bg-violet-500/10', text: 'text-violet-400', label: 'Aktif' },
      claimed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Selesai' }
    }
    return badges[status] || badges.pending
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans">
      {/* Grid background effect */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(124, 58, 237, 0.05) 25%, rgba(124, 58, 237, 0.05) 26%, transparent 27%, transparent 74%, rgba(124, 58, 237, 0.05) 75%, rgba(124, 58, 237, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(124, 58, 237, 0.05) 25%, rgba(124, 58, 237, 0.05) 26%, transparent 27%, transparent 74%, rgba(124, 58, 237, 0.05) 75%, rgba(124, 58, 237, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2 pointer-events-none">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-lg backdrop-blur-xl border animate-slide-in pointer-events-auto ${
              notif.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
                : 'bg-red-500/20 border-red-500/30 text-red-100'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-violet-500/10 bg-slate-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Alight Motion Premium
                </h1>
              </div>
              <p className="text-slate-400 text-sm">Generate & manage akun premium dengan cepat</p>
            </div>
            <button
              onClick={generateAccount}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-violet-500/20"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Akun Baru
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-violet-500/20 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Total Akun</p>
              <p className="text-2xl font-bold text-violet-400">{accounts.length}</p>
            </div>
            <div className="bg-slate-800/40 border border-amber-500/20 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Menunggu Login</p>
              <p className="text-2xl font-bold text-amber-400">{accounts.filter(a => a.status === 'pending').length}</p>
            </div>
            <div className="bg-slate-800/40 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Selesai</p>
              <p className="text-2xl font-bold text-emerald-400">{accounts.filter(a => a.status === 'claimed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Current Generation Card - Sticky */}
        {currentCode && (
          <div className="mb-12 sticky top-24 z-40">
            <div className={`bg-gradient-to-br ${getStatusColor('active')} border rounded-xl p-8 backdrop-blur-xl shadow-2xl shadow-violet-500/10`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Kode Premium Tersedia
                  </p>
                  <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text mb-4">
                    {currentCode}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-2">Berlaku dalam:</p>
                  <p className="text-3xl font-mono font-bold text-cyan-400">{formatCountdown(countdownSeconds)}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Email</p>
                  <div className="flex items-center justify-between">
                    <code className="text-violet-300 font-mono text-sm">{currentEmail}</code>
                    <button
                      onClick={() => copyToClipboard(currentEmail, 'Email')}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Langkah Penggunaan</p>
                  <ol className="text-sm space-y-2 text-slate-300">
                    <li>1. Buka aplikasi <strong>Alight Motion / Alight Creative</strong></li>
                    <li>2. Login dengan email di atas</li>
                    <li>3. Tunggu email verifikasi login masuk</li>
                    <li>4. Konfirmasi dengan kode di atas</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(currentCode, 'Kode')}
                  className="flex-1 bg-violet-600/50 hover:bg-violet-600 text-white rounded-lg py-3 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Salin Kode
                </button>
                <button
                  onClick={() => {
                    setCurrentCode(null)
                    setCurrentEmail(null)
                  }}
                  className="px-6 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg py-3 font-semibold transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Grid */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-slate-100">Akun Premium Terbuat ({accounts.length})</h2>
          
          {accounts.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Belum ada akun yang dibuat</p>
              <p className="text-slate-500 text-sm">Klik tombol "Generate Akun Baru" untuk mulai</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {accounts.map((account) => {
                const badge = getStatusBadge(account.status)
                const isExpired = new Date() > account.expiresAt
                
                return (
                  <div
                    key={account.id}
                    className={`bg-gradient-to-br ${getStatusColor(account.status)} border rounded-xl p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-violet-500/5 group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <code className="text-lg font-bold font-mono text-cyan-300 bg-slate-900/40 px-3 py-1 rounded">
                            {account.code}
                          </code>
                          <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
                            {badge.label}
                          </span>
                          {isExpired && (
                            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                              Expired
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 break-all">{account.email}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(account.code, 'Kode')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Dibuat: {account.createdAt.toLocaleTimeString('id-ID')}</span>
                      <div className="flex gap-2">
                        {account.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateAccountStatus(account.id, 'active')}
                              className="px-2 py-1 bg-violet-600/50 hover:bg-violet-600 text-white rounded text-xs transition-colors"
                            >
                              Mark Active
                            </button>
                            <button
                              onClick={() => updateAccountStatus(account.id, 'claimed')}
                              className="px-2 py-1 bg-emerald-600/50 hover:bg-emerald-600 text-white rounded text-xs transition-colors"
                            >
                              Selesai
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default AMP
