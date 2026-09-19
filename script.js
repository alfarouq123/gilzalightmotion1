/* ═══════════════════════════════════════════════════════════
   GILZ PREMIUM — Alight Motion Premium Center
   Flow (sama dengan sistem amprem):
   1. tempmail kyzznekoo   → email baru
   2. varhad verif/email   → kirim magic link
   3. poll inbox tempmail  → ambil link firebase
   4. varhad verif/link    → verif akun + AKTIVASI PREMIUM
   5. (opsional) poll lagi → email login dari aplikasi AM
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   ⚙️ KONFIGURASI GOOGLE LOGIN
   Isi dengan OAuth Client ID dari Google Cloud Console.
   Cara (sekali, ±5 menit):
   1. Buka console.cloud.google.com → buat project (apa aja namanya)
   2. APIs & Services → OAuth consent screen → External → isi nama app
      & support email → tambahkan test user kalau perlu
   3. APIs & Services → Credentials → Create Credentials → OAuth Client ID
      → Web application
   4. Authorized JavaScript origins → tambah:  https://gilzalightmotion.my.id
      (dan http://localhost kalau mau tes lokal)
   5. Copy Client ID-nya → tempel di bawah ini.
   Selama kosong, tombol login otomatis pakai mode input email manual.
   ═══════════════════════════════════════════════════════════════ */
window.GILZ_GOOGLE_CLIENT_ID = '' /* contoh: '1234567890-xxxx.apps.googleusercontent.com' */

const API = {
  tmpmail: 'https://api.kyzznekoo.my.id/api/tools/tmpmail/v2',
  amSend: 'https://v2.api-varhad.my.id/tools/amprem/verif/email',
  amVerif: 'https://v2.api-varhad.my.id/tools/amprem/verif/link',
}

const $ = (s) => document.querySelector(s)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ═══════════ util UI ═══════════ */

function toast(text, ok = true) {
  const t = $('#toast')
  t.textContent = text
  t.className = 'toast show ' + (ok ? 'ok' : 'err')
  clearTimeout(t._timer)
  t._timer = setTimeout(() => (t.className = 'toast'), 3200)
}

function setMsg(sel, text, type) {
  const el = $(sel)
  el.className = 'msg ' + (type || '')
  el.textContent = text
}

function busy(btn, on, label) {
  if (!btn) return
  btn.disabled = on
  btn.classList.toggle('loading', on)
  if (label) btn.querySelector('.btn-label').textContent = label
}

/* ═══════════ tabs ═══════════ */

document.querySelectorAll('.tab').forEach((t) => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'))
    document.querySelectorAll('.panel').forEach((x) => x.classList.remove('active'))
    t.classList.add('active')
    $('#panel-' + t.dataset.tab).classList.add('active')
  })
})

/* ═══════════ API layer ═══════════ */

