# GitHub Setup Guide - Alight Motion Premium Dashboard

Panduan lengkap untuk setup & manage project di GitHub.

---

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Buka [github.com/new](https://github.com/new)
2. **Repository name:** `alight-motion-dashboard` (atau nama lain)
3. **Description:** `Premium Alight Motion Account Generator Dashboard by gilz`
4. **Visibility:** Private (jika project pribadi) atau Public
5. Klik **Create Repository**

### 2. Push Project ke GitHub

```bash
# 1. Navigate ke project directory
cd /path/to/alight-motion-dashboard

# 2. Initialize git (jika belum ada)
git init

# 3. Add semua files
git add .

# 4. Create initial commit
git commit -m "🎬 Initial commit: Alight Motion Premium Dashboard by gilz"

# 5. Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/alight-motion-dashboard.git

# 6. Rename branch ke main (jika masih master)
git branch -M main

# 7. Push ke GitHub
git push -u origin main
```

✅ **Done!** Project sekarang tersimpan di GitHub

---

## 📁 GitHub Repository Structure

```
alight-motion-dashboard/
├── .github/
│   └── workflows/          (GitHub Actions - optional)
├── pages/
│   ├── index.js           (Main page)
│   └── api/
│       └── amp/           (API endpoints)
├── components/
│   └── alight-premium-dashboard.jsx
├── styles/
│   └── globals.css
├── public/                (Static files - optional)
├── .env.example           (Template environment vars)
├── .gitignore             (Git ignore patterns)
├── package.json
├── tailwind.config.js
├── next.config.js
├── vercel.json
├── README.md
├── GITHUB_SETUP.md        (This file)
└── LICENSE                (Optional)
```

---

## 🔄 Daily Workflow

### Clone Repository (untuk device lain)
```bash
git clone https://github.com/YOUR_USERNAME/alight-motion-dashboard.git
cd alight-motion-dashboard
npm install
npm run dev
```

### Commit & Push Changes
```bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "✨ Add new feature: real-time sync"

# 4. Push to GitHub
git push origin main
```

### Pull Latest Changes (dari GitHub)
```bash
git pull origin main
```

---

## 🌳 Branch Management (Optional)

Untuk project yang lebih terstruktur, gunakan multiple branches:

```bash
# Create feature branch
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request di GitHub
# Merge ke main setelah review

# Delete branch setelah merge
git branch -d feature/new-feature
```

---

## 🔐 Security & Best Practices

### 1. Never Commit Secrets!
```bash
# ✅ DO: Add ke .gitignore
echo ".env.local" >> .gitignore
echo "secrets.json" >> .gitignore

# ❌ DON'T: Push credentials
# git push origin main  # jangan push file .env!
```

### 2. Use .env.example sebagai Template
```bash
# Users bisa copy & customize
cp .env.example .env.local
# Modify dengan values mereka
```

### 3. Commit Message Best Practices
```bash
# Format: <emoji> <type>: <description>

✨ feature: add real-time sync
🐛 bugfix: fix countdown timer issue
📚 docs: update README
🎨 style: update color scheme
⚡ performance: optimize API calls
🔒 security: add input validation
```

---

## 🚢 Deployment dari GitHub

### Option A: Self-hosted VPS/Server

```bash
# SSH ke server
ssh user@your-server.com

# Clone repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/alight-motion-dashboard.git

# Install & setup
cd alight-motion-dashboard
npm install
cp .env.example .env.local
# Edit .env.local dengan production values

# Build & start
npm run build
pm2 start npm --name "alight-dashboard" -- start
```

### Option B: Using PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'alight-dashboard',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://your-domain.com'
      }
    }
  ]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Setup auto-restart on server reboot
pm2 startup
pm2 save
```

### Option C: Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Deploy:
```bash
docker build -t alight-dashboard .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-domain.com \
  alight-dashboard
```

### Option D: Vercel (Khusus Project AI)

```bash
# Hanya jika untuk project AI khusus:

# 1. Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# Atau connect GitHub repo di vercel.com dashboard
```

---

## 📊 Monitoring & Maintenance

### Keep Dependencies Updated
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# For major version updates
npx npm-check-updates -u
npm install
```

### Regular Commits
```bash
# Commit regularly, jangan tunggu terlalu lama
git commit -m "Update: fix bug in timer logic"
git push origin main
```

### Backup
```bash
# GitHub sudah backup di cloud
# Tapi bisa juga backup lokal:
zip -r backup-$(date +%Y%m%d).zip .
```

---

## 🤝 Collaboration (Jika Multi-user)

### Add Collaborators
1. GitHub repo → Settings → Collaborators
2. Invite users dengan email
3. Set permissions (Pull/Push/Admin)

### Pull Requests for Review
```bash
# Create feature branch
git checkout -b feature/awesome-feature

# Make changes & commit
git add .
git commit -m "✨ Add awesome feature"

# Push branch
git push origin feature/awesome-feature

# Create Pull Request di GitHub UI
# Request review from team
# Merge setelah approved
```

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
cd /path/to/project
git init
git remote add origin https://github.com/YOUR_USERNAME/repo.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add ke GitHub
# Settings → SSH and GPG keys → New SSH key
# Paste content dari ~/.ssh/id_ed25519.pub

# Test connection
ssh -T git@github.com
```

### "Changes not staged for commit"
```bash
# Check what changed
git status

# Add changes
git add .

# Commit
git commit -m "Update files"

# Push
git push origin main
```

### "Error: Updates were rejected"
```bash
# Biasanya karena GitHub punya changes yang belum di-pull
git pull origin main
# Resolve conflicts jika ada
git push origin main
```

---

## 📌 Important Files to Know

- **`.gitignore`** - File/folder yang tidak di-push ke GitHub
- **`.env.example`** - Template untuk environment variables
- **`README.md`** - Project documentation
- **`package.json`** - Dependencies & scripts
- **`next.config.js`** - Next.js configuration

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push project files
3. ✅ Setup environment variables (.env.local)
4. ✅ Test locally (`npm run dev`)
5. ✅ Setup production server
6. ✅ Configure domain/DNS
7. ✅ Setup SSL certificate (HTTPS)
8. ✅ Monitor & maintain

---

**Happy coding! 🚀 - by gilz**
