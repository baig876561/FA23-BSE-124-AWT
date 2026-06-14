import { NavLink } from 'react-router-dom'
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => (
  <footer className='bg-slate-900 text-slate-400 mt-auto'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        <div className='sm:col-span-2'>
          <div className='flex items-center gap-2.5 mb-4'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center'>
              <Stethoscope size={18} className='text-white' />
            </div>
            <span className='text-xl font-bold text-white'>Doctor Hub</span>
          </div>
          <p className='text-sm leading-relaxed max-w-md'>
            A modern healthcare platform connecting patients with verified doctors across allopathic, homeopathic, and herbal treatments.
          </p>
        </div>

        <div>
          <h4 className='text-white font-semibold text-sm mb-4'>Quick Links</h4>
          <ul className='space-y-2.5 text-sm'>
            <li><NavLink to='/' className='hover:text-brand-400 transition-colors'>Home</NavLink></li>
            <li><NavLink to='/about' className='hover:text-brand-400 transition-colors'>About Us</NavLink></li>
            <li><NavLink to='/contact' className='hover:text-brand-400 transition-colors'>Contact</NavLink></li>
            <li><NavLink to='/login' className='hover:text-brand-400 transition-colors'>Sign In</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className='text-white font-semibold text-sm mb-4'>Contact</h4>
          <ul className='space-y-3 text-sm'>
            <li className='flex items-center gap-2.5'><Mail size={14} className='text-brand-400' /> support@doctorhub.com</li>
            <li className='flex items-center gap-2.5'><Phone size={14} className='text-brand-400' /> +92 300 1234567</li>
            <li className='flex items-center gap-2.5'><MapPin size={14} className='text-brand-400' /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className='border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500'>
        &copy; {new Date().getFullYear()} Doctor Hub. All rights reserved.
      </div>
    </div>
  </footer>
)

export default Footer