async function fetchJson(url, timeoutMs = 45000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function createTempmail() {
  return fetchJson(`${API.tmpmail}/create?duration=10`)
}

async function sendMagicLink(email) {
  return fetchJson(`${API.amSend}?email=${encodeURIComponent(email)}`)
}

async function checkInbox(email) {
  return fetchJson(`${API.tmpmail}/inbox/${encodeURIComponent(email)}`, 20000)
}

async function verifyLink(email, link) {
  return fetchJson(`${API.amVerif}?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}`, 60000)
}

/* respon varhad: sukses = {status:true, result:{success:true,...}} */
const varhadOk = (r) => Boolean(r?.status && r?.result?.success)
const varhadErr = (r) =>
  r?.result?.error?.error?.message || r?.result?.error?.message || r?.result?.message || r?.message || 'unknown'

function extractPremium(r) {
  const p = r?.result?.premium?.data?.result
  if (!p) return null
  return {
    valid: p.valid === true,
    autoRenewing: p.autoRenewing === true,
    expiry: Number(p.expiryTimeMillis) || 0,
  }
}

/* ═══════════ email helpers ═══════════ */

function decodeHtml(s) {
  const d = document.createElement('textarea')
  d.innerHTML = String(s || '')
  return d.value
}

/* ambil link firebase (magic link / login) dari isi email */
function extractFirebaseLink(content) {
  const html = decodeHtml(content)
  const m =
    html.match(/href="(https?:\/\/[^"]*firebaseapp\.com[^"]*)"/i) ||
    html.match(/href="(https?:\/\/[^"]*(?:alight|oobCode|__\/auth)[^"]*)"/i) ||
    html.match(/(https?:\/\/[^\s"'<>]+firebaseapp[^\s"'<>]+)/i)
  return m ? m[1].trim() : null
}

/* daftar inbox */
function inboxList(r) {
  const arr = r?.data?.inbox || r?.data?.emails || r?.inbox || []
  return Array.isArray(arr) ? arr : []
}

const isLoginEmail = (m) => /login (ke |to )alight creative/i.test(String(m?.subject || ''))
const isMagicEmail = (m) => /sign in to alight creative requested at/i.test(String(m?.subject || ''))

/* ═══════════ kartu hasil ═══════════ */

function fmtDate(ms) {
  if (!ms) return '-'
  return new Date(ms).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function resultCard({ email, premium, note }) {
  const exp = premium?.expiry ? fmtDate(premium.expiry) : null
  return `
  <div class="card result pop">
    <div class="res-check">
      <svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z"/></svg>
    </div>
    <div class="res-badge">✦ PREMIUM AKTIF</div>
    <div class="res-email">${email}</div>
    ${exp ? `<div class="res-exp">berlaku s/d <b>${exp}</b>${premium?.autoRenewing ? ' · auto-renew' : ''}</div>` : ''}
    ${note ? `<div class="res-note">${note}</div>` : ''}
    <button class="btn ghost" onclick="copyEmail(this)" data-email="${email}">
      <span class="btn-label">📋 Copy Email</span>
    </button>
  </div>`
}

window.copyEmail = function (btn) {
  const email = btn.dataset.email
  navigator.clipboard?.writeText(email).then(
    () => toast('Email dicopy: ' + email),
    () => toast('Gagal copy — copy manual ya', false),
  )
}

/* ═══════════ MODE 1: email sendiri ═══════════ */

$('#own-send').addEventListener('click', async () => {
  const email = $('#own-email').value.trim()
  const msgSel = '#own-msg'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return setMsg(msgSel, '⚠️ Email-nya belum valid — cek lagi formatnya.', 'warn')
  }

  busy($('#own-send'), true, 'Mengirim...')
  setMsg(msgSel, '⏳ Mengirim magic link ke ' + email + '...', '')

  try {
    const r = await sendMagicLink(email)
    if (!varhadOk(r)) throw new Error(varhadErr(r))

    busy($('#own-send'), false, 'Kirim Ulang')
    setMsg(msgSel, '✅ Magic link terkirim! Cek inbox email kamu (cek folder spam juga).', 'ok')
    $('#own-step2').classList.remove('hidden')
    $('#own-step2').scrollIntoView({ behavior: 'smooth', block: 'center' })
    toast('Magic link terkirim ✓')
  } catch (e) {
    busy($('#own-send'), false, 'Kirim Magic Link')
    const m = e.message || ''
    if (/INVALID_IDENTIFIER/i.test(m)) setMsg(msgSel, '❌ Email ditolak server. Coba email lain.', 'err')
    else if (/abort/i.test(m)) setMsg(msgSel, '❌ Timeout — server lama merespon. Coba lagi.', 'err')
    else setMsg(msgSel, '❌ Gagal: ' + m, 'err')
  }
})

$('#own-activate').addEventListener('click', async () => {
  const email = $('#own-email').value.trim()
  const link = $('#own-link').value.trim()
  const msgSel = '#own-msg2'

  if (!link.startsWith('http')) {
    return setMsg(msgSel, '⚠️ Link-nya belum lengkap — harus diawali https://', 'warn')
  }

  busy($('#own-activate'), true, 'Mengaktifkan...')
  setMsg(msgSel, '⏳ Mengaktifkan premium...', '')

  try {
    const r = await verifyLink(email, link)
    if (!varhadOk(r)) throw new Error(varhadErr(r))
    const premium = extractPremium(r)

    busy($('#own-activate'), false, 'Aktifkan Premium')
    setMsg(msgSel, '', '')
    $('#own-result').innerHTML = resultCard({ email, premium, note: 'Sekarang buka aplikasi Alight Motion dan login pakai email ini.' })
    $('#own-result').scrollIntoView({ behavior: 'smooth', block: 'center' })
    toast('Premium aktif! 🎉')
  } catch (e) {
    busy($('#own-activate'), false, 'Aktifkan Premium')
    const m = e.message || ''
    if (/INVALID_OOB_CODE/i.test(m)) setMsg(msgSel, '❌ Link sudah dipakai / kadaluarsa. Kirim ulang magic link-nya.', 'err')
    else setMsg(msgSel, '❌ Gagal: ' + m, 'err')
  }
})

/* ═══════════ MODE 2: auto generate ═══════════ */

function stepRow(icon, text) {
  return `<div class="step" data-icon="${icon}"><span class="s-ico"></span><span class="s-txt">${text}</span></div>`
}

function setStep(el, state) {
  /* state: wait | run | done | err */
  const ico = el.querySelector('.s-ico')
  el.className = 'step ' + state
  if (state === 'done') ico.textContent = '✓'
}

$('#auto-go').addEventListener('click', async () => {
  const stepsEl = $('#auto-steps')
  const msgSel = '#auto-msg'

  /* reset UI */
  $('#auto-result').innerHTML = ''
  $('#auto-login').classList.add('hidden')
  $('#login-result').innerHTML = ''
  stepsEl.classList.remove('hidden')
  stepsEl.innerHTML =
    stepRow('mail', 'Membuat email baru') +
    stepRow('send', 'Mengirim magic link') +
    stepRow('inbox', 'Menunggu email masuk') +
    stepRow('key', 'Aktivasi premium') +
    stepRow('ok', 'Finishing')
  const steps = [...stepsEl.querySelectorAll('.step')]

  busy($('#auto-go'), true, 'Sedang Diproses...')
  setMsg(msgSel, '', '')

  let email = null

  try {
    /* 1. tempmail */
    setStep(steps[0], 'run')
    const tm = await createTempmail()
    email = tm?.data?.email
    if (!email) throw new Error('gagal bikin email')
    setStep(steps[0], 'done')
    toast('Email dibuat: ' + email)

    /* 2. kirim magic link */
    setStep(steps[1], 'run')
    const send = await sendMagicLink(email)
    if (!varhadOk(send)) throw new Error(varhadErr(send))
    setStep(steps[1], 'done')

    /* 3. poll inbox (maks ±2 menit) */
    setStep(steps[2], 'run')
    let magicMail = null
    for (let i = 0; i < 24; i++) {
      await sleep(5000)
      const mails = inboxList(await checkInbox(email))
      magicMail = mails.find(isMagicEmail) || mails[0] || null
      if (magicMail) break
      steps[2].querySelector('.s-txt').textContent = `Menunggu email masuk (${(i + 1) * 5}s)...`
    }
    if (!magicMail) throw new Error('email magic link gak masuk-masuk (coba lagi nanti)')
    setStep(steps[2], 'done')

    /* 4. ekstrak link + aktivasi premium */
    setStep(steps[3], 'run')
    const link = extractFirebaseLink(magicMail.content || magicMail.html || magicMail.body || '')
    if (!link) throw new Error('link di email gak ketemu')
    const ver = await verifyLink(email, link)
    if (!varhadOk(ver)) throw new Error(varhadErr(ver))
    const premium = extractPremium(ver)
    setStep(steps[3], 'done')

    /* 5. selesai */
    setStep(steps[4], 'run')
    await sleep(600)
    setStep(steps[4], 'done')

    busy($('#auto-go'), false, 'Generate Lagi')
    $('#auto-result').innerHTML = resultCard({
      email,
      premium,
      note: 'Email ini sudah premium. Mau langsung masuk ke aplikasi? Lanjut ke langkah login di bawah ⬇️',
    })

    /* fase login: tampil panel, mulai polling email "Login ke Alight Creative" */
    $('#auto-login').classList.remove('hidden')
    startLoginWatch(email)
    toast('Akun premium jadi! 🎉')
    $('#auto-result').scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch (e) {
    const running = steps.find((s) => s.classList.contains('run'))
    if (running) setStep(running, 'err')
    busy($('#auto-go'), false, 'Generate Sekarang')
    setMsg(msgSel, '❌ ' + (e.message || 'gagal'), 'err')
  }
})

/* polling email login dari aplikasi AM (maks 5 menit) */
function startLoginWatch(email) {
  const waitEl = $('#login-wait')
  const resEl = $('#login-result')
  waitEl.classList.remove('hidden')
  resEl.innerHTML = ''

  ;(async () => {
    for (let i = 0; i < 60; i++) {
      try {
        const mails = inboxList(await checkInbox(email))
        const loginMail = mails.find(isLoginEmail)
        if (loginMail) {
          const link = extractFirebaseLink(loginMail.content || loginMail.html || loginMail.body || '')
          waitEl.classList.add('hidden')
          if (link) {
            resEl.innerHTML = `
              <a class="btn primary big block" href="${link}" target="_blank" rel="noopener">
                <span class="btn-label">🔓 Buka Alight Motion</span>
              </a>
              <p class="login-hint">Tap tombol di atas untuk langsung masuk. Link berlaku beberapa menit.</p>`
            toast('Tombol login siap! 🔓')
          } else {
            resEl.innerHTML = `<div class="msg err">Email login masuk tapi link-nya gak terbaca. Coba generate ulang.</div>`
          }
          return
        }
      } catch {}
      await sleep(5000)
    }
    waitEl.classList.add('hidden')
    resEl.innerHTML = `<div class="msg warn">⏰ 5 menit kehabisan — belum ada email login. Kalau sudah minta login di aplikasi, coba generate ulang.</div>`
  })()
}
