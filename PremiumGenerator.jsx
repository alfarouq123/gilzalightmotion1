import React, { useState, useEffect } from 'react'
import { Copy, Film, Crown, Sparkles, ArrowRight, Check, AlertCircle, Loader, Mail, Clock, Zap } from 'lucide-react'

const PremiumGenerator = () => {
  const [email, setEmail] = useState('')
  const [generatedAccounts, setGeneratedAccounts] = useState([])
  const [currentProcess, setCurrentProcess] = useState(null) // {email, stage, code, loginLink}
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [countdownSeconds, setCountdownSeconds] = useState(0)
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

  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    addNotification('✓ Tersalin!', 'success')
  }

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
      // STEP 1: Create tempmail & generate kode
      await new Promise(r => setTimeout(r, 2000))
      
      const code = `IFZ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      
      setCurrentProcess(prev => ({
        ...prev,
        stage: 'sending',
        code,
        progress: 50
      }))

      // STEP 2: Send magic link
      await new Promise(r => setTimeout(r, 1800))
      
      setCurrentProcess(prev => ({
        ...prev,
        stage: 'verifying',
        progress: 75
      }))

      // STEP 3: Verify & wait for login
      await new Promise(r => setTimeout(r, 2500))

      // STEP 4: Generate login link
      const mockLoginLink = `https://alight-creative.page.link/auth?code=${code}&email=${encodeURIComponent(inputEmail)}`
      
      setCurrentProcess(prev => ({
        ...prev,
        stage: 'ready',
        loginLink: mockLoginLink,
        progress: 100
      }))

      setCountdownSeconds(300) // 5 menit

      // Add ke list
      const newAccount = {
        id: Date.now(),
        email: inputEmail,
        code,
        loginLink: mockLoginLink,
        createdAt: new Date(),
        status: 'ready'
      }

      setGeneratedAccounts([newAccount, ...generatedAccounts])
      addNotification(`✨ ${code} siap digunakan!`, 'success')
      
      // Reset form
      setEmail('')
      setLoading(false)

    } catch (err) {
      addNotification(`❌ Error: ${err.message}`, 'error')
      setLoading(false)
      setCurrentProcess(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generatePremium(email)
  }

  const getStageInfo = (stage) => {
    const stages = {
      creating: { label: 'Membuat Kode...', icon: Sparkles, percent: 25 },
      sending: { label: 'Mengirim Email...', icon: Mail, percent: 50 },
      verifying: { label: 'Verifikasi...', icon: Clock, percent: 75 },
      ready: { label: 'Siap Digunakan!', icon: Check, percent: 100 }
    }
    return stages[stage] || stages.creating
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
            className={`px-6 py-3 backdrop-blur-xl border rounded-lg text-sm font-semibold pointer-events-auto animate-fadeInSlide ${
              notif.type === 'success' 
                ? 'bg-white/[0.08] border-white/20 text-white'
                : 'bg-red-500/20 border-red-500/30 text-red-100'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          
          {/* Header */}
          <div className="text-center mb-20 relative">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
                <Film className="w-14 h-14 text-white relative" />
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                ALIGHT
              </span>
            </h1>
            <p className="text-lg text-white/50 font-light tracking-[0.15em] uppercase">Premium Generator</p>
          </div>

          {/* Current Process Card */}
          {currentProcess && (
            <div className="w-full max-w-3xl mb-16">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/40 to-pink-600/40 rounded-3xl blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-3xl p-10 space-y-8">
                  <div className="absolute -top-5 -right-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full px-6 py-2 flex items-center gap-2 shadow-2xl shadow-orange-500/50">
                    <Crown className="w-5 h-5" />
                    <span className="font-black text-sm tracking-widest">PREMIUM</span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Status Proses</label>
                      <span className="text-sm font-bold text-orange-400">{currentProcess.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500 rounded-full"
                        style={{ width: `${currentProcess.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="text-center">
                    {(() => {
                      const stageInfo = getStageInfo(currentProcess.stage)
                      const Icon = stageInfo.icon
                      return (
                        <div className="flex flex-col items-center gap-3">
                          {currentProcess.stage === 'ready' ? (
                            <Check className="w-12 h-12 text-green-400 animate-pulse" />
                          ) : (
                            <Icon className="w-12 h-12 text-orange-400 animate-spin" />
                          )}
                          <p className="text-lg font-bold text-white">{stageInfo.label}</p>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Details */}
                  {currentProcess.code && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <div>
                        <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-3">Kode Premium</label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover/input:blur-xl opacity-0 group-hover/input:opacity-100 transition-all" />
                          <div className="relative bg-black/40 border border-white/20 rounded-2xl px-6 py-5 flex items-center justify-between group-hover/input:border-orange-400/50 transition-colors">
                            <code className="text-4xl font-black tracking-widest bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                              {currentProcess.code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(currentProcess.code)}
                              className="p-3 hover:bg-white/10 rounded-xl transition-all"
                            >
                              <Copy className="w-6 h-6 text-white/70 hover:text-white" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {currentProcess.stage === 'ready' && (
                        <>
                          <div>
                            <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-3">Email</label>
                            <div className="bg-black/40 border border-white/20 rounded-2xl px-6 py-4">
                              <p className="text-sm text-white/70 font-mono">{currentProcess.email}</p>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] block mb-3">Berlaku</label>
                            <div className="bg-black/40 border border-white/20 rounded-2xl px-6 py-4">
                              <p className="text-3xl font-black text-pink-400 font-mono">{formatCountdown(countdownSeconds)}</p>
                            </div>
                          </div>

                          <div className="space-y-3 pt-3">
                            <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Langkah Selanjutnya</p>
                            <ol className="space-y-2 text-white/70 text-sm">
                              <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                <span>Copy kode di atas</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                <span>Buka Alight Motion dan login dengan email</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                <span>Tunggu email verifikasi masuk</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                <span>Verifikasi dengan kode diatas</span>
                              </li>
                            </ol>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Input Email */}
          {!currentProcess || currentProcess.stage === 'ready' ? (
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-16">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-pink-600/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
                
                <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-2xl border border-white/15 rounded-3xl p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">Email Akun Alight Motion</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@example.com"
                        className="w-full bg-black/40 border border-white/20 focus:border-orange-400/50 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-white/30 font-medium focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="group/btn relative w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-lg group-hover/btn:blur-2xl opacity-60 group-hover/btn:opacity-100 transition-all disabled:opacity-30" />
                    <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 disabled:from-orange-600 disabled:to-pink-600 rounded-2xl px-8 py-4 flex items-center justify-center gap-3 font-black text-white text-lg transition-all disabled:cursor-not-allowed">
                      {loading ? (
                        <>
                          <Loader className="w-6 h-6 animate-spin" />
                          <span>PROCESSING...</span>
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

                  <p className="text-xs text-white/40 text-center">Sistem akan membuat kode dan mengirim email verifikasi otomatis</p>
                </div>
              </div>
            </form>
          ) : null}

          {/* Generated Accounts List */}
          {generatedAccounts.length > 0 && (
            <div className="w-full max-w-3xl">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
                <span>AKUN PREMIUM TERBUAT</span>
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
                {generatedAccounts.map((acc, idx) => (
                  <div key={acc.id} className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-400/30 rounded-2xl p-6 transition-all backdrop-blur-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-1">Akun #{idx + 1}</p>
                        <code className="text-2xl font-black text-orange-400">{acc.code}</code>
                      </div>
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Ready</span>
                    </div>
                    <div className="space-y-2 mb-4 text-sm text-white/60 font-mono">
                      <p className="truncate">{acc.email}</p>
                      <p className="text-xs text-white/40">{acc.createdAt.toLocaleTimeString('id-ID')}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(acc.code)}
                        className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-400/50 rounded-lg px-3 py-2 text-xs font-bold text-orange-300 transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Kode
                      </button>
                      <button
                        onClick={() => copyToClipboard(acc.email)}
                        className="flex-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 hover:border-pink-400/50 rounded-lg px-3 py-2 text-xs font-bold text-pink-300 transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </button>
                    </div>
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

export default PremiumGenerator
