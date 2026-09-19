# 🎬 Alight Motion Premium Generator

**UI Dashboard untuk generate & premium-in akun Alight Motion dengan input email sederhana.**

> Integrasikan dengan plugin `amprem.js` bot WhatsApp Anda

---

## ✨ Fitur

### Input & Generate
- ✉️ **Email Input** - User input email Alight Motion
- ⚡ **Auto Generate** - Sistem otomatis buat kode & login link
- 🔄 **Real-time Status** - Progress bar 25% → 100%
- ⏱️ **5-Minute Timer** - Countdown untuk kode berlaku

### Account Management
- 📋 **Generated List** - List semua akun yang sudah dibuat
- 📋 **Copy Buttons** - Copy kode & email dengan satu klik
- 🏷️ **Status Tracking** - Pending, Ready, Claimed
- 🗂️ **History** - Simpan riwayat semua akun yang dibuat

### Design & UX
- 🎨 **Modern UI** - Orange/Pink gradient futuristic design
- 🖱️ **Mouse Tracking** - Background light mengikuti cursor
- ✨ **Smooth Animations** - Fade-in, blur effects, transitions
- 📱 **Responsive** - Optimal di semua ukuran layar

---

## 🚀 Quick Start

### 1. Setup Project

```bash
# Extract ZIP
unzip alight-motion-premium-dashboard.zip
cd alight-motion-premium-dashboard

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

### 2. Component Setup

Copy `PremiumGenerator.jsx` ke folder components:

```bash
mkdir -p components
cp PremiumGenerator.jsx components/
```

### 3. Setup Pages

Edit `pages/index.js`:

```javascript
import PremiumGenerator from '@/components/PremiumGenerator'

export default function Home() {
  return <PremiumGenerator />
}
```

### 4. Setup API Route

Copy API route ke `pages/api/amp/`:

```bash
mkdir -p pages/api/amp
cp api-generate-premium.js pages/api/amp/generate-premium.js
```

### 5. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📊 Workflow

```
┌─────────────────────────────────────────┐
│  USER INPUT EMAIL                       │
│  [nama@example.com] → [GENERATE]        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  SYSTEM PROCESS (Progress Bar)          │
│  25% → Creating Code                    │
│  50% → Sending Email                    │
│  75% → Verifying...                     │
│  100% → Ready!                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  DISPLAY RESULT                         │
│  ✓ Code: IFZ1234                        │
│  ✓ Email: nama@example.com              │
│  ✓ Countdown: 5:00                      │
│  ✓ Copy Buttons                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  USER ACTIONS                           │
│  1. Copy kode                           │
│  2. Login Alight Motion                 │
│  3. Wait for verification email         │
│  4. Verify dengan kode                  │
│  5. ✅ PREMIUM ACTIVATED                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  ACCOUNT HISTORY                        │
│  [IFZ1234] [nama@example.com] [Ready]   │
│  [IFZ5678] [user@mail.io] [Claimed]     │
│  [IFZ9012] [other@email.com] [Ready]    │
└─────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Tempmail API
TMPMAIL_API=https://api.kyzznekoo.my.id/api/tools/tmpmail/v2

# Alight Motion API
ALIGHT_API=https://am-premium-xiee.vercel.app/api/am

# Node Environment
NODE_ENV=development
```

### API Route Configuration

Edit `pages/api/amp/generate-premium.js`:

```javascript
// Adjust timeout untuk wait email
const MAX_ATTEMPTS = 20      // berapa kali check inbox
const WAIT_TIME = 3000       // delay antar check (ms)
const TOTAL_TIMEOUT = 60000  // total timeout (ms)
```

---

## 🔌 Integration dengan amprem.js

### Dokumentasi Lengkap

Lihat file `INTEGRATION_GUIDE.md` untuk:
- ✅ Step-by-step integration
- ✅ API route examples
- ✅ Database sharing
- ✅ Status lifecycle
- ✅ Deployment setup
- ✅ Troubleshooting

### Quick Integration

```javascript
// Di amprem.js WhatsApp bot handler
import fetch from 'node-fetch'

