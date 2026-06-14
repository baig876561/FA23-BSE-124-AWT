import { Target, Eye, Heart, Users } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Patient First', desc: 'Every feature is designed around improving patient experience and health outcomes.' },
  { icon: Eye, title: 'Transparency', desc: 'Verified doctors, clear pricing, and honest communication at every step.' },
  { icon: Target, title: 'Precision', desc: 'Accurate records, reliable scheduling, and data you can trust.' },
  { icon: Users, title: 'Community', desc: 'Building a connected healthcare ecosystem for patients and providers.' },
]

const About = () => (
  <div className='animate-fade-in'>
    <section className='bg-gradient-to-br from-brand-50 to-white py-16 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl font-bold text-slate-900'>About Doctor Hub</h1>
        <p className='text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed'>
          Doctor Hub is a modern healthcare platform that bridges the gap between patients and verified medical professionals. We support allopathic, homeopathic, and herbal treatments under one unified system.
        </p>
      </div>
    </section>

    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      <div className='grid lg:grid-cols-2 gap-12 items-center'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 mb-4'>Our Mission</h2>
          <p className='text-slate-500 leading-relaxed'>
            We believe healthcare should be accessible, transparent, and efficient. Doctor Hub empowers patients to find the right doctor, book appointments seamlessly, and maintain a complete medical history — while giving doctors and clinics powerful tools to manage their practice.
          </p>
        </div>
        <div className='card p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0'>
          <p className='text-5xl font-bold'>2024</p>
          <p className='text-brand-100 mt-2 font-medium'>Founded with a vision to modernize healthcare in Pakistan</p>
        </div>
      </div>
    </section>

    <section className='bg-slate-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-bold text-slate-900 text-center mb-10'>Our Values</h2>
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {values.map((v) => (
            <div key={v.title} className='card p-6 text-center'>
              <div className='w-12 h-12 mx-auto rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4'>
                <v.icon size={22} />
              </div>
              <h3 className='font-bold text-slate-900'>{v.title}</h3>
              <p className='text-sm text-slate-500 mt-2'>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

export default About
