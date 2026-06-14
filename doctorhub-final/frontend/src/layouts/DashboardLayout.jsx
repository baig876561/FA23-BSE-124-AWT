import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getPortalConfig } from '../config/navigation'
import { getLoginPath } from '../utils/auth'

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const config = getPortalConfig(user?.role)

  const handleLogout = () => {
    logout()
    navigate(getLoginPath(user?.role))
  }

  return (
    <div className='min-h-screen bg-surface flex'>
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface-sidebar flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className='p-6 border-b border-slate-700/50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow'>
              <span className='text-white font-bold text-lg'>D</span>
            </div>
            <div>
              <p className='text-white font-bold text-lg tracking-tight'>Doctor Hub</p>
              <p className='text-slate-400 text-xs'>{config.name}</p>
            </div>
          </div>
        </div>

        <div className='px-4 py-4 border-b border-slate-700/50'>
          <div className='flex items-center gap-3 px-2'>
            <div className='w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold'>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className='min-w-0'>
              <p className='text-white text-sm font-semibold truncate'>{user?.name}</p>
              <p className='text-slate-400 text-xs truncate capitalize'>{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
          {config.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className='p-4 border-t border-slate-700/50'>
          <button onClick={handleLogout} className='sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10'>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className='flex-1 flex flex-col min-w-0'>
        <header className='sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between'>
          <button onClick={() => setSidebarOpen(true)} className='lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600'>
            <Menu size={22} />
          </button>

          <div className='hidden lg:block'>
            <p className='text-sm text-slate-500'>{config.subtitle}</p>
          </div>

          <div className='flex items-center gap-3'>
            <button className='p-2 rounded-xl hover:bg-slate-100 text-slate-500 relative'>
              <Bell size={20} />
              <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full' />
            </button>

            <div className='relative'>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors'
              >
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold'>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <ChevronDown size={16} className='text-slate-400 hidden sm:block' />
              </button>

              {profileOpen && (
                <>
                  <div className='fixed inset-0 z-40' onClick={() => setProfileOpen(false)} />
                  <div className='absolute right-0 top-full mt-2 w-56 card p-2 z-50 shadow-card-hover animate-fade-in'>
                    <div className='px-3 py-2 border-b border-slate-100 mb-1'>
                      <p className='text-sm font-semibold text-slate-800'>{user?.name}</p>
                      <p className='text-xs text-slate-500'>{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className='w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg'>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className='flex-1 p-4 sm:p-6 lg:p-8 overflow-auto animate-fade-in'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
