# کمیٹی Pro v3.0 — MEAN Stack + Email System

## 🚀 QUICK START

```bash
npm install
cp .env.example .env     # fill in your details
node server.js
# http://localhost:5000
# Login: admin / admin123
```

## 📧 EMAIL SETUP (Gmail)
1. Gmail → Settings → Security → 2-Step Verification → ON
2. Then: https://myaccount.google.com/apppasswords
3. Generate 16-char App Password
4. In .env: EMAIL_USER=you@gmail.com  EMAIL_PASS=xxxx xxxx xxxx xxxx

## ✅ NEW FEATURES v3
- Self-Registration (members create own accounts)
- Forgot Password (email reset link)
- Email Verification on signup
- Admin sends invite links via email
- Email on: account created, committee added, payment confirmed, payout ready
- Admin-created accounts get credentials by email

## 🔐 LOGIN
| Username | Password |
|----------|----------|
| admin    | admin123 |

## 📁 FILES
- server.js → Backend + APIs + Email
- public/index.html → Full Frontend SPA
- .env.example → Config template
