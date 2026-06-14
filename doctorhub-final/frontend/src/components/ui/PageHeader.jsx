const PageHeader = ({ title, subtitle, action }) => (
  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-up'>
    <div>
      <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>{title}</h1>
      {subtitle && <p className='text-slate-500 text-sm mt-1.5'>{subtitle}</p>}
    </div>
    {action && <div className='shrink-0'>{action}</div>}
  </div>
)

export default PageHeader
