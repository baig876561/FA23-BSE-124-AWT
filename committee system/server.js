require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'committee_secret_2025';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/committee_pro_v3';
const PORT = process.env.PORT || 5000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// ── EMAIL TRANSPORTER ─────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

async function sendEmail(to, subject, html) {
  if (!process.env.EMAIL_USER) { console.log('📧 [DEMO] Email to:', to, '|', subject); return true; }
  try {
    await transporter.sendMail({ from: `"کمیٹی Pro" <${process.env.EMAIL_USER}>`, to, subject, html });
    return true;
  } catch(e) { console.error('Email error:', e.message); return false; }
}

function emailTemplate(title, body, btnText, btnUrl) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body{font-family:'Segoe UI',sans-serif;background:#0a0f0d;margin:0;padding:20px}
    .wrap{max-width:520px;margin:0 auto;background:#111722;border:1px solid #1c2a3a;border-radius:16px;overflow:hidden}
    .header{background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px;text-align:center}
    .header h1{color:#fff;font-size:1.6rem;margin:0;letter-spacing:2px}
    .header p{color:rgba(255,255,255,.75);margin:6px 0 0;font-size:.85rem}
    .body{padding:32px;color:#e2e8f0}
    .body h2{color:#60a5fa;font-size:1.1rem;margin:0 0 16px}
    .body p{color:#94a3b8;line-height:1.7;margin:0 0 12px;font-size:.9rem}
    .btn{display:inline-block;background:#3b82f6;color:#fff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:.9rem;margin:16px 0}
    .info-box{background:#0d1117;border:1px solid #243040;border-radius:10px;padding:16px;margin:16px 0}
    .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1c2a3a;font-size:.85rem}
    .info-row:last-child{border-bottom:none}
    .info-row .k{color:#64748b}.info-row .v{color:#f59e0b;font-weight:600}
    .footer{padding:16px 32px;text-align:center;border-top:1px solid #1c2a3a;font-size:.75rem;color:#475569}
  </style></head><body>
  <div class="wrap">
    <div class="header"><h1>کمیٹی Pro</h1><p>COMMITTEE MANAGEMENT SYSTEM</p></div>
    <div class="body"><h2>${title}</h2>${body}${btnText?`<a href="${btnUrl}" class="btn">${btnText}</a>`:''}</div>
    <div class="footer">© 2025 کمیٹی Pro · Pakistan Committee Management · Do not reply to this email.</div>
  </div></body></html>`;
}

// ── SCHEMAS ───────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  name: { type: String, required: true },
  phone: { type: String },
  cnic: { type: String },
  email: { type: String, unique: true, sparse: true },
  active: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  verifyToken: String,
  resetToken: String,
  resetExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inviterName: String,
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  createdAt: { type: Date, default: Date.now }
});

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  monthlyAmount: { type: Number, required: true },
  totalMembers: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    turnMonth: Number,
    hasTaken: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  committeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
  committeeName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  memberName: String,
  memberEmail: String,
  month: Number,
  year: Number,
  amount: Number,
  status: { type: String, enum: ['paid', 'pending', 'late'], default: 'pending' },
  paidDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const payoutSchema = new mongoose.Schema({
  committeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
  committeeName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  memberName: String,
  memberEmail: String,
  turnMonth: Number,
  turnYear: Number,
  totalAmount: Number,
  status: { type: String, enum: ['given', 'pending'], default: 'pending' },
  givenDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Invite = mongoose.model('Invite', inviteSchema);
const Committee = mongoose.model('Committee', committeeSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Payout = mongoose.model('Payout', payoutSchema);

const MO = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── MIDDLEWARE ────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

// ── AUTH ──────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email: username }], active: true });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, role: user.role, email: user.email } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -resetToken -verifyToken');
  res.json(user);
});

// Self Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password, phone, cnic, inviteToken } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ error: 'Name, username, email & password required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    // Check invite if system requires it
    const requireInvite = process.env.REQUIRE_INVITE === 'true';
    if (requireInvite && inviteToken) {
      const invite = await Invite.findOne({ token: inviteToken, used: false, expiresAt: { $gt: new Date() } });
      if (!invite) return res.status(400).json({ error: 'Invalid or expired invite link' });
      await Invite.findByIdAndUpdate(invite._id, { used: true });
    }

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: exists.username === username ? 'Username already taken' : 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ name, username, email, password: hash, phone, cnic, verifyToken, emailVerified: false });
    await user.save();

    // Send welcome + verify email
    const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${verifyToken}`;
    await sendEmail(email, '🎉 Welcome to کمیٹی Pro — Verify Your Email',
      emailTemplate('Welcome to کمیٹی Pro!',
        `<p>Assalam o Alaikum <strong>${name}</strong>!</p>
         <p>Your account has been created. Please verify your email to get started.</p>
         <div class="info-box">
           <div class="info-row"><span class="k">Username</span><span class="v">${username}</span></div>
           <div class="info-row"><span class="k">Email</span><span class="v">${email}</span></div>
         </div>
         <p>Click the button below to verify your email address:</p>`,
        '✓ Verify Email', verifyUrl));

    res.json({ message: 'Account created! Check your email to verify.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Verify Email
app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ verifyToken: req.query.token }, { emailVerified: true, verifyToken: null }, { new: true });
    if (!user) return res.send(`<script>alert('Invalid or already used link');window.location='/'</script>`);
    res.send(`<script>alert('✅ Email verified! You can now login.');window.location='/'</script>`);
  } catch(e) { res.status(500).send('Error'); }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, active: true });
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await User.findByIdAndUpdate(user._id, { resetToken: token, resetExpiry: expiry });

    const resetUrl = `${APP_URL}/#reset-password?token=${token}`;
    await sendEmail(email, '🔐 Password Reset — کمیٹی Pro',
      emailTemplate('Reset Your Password',
        `<p>Assalam o Alaikum <strong>${user.name}</strong>!</p>
         <p>We received a request to reset your password. Click the button below. This link expires in <strong>1 hour</strong>.</p>
         <p style="color:#ef4444">If you did not request this, ignore this email.</p>`,
        '🔐 Reset Password', resetUrl));

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const user = await User.findOne({ resetToken: token, resetExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });
    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hash, resetToken: null, resetExpiry: null });
    await sendEmail(user.email, '✅ Password Changed — کمیٹی Pro',
      emailTemplate('Password Changed Successfully',
        `<p>Assalam o Alaikum <strong>${user.name}</strong>!</p>
         <p>Your password has been successfully changed. If you did not do this, contact admin immediately.</p>`,
        null, null));
    res.json({ message: 'Password reset successful! You can now login.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── INVITES ───────────────────────────────────────────────
app.post('/api/invites/send', auth, adminOnly, async (req, res) => {
  try {
    const { email, name } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    await Invite.create({ email, token, invitedBy: req.user.id, inviterName: req.user.name });
    const inviteUrl = `${APP_URL}/#register?invite=${token}`;
    await sendEmail(email, `🤝 You're Invited to کمیٹی Pro`,
      emailTemplate(`You've been invited!`,
        `<p>Assalam o Alaikum${name?' <strong>'+name+'</strong>':''}!</p>
         <p><strong>${req.user.name}</strong> has invited you to join <strong>کمیٹی Pro</strong> — Pakistan's smartest committee management system.</p>
         <p>Click below to create your account:</p>`,
        '🚀 Create Account', inviteUrl));
    res.json({ message: 'Invite sent to ' + email });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/invites', auth, adminOnly, async (req, res) => {
  const invites = await Invite.find().sort({ createdAt: -1 }).limit(50);
  res.json(invites);
});

// ── USERS ─────────────────────────────────────────────────
app.get('/api/users', auth, adminOnly, async (req, res) => {
  const users = await User.find().select('-password -resetToken -verifyToken').sort({ createdAt: -1 });
  res.json(users);
});

app.post('/api/users', auth, adminOnly, async (req, res) => {
  try {
    const { username, password, name, phone, cnic, email, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, name, phone, cnic, email, role: role || 'member', emailVerified: true });
    await user.save();
    if (email) {
      await sendEmail(email, '🎉 Your کمیٹی Pro Account is Ready!',
        emailTemplate('Account Created by Admin',
          `<p>Assalam o Alaikum <strong>${name}</strong>!</p>
           <p>Admin has created your account on کمیٹی Pro. Here are your login details:</p>
           <div class="info-box">
             <div class="info-row"><span class="k">Login URL</span><span class="v">${APP_URL}</span></div>
             <div class="info-row"><span class="k">Username</span><span class="v">${username}</span></div>
             <div class="info-row"><span class="k">Password</span><span class="v">${password}</span></div>
           </div>
           <p style="color:#ef4444">Please change your password after first login.</p>`,
          '🚀 Login Now', APP_URL));
    }
    const u = user.toObject(); delete u.password;
    res.json(u);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id)
      return res.status(403).json({ error: 'Forbidden' });
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    res.json(user);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', auth, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ success: true });
});

// ── COMMITTEES ────────────────────────────────────────────
app.get('/api/committees', auth, async (req, res) => {
  const q = req.user.role === 'admin' ? {} : { 'members.userId': req.user.id };
  res.json(await Committee.find(q).sort({ createdAt: -1 }));
});

app.get('/api/committees/:id', auth, async (req, res) => {
  const c = await Committee.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});

app.post('/api/committees', auth, adminOnly, async (req, res) => {
  try {
    const committee = new Committee(req.body);
    await committee.save();
    const start = new Date(committee.startDate);
    const payments = [], payouts = [];

    for (let mo = 0; mo < committee.totalMembers; mo++) {
      const d = new Date(start); d.setMonth(d.getMonth() + mo);
      for (const m of committee.members) {
        payments.push({ committeeId: committee._id, committeeName: committee.name, userId: m.userId, memberName: m.name, memberEmail: m.email || '', month: d.getMonth()+1, year: d.getFullYear(), amount: committee.monthlyAmount, status: 'pending' });
      }
    }
    for (const m of committee.members) {
      const d = new Date(start); d.setMonth(d.getMonth() + (m.turnMonth - 1));
      payouts.push({ committeeId: committee._id, committeeName: committee.name, userId: m.userId, memberName: m.name, memberEmail: m.email || '', turnMonth: d.getMonth()+1, turnYear: d.getFullYear(), totalAmount: committee.monthlyAmount * committee.totalMembers, status: 'pending' });
    }
    await Payment.insertMany(payments);
    await Payout.insertMany(payouts);

    // Notify members by email
    for (const m of committee.members) {
      if (m.email) {
        const turnDate = new Date(start); turnDate.setMonth(turnDate.getMonth() + (m.turnMonth - 1));
        await sendEmail(m.email, `🏦 You've been added to "${committee.name}"`,
          emailTemplate('Committee Assignment',
            `<p>Assalam o Alaikum <strong>${m.name}</strong>!</p>
             <p>You have been added to a new committee.</p>
             <div class="info-box">
               <div class="info-row"><span class="k">Committee</span><span class="v">${committee.name}</span></div>
               <div class="info-row"><span class="k">Monthly Amount</span><span class="v">PKR ${committee.monthlyAmount.toLocaleString()}</span></div>
               <div class="info-row"><span class="k">Your Turn #</span><span class="v">${m.turnMonth}</span></div>
               <div class="info-row"><span class="k">Your Payout Month</span><span class="v">${MO[turnDate.getMonth()+1]} ${turnDate.getFullYear()}</span></div>
               <div class="info-row"><span class="k">You Receive</span><span class="v">PKR ${(committee.monthlyAmount * committee.totalMembers).toLocaleString()}</span></div>
             </div>`,
            '📊 View Dashboard', APP_URL));
      }
    }
    res.json(committee);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/committees/:id', auth, adminOnly, async (req, res) => {
  const c = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
});

app.delete('/api/committees/:id', auth, adminOnly, async (req, res) => {
  await Committee.findByIdAndDelete(req.params.id);
  await Payment.deleteMany({ committeeId: req.params.id });
  await Payout.deleteMany({ committeeId: req.params.id });
  res.json({ success: true });
});

// ── PAYMENTS ──────────────────────────────────────────────
app.get('/api/payments', auth, async (req, res) => {
  const q = req.user.role === 'admin' ? {} : { userId: req.user.id };
  if (req.query.committeeId) q.committeeId = req.query.committeeId;
  res.json(await Payment.find(q).sort({ year: 1, month: 1 }));
});

app.put('/api/payments/:id/mark-paid', auth, adminOnly, async (req, res) => {
  const p = await Payment.findByIdAndUpdate(req.params.id, { status: 'paid', paidDate: new Date(), notes: req.body.notes }, { new: true });
  if (p?.memberEmail) {
    await sendEmail(p.memberEmail, `✅ Payment Confirmed — ${p.committeeName}`,
      emailTemplate('Payment Received',
        `<p>Assalam o Alaikum <strong>${p.memberName}</strong>!</p>
         <p>Your payment has been marked as received.</p>
         <div class="info-box">
           <div class="info-row"><span class="k">Committee</span><span class="v">${p.committeeName}</span></div>
           <div class="info-row"><span class="k">Month</span><span class="v">${MO[p.month]} ${p.year}</span></div>
           <div class="info-row"><span class="k">Amount</span><span class="v">PKR ${p.amount?.toLocaleString()}</span></div>
           <div class="info-row"><span class="k">Date</span><span class="v">${new Date().toLocaleDateString()}</span></div>
           ${p.notes ? `<div class="info-row"><span class="k">Notes</span><span class="v">${p.notes}</span></div>` : ''}
         </div>`,
        '📊 View Dashboard', APP_URL));
  }
  res.json(p);
});

app.put('/api/payments/:id/mark-pending', auth, adminOnly, async (req, res) => {
  const p = await Payment.findByIdAndUpdate(req.params.id, { status: 'pending', paidDate: null, notes: null }, { new: true });
  res.json(p);
});

// ── PAYOUTS ───────────────────────────────────────────────
app.get('/api/payouts', auth, async (req, res) => {
  const q = req.user.role === 'admin' ? {} : { userId: req.user.id };
  if (req.query.committeeId) q.committeeId = req.query.committeeId;
  res.json(await Payout.find(q).sort({ turnYear: 1, turnMonth: 1 }));
});

app.put('/api/payouts/:id/mark-given', auth, adminOnly, async (req, res) => {
  const payout = await Payout.findByIdAndUpdate(req.params.id, { status: 'given', givenDate: new Date() }, { new: true });
  if (payout) {
    await Committee.updateOne({ _id: payout.committeeId, 'members.userId': payout.userId }, { $set: { 'members.$.hasTaken': true } });
    if (payout.memberEmail) {
      await sendEmail(payout.memberEmail, `🎉 Payout Ready — ${payout.committeeName}`,
        emailTemplate('🎉 Your Payout is Ready!',
          `<p>Mubarak ho <strong>${payout.memberName}</strong>!</p>
           <p>Your committee payout has been marked as given. Collect it from the admin.</p>
           <div class="info-box">
             <div class="info-row"><span class="k">Committee</span><span class="v">${payout.committeeName}</span></div>
             <div class="info-row"><span class="k">Amount</span><span class="v">PKR ${payout.totalAmount?.toLocaleString()}</span></div>
             <div class="info-row"><span class="k">Date</span><span class="v">${new Date().toLocaleDateString()}</span></div>
           </div>`,
          '📊 View Dashboard', APP_URL));
    }
  }
  res.json(payout);
});

// ── DASHBOARD ─────────────────────────────────────────────
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const uid = new mongoose.Types.ObjectId(req.user.id);
    const pMatch = isAdmin ? { status: 'paid' } : { userId: uid, status: 'paid' };
    const [totalUsers, totalComm, activeComm, collected, pendingPay, pendingPout, paidPay, givenPout, totalMembers] = await Promise.all([
      isAdmin ? User.countDocuments({ active: true }) : null,
      isAdmin ? Committee.countDocuments() : Committee.countDocuments({ 'members.userId': uid }),
      isAdmin ? Committee.countDocuments({ status: 'active' }) : Committee.countDocuments({ 'members.userId': uid, status: 'active' }),
      Payment.aggregate([{ $match: pMatch }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
      Payment.countDocuments(isAdmin ? { status: 'pending' } : { userId: uid, status: 'pending' }),
      Payout.countDocuments(isAdmin ? { status: 'pending' } : { userId: uid, status: 'pending' }),
      Payment.countDocuments(isAdmin ? { status: 'paid' } : { userId: uid, status: 'paid' }),
      Payout.countDocuments(isAdmin ? { status: 'given' } : { userId: uid, status: 'given' }),
      isAdmin ? User.countDocuments({ active: true, role: 'member' }) : null,
    ]);
    res.json({ totalUsers, totalMembers, totalCommittees: totalComm, activeCommittees: activeComm, totalCollected: collected[0]?.t || 0, pendingPayments: pendingPay, pendingPayouts: pendingPout, paidPayments: paidPay, givenPayouts: givenPout });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── REPORTS ───────────────────────────────────────────────
app.get('/api/reports/summary', auth, adminOnly, async (req, res) => {
  const committees = await Committee.find();
  const report = [];
  for (const c of committees) {
    const [payments, payouts] = await Promise.all([Payment.find({ committeeId: c._id }), Payout.find({ committeeId: c._id })]);
    const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
    const distributed = payouts.filter(p => p.status === 'given').reduce((s, p) => s + p.totalAmount, 0);
    report.push({ name: c.name, status: c.status, totalMembers: c.totalMembers, monthlyAmount: c.monthlyAmount, totalPool: c.monthlyAmount * c.totalMembers, collected: paid, pending, distributed, startDate: c.startDate });
  }
  res.json(report);
});

// ── STATIC ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── SEED & START ──────────────────────────────────────────
async function seedAdmin() {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hash, name: 'Super Admin', role: 'admin', email: process.env.EMAIL_USER || undefined, emailVerified: true });
    console.log('✅ Admin seeded → username: admin | password: admin123');
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => { console.log('✅ MongoDB connected'); await seedAdmin(); app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`)); })
  .catch(() => { console.log('⚠️  No MongoDB — demo mode'); app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`)); });
