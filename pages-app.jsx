/**
 * Next.js Page Wrapper untuk Alight Motion Premium Dashboard
 * File ini ditempatkan di: pages/index.js (untuk Next.js)
 * atau standalone di app root (untuk Vercel deployment)
 * By gilz
 */

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Import komponen dashboard
const AMP = dynamic(() => import('@/components/alight-premium-dashboard'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300">Loading Dashboard...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div>
      <head>
        <title>Alight Motion Premium - Dashboard</title>
        <meta name="description" content="Generate and manage Alight Motion premium accounts with advanced dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0e27" />
      </head>
      <AMP />
    </div>
  )
}
