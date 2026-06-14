import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Clock, Users, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react'

const features = [
  { icon: Stethoscope, title: 'Verified Doctors', desc: 'All doctors are verified by our admin team before they appear in search.' },
  { icon: HeartPulse, title: 'All Treatment Types', desc: 'Allopathic, homeopathic, and herbal specialists in one platform.' },
  { icon: Clock, title: 'Easy Scheduling', desc: 'Book appointments online with real-time slot availability.' },
  { icon: Shield, title: 'Secure Records', desc: 'Your medical history and prescriptions are safely stored.' },
]

const stats = [
  { value: '500+', label: 'Verified Doctors' },
  { value: '10K+', label: 'Appointments Booked' },
  { value: '3', label: 'Treatment Types' },
  { value: '24/7', label: 'Platform Access' },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='animate-fade-in'>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50' />
        <div className='absolute top-20 right-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl' />
        <div className='absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6'>
              <HeartPulse size={16} />
              Modern Healthcare Platform
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight'>
              Your Health,{' '}
              <span className='bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent'>
                Simplified
              </span>
            </h1>
            <p className='text-lg text-slate-500 mt-6 leading-relaxed max-w-xl'>
              Doctor Hub connects patients with verified healthcare professionals. Book appointments, manage records, and access prescriptions — all in one place.
            </p>
            <div className='flex flex-wrap gap-4 mt-8'>
              <button onClick={() => navigate('/register')} className='btn-primary text-base px-8 py-3'>
                Get Started Free
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login/patient')} className='btn-secondary text-base px-8 py-3'>
                Patient Sign In
              </button>
              <button onClick={() => navigate('/login')} className='btn-ghost text-base px-8 py-3'>
                Other Portals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map((s) => (
            <div key={s.label} className='card p-6 text-center hover:shadow-card-hover transition-shadow'>
              <p className='text-3xl font-bold text-brand-700'>{s.value}</p>
              <p className='text-sm text-slate-500 mt-1 font-medium'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-slate-900'>Why Doctor Hub?</h2>
          <p className='text-slate-500 mt-3 max-w-lg mx-auto'>Everything you need for modern healthcare management</p>
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((f) => (
            <div key={f.title} className='card-hover p-6 group'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform'>
                <f.icon size={22} />
              </div>
              <h3 className='font-bold text-slate-900'>{f.title}</h3>
              <p className='text-sm text-slate-500 mt-2 leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className='bg-slate-900 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white'>Built for Everyone</h2>
            <p className='text-slate-400 mt-3'>Dedicated portals for each role in the healthcare ecosystem</p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { role: 'Patients', desc: 'Find doctors, book appointments, view history', color: 'from-blue-500 to-blue-600', login: '/login/patient' },
              { role: 'Doctors', desc: 'Manage clinics, schedule, patients & prescriptions', color: 'from-emerald-500 to-emerald-600', login: '/login/staff' },
              { role: 'Assistants', desc: 'Verify payments and manage clinic bookings', color: 'from-violet-500 to-violet-600', login: '/login/staff' },
              { role: 'Admins', desc: 'Analytics, user management, and oversight', color: 'from-amber-500 to-amber-600', login: '/login/admin' },
            ].map((r) => (
              <button
                key={r.role}
                type='button'
                onClick={() => navigate(r.login)}
                className='text-left bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/30 transition-colors'
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center mb-4`}>
                  <Users size={18} className='text-white' />
                </div>
                <h3 className='text-white font-bold'>{r.role}</h3>
                <p className='text-slate-400 text-sm mt-2'>{r.desc}</p>
                <p className='text-brand-400 text-xs font-medium mt-4'>Sign in →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='card p-10 sm:p-14 text-center bg-gradient-to-br from-brand-600 to-brand-800 border-0 shadow-glow relative overflow-hidden'>
          <div className='relative'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white'>Ready to get started?</h2>
            <p className='text-brand-100 mt-4 max-w-md mx-auto'>Join Doctor Hub today and experience modern healthcare management.</p>
            <button onClick={() => navigate('/register')} className='mt-8 bg-white text-brand-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors inline-flex items-center gap-2'>
              Create Free Account <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
