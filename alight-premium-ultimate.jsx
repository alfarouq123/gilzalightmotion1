import React, { useState, useEffect } from 'react'
import { Copy, Film, Crown, Sparkles, ArrowRight, CheckCircle, Clock, Flame, Zap, Target } from 'lucide-react'

const AMP = () => {
  const [accounts, setAccounts] = useState([])
  const [generating, setGenerating] = useState(false)
  const [currentCode, setCurrentCode] = useState(null)
  const [currentEmail, setCurrentEmail] = useState(null)
  const [countdownSeconds, setCountdownSeconds] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (countdownSeconds <= 0) return
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdownSeconds])

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateAccount = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    
    const code = `IFZ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    const email = `user${Math.floor(Math.random() * 99999)}@tempmail.io`
    
    const newAccount = {
      id: Date.now(),
      code,
      email,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }

    setAccounts([newAccount, ...accounts])
    setCurrentCode(code)
    setCurrentEmail(email)
    setCountdownSeconds(300)
    setGenerating(false)
    addNotification('✨ Premium account ready!')
  }

  const addNotification = (message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    addNotification('✓ Copied!')
  }

  const updateStatus = (id, status) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, status } : acc))
    addNotification(`✓ Updated to ${status}`)
  }

  const stats = {
    total: accounts.length,
    pending: accounts.filter(a => a.status === 'pending').length,
    active: accounts.filter(a => a.status === 'active').length,
    claimed: accounts.filter(a => a.status === 'claimed').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      {/* Dynamic Background Light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-orange-600/20 to-pink-600/20 rounded-full blur-3xl transition-transform duration-200"
          style={{
            left: `${mousePos.x - 200}px`,
            top: `${mousePos.y - 200}px`
          }}
        />
      </div>

      {/* Grid Background */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 107, 53, 0.05) 25%, rgba(255, 107, 53, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 107, 53, 0.05) 75%, rgba(255, 107, 53, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 107, 53, 0.05) 25%, rgba(255, 107, 53, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 107, 53, 0.05) 75%, rgba(255, 107, 53, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '60px 60px'
        }} className="absolute inset-0" />
      </div>

      {/* Notifications */}
      <div className="fixed top-8 right-8 z-50 space-y-3 pointer-events-none">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="px-6 py-3 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm font-semibold pointer-events-auto animate-fadeInSlide"
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
                  <Film className="w-14 h-14 text-white relative" />
                </div>
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                ALIGHT
              </span>
            </h1>
            <p className="text-lg text-white/50 font-light tracking-[0.15em] uppercase">Premium Generator</p>
          </div>

          {/* Main Card */}
          {currentCode ? (
            <div className="w-full max-w-3xl mb-20">
              <div className="group relative">
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/40 to-pink-600/40 rounded-3xl blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-3xl p-10 space-y-8">
                  {/* Badge */}
                  <div className="absolute -top-5 -right-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full px-6 py-2 flex items-center gap-2 shadow-2xl shadow-orange-500/50">
                    <Crown className="w-5 h-5" />
                    <span className="font-black text-sm tracking-widest">PREMIUM</span>
                  </div>

                  {/* Code Section */}
                  <div>
                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-4">Your Code</label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover/input:blur-xl opacity-0 group-hover/input:opacity-100 transition-all" />
                      <div className="relative bg-black/40 border border-white/20 rounded-2xl px-6 py-5 flex items-center justify-between group-hover/input:border-orange-400/50 transition-colors">
                        <code className="text-5xl font-black tracking-widest bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                          {currentCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(currentCode)}
                          className="p-3 hover:bg-white/10 rounded-xl transition-all"
                        >
                          <Copy className="w-6 h-6 text-white/70 hover:text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
                  <div>
                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-4">Expires In</label>
                    <div className="bg-black/40 border border-white/20 rounded-2xl px-8 py-6 text-center">
                      <div className="text-6xl font-black tracking-wider text-transparent bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text font-mono">
                        {formatCountdown(countdownSeconds)}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-4">Email</label>
                    <div className="relative group/email">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl blur-lg" />
                      <div className="relative bg-black/40 border border-white/20 rounded-xl px-6 py-4 flex items-center justify-between group-hover/email:border-orange-400/30 transition-colors">
                        <code className="text-sm text-orange-300/80 font-mono break-all">{currentEmail}</code>
                        <button onClick={() => copyToClipboard(currentEmail)} className="p-2 hover:bg-white/10 rounded-lg flex-shrink-0">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Steps</p>
                    <ol className="space-y-3 text-white/70 text-sm">
                      {['Open Alight Motion app', 'Sign in with email above', 'Wait for verification email', 'Confirm with code'].map((step, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Generate Button */}
          <button
            onClick={generateAccount}
            disabled={generating}
            className="group relative mb-20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-lg group-hover:blur-2xl opacity-60 group-hover:opacity-100 transition-all group-disabled:opacity-30" />
            <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 rounded-2xl px-10 py-5 flex items-center gap-3 font-black text-white text-lg transition-all group-disabled:cursor-not-allowed">
              {generating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>GENERATING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>GENERATE PREMIUM</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </div>
          </button>

          {/* Stats Grid */}
          <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { label: 'TOTAL', value: stats.total, color: 'from-orange-500/30 to-orange-600/10 border-orange-400/30' },
              { label: 'PENDING', value: stats.pending, color: 'from-yellow-500/30 to-yellow-600/10 border-yellow-400/30' },
              { label: 'ACTIVE', value: stats.active, color: 'from-red-500/30 to-red-600/10 border-red-400/30' },
              { label: 'CLAIMED', value: stats.claimed, color: 'from-green-500/30 to-green-600/10 border-green-400/30' }
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border rounded-2xl p-6 hover:scale-105 transition-transform cursor-default`}>
                <p className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Accounts List */}
          {accounts.length > 0 && (
            <div className="w-full max-w-5xl">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
                <span>GENERATED ACCOUNTS</span>
              </h2>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-4">
                {accounts.map((acc) => (
                  <div key={acc.id} className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-400/30 rounded-xl p-5 transition-all backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-3">
                      <code className="text-xl font-black text-orange-400">{acc.code}</code>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                          acc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          acc.status === 'active' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {acc.status}
                        </span>
                        <button onClick={() => copyToClipboard(acc.code)} className="p-2 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 break-all font-mono">{acc.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.3s ease-out;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 53, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 53, 0.5);
        }
      `}</style>
    </div>
  )
}

export default AMP