async function generatePremiumViaUI(userEmail) {
  const response = await fetch('https://your-domain.com/api/amp/generate-premium', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  })
  
  return response.json()
}
```

---

## 📱 Mobile Responsive

```
Desktop (1024px+)          Mobile (< 640px)
┌──────────────────┐      ┌────────────┐
│   ALIGHT ICON    │      │ ICON       │
│   HEADER TEXT    │      │ HEADER     │
├──────────────────┤      ├────────────┤
│                  │      │            │
│  INPUT FORM      │      │ INPUT      │
│  [Email]         │      │ [Email]    │
│  [GENERATE]      │      │ [GENERATE] │
│                  │      │            │
├──────────────────┤      ├────────────┤
│  PROCESS CARD    │      │ PROCESS    │
│  (saat generate) │      │ (saat gen) │
│                  │      │            │
├──────────────────┤      ├────────────┤
│  ACCOUNTS LIST   │      │ ACCTS LIST │
│  [IFZ1234]       │      │ [IFZ1234]  │
│  [IFZ5678]       │      │ [IFZ5678]  │
└──────────────────┘      └────────────┘
```

---

## 🎨 Customization

### Change Color Scheme

Ganti di `PremiumGenerator.jsx`:

```javascript
// Orange/Pink (default)
from-orange-500 to-pink-500
↓
// Cyan/Blue
from-cyan-500 to-blue-500

// Purple/Violet
from-purple-500 to-violet-500
```

### Change Button Text

```javascript
// GENERATE PREMIUM
<span>GENERATE PREMIUM</span>

// Ganti dengan:
<span>ACTIVATE NOW</span>
```

### Add Custom Branding

```javascript
// Ganti ALIGHT
<h1>YOUR BRAND NAME</h1>

// Ganti atau add logo
<img src="/logo.png" className="w-14 h-14" />
```

---

## 🚀 Deployment

### Option A: Vercel (Recommended)

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "🎬 Premium Generator by gilz"
git remote add origin https://github.com/yourusername/alight-motion-premium.git
git push -u origin main

# 2. Deploy via Vercel Dashboard
# → vercel.com → New Project → Import GitHub

# 3. Set environment variables di Vercel
TMPMAIL_API=https://api.kyzznekoo.my.id/api/tools/tmpmail/v2
ALIGHT_API=https://am-premium-xiee.vercel.app/api/am
```

### Option B: Self-hosted VPS

```bash
# 1. SSH ke server
ssh user@your-server.com

# 2. Clone repository
cd /var/www
git clone https://github.com/yourusername/alight-motion-premium.git
cd alight-motion-premium

# 3. Install & build
npm install
npm run build

# 4. Setup .env.local
cp .env.example .env.local
# Edit dengan production values

# 5. Start dengan PM2
npm install -g pm2
pm2 start npm --name "premium-gen" -- start
pm2 startup
pm2 save

# 6. Setup Nginx/Apache untuk HTTPS
# (Configure reverse proxy & SSL)
```

---

## 🧪 Testing

### Test via curl

```bash
curl -X POST http://localhost:3000/api/amp/generate-premium \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Manual Testing Steps

1. Open http://localhost:3000
2. Input test email
3. Click "GENERATE PREMIUM"
4. Watch progress bar
5. Verify kode displayed
6. Copy kode & email
7. Check accounts list

---

## 🐛 Troubleshooting

### "Email tidak boleh kosong"
- Pastikan input field ada isi
- Check format email valid

### "Failed to create tempmail"
- Cek API tmpmail status
- Check internet connection
- Try reload halaman

### "Waiting for verification email"
- Email belum sampai (usually 5-10 detik)
- Increase MAX_ATTEMPTS atau WAIT_TIME
- Check apakah email terkirim

### "Kode tidak muncul"
- Check browser console untuk errors
- Verify API route accessible
- Check environment variables

### "Slow performance"
- Check network latency
- Optimize image assets
- Enable gzip compression

---

## 📊 Performance Metrics

- **Page Load:** < 2s
- **Generate Time:** 10-20s (depend API)
- **Bundle Size:** ~20KB
- **Mobile FCP:** < 3s

---

## 🔐 Security

- ✅ Email validation
- ✅ Rate limiting recommended
- ✅ HTTPS required for production
- ✅ No credentials stored in frontend
- ✅ API keys in environment variables

---

## 📝 File Structure

```
alight-motion-premium/
├── pages/
│   ├── index.js (Main page)
│   └── api/
│       └── amp/
│           └── generate-premium.js (API endpoint)
├── components/
│   └── PremiumGenerator.jsx (Main UI component)
├── styles/
│   └── globals.css
├── .env.example
├── .env.local (git ignored)
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 📚 Documentation

- **INTEGRATION_GUIDE.md** - Integrasi dengan amprem.js
- **GITHUB_SETUP.md** - Setup GitHub & deployment
- **UI_VARIANTS.md** - Alternative UI designs

---

## 🎯 Next Steps

1. ✅ Extract & setup project
2. ✅ Copy component files
3. ✅ Setup API routes
4. ✅ Test locally
5. ✅ Configure amprem.js integration
6. ✅ Deploy ke production
7. ✅ Monitor & maintain

---

## 📞 Support

Buat issue atau PR di GitHub repository.

---

**By gilz** 🎬✨

**Last Updated:** September 2026
