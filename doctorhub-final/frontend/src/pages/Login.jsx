import { Link } from 'react-router-dom'
import { HeartPulse, Stethoscope, Shield, ArrowRight } from 'lucide-react'
import { LOGIN_PORTALS } from '../utils/auth'

const portals = [
    {
        to: LOGIN_PORTALS.patient,
        title: 'Patient',
        desc: 'Book appointments, view medical history and prescriptions',
        icon: HeartPulse,
        color: 'from-blue-500 to-blue-600',
        hoverBorder: 'hover:border-blue-300',
    },
    {
        to: LOGIN_PORTALS.staff,
        title: 'Doctor & Assistant',
        desc: 'Manage clinics, schedules, patients, and payments',
        icon: Stethoscope,
        color: 'from-emerald-500 to-emerald-600',
        hoverBorder: 'hover:border-emerald-300',
    },
    {
        to: LOGIN_PORTALS.admin,
        title: 'Admin & Super Admin',
        desc: 'Platform oversight, user management, and analytics',
        icon: Shield,
        color: 'from-amber-500 to-amber-600',
        hoverBorder: 'hover:border-amber-300',
    },
]

const Login = () => (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-2xl animate-slide-up'>
            <div className='text-center mb-10'>
                <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Choose your portal</h1>
                <p className='text-slate-500 text-sm mt-2'>Select the login page that matches your role</p>
            </div>

            <div className='grid gap-4'>
                {portals.map((portal) => (
                    <Link
                        key={portal.to}
                        to={portal.to}
                        className={`card p-6 flex items-center gap-5 border-2 border-transparent ${portal.hoverBorder} transition-all group hover:shadow-card-hover`}
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                            <portal.icon size={26} className='text-white' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-lg font-bold text-slate-900'>{portal.title}</h2>
                            <p className='text-sm text-slate-500 mt-1'>{portal.desc}</p>
                        </div>
                        <ArrowRight size={20} className='text-slate-300 group-hover:text-brand-600 shrink-0 transition-colors' />
                    </Link>
                ))}
            </div>

            <p className='text-center text-sm text-slate-500 mt-8'>
                New patient?{' '}
                <Link to='/register' className='text-brand-600 font-semibold hover:text-brand-700'>
                    Create an account
                </Link>
            </p>
        </div>
    </div>
)

export default Login
