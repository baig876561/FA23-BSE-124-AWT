import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full point-events-none -z-10" />
      
      <section className="text-center max-w-4xl mx-auto px-6 mt-20 mb-32 z-10">
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-8">
          The Premier Marketplace for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Sponsored Real Estate.
          </span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          AdFlow Pro provides an elegant, controlled environment to discover, buy, and track high-quality featured listings. Fully automated, manually vetted.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/explore" 
            className="px-8 py-4 rounded-full bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all hover:scale-105"
          >
            Explore Ads
          </Link>
          <Link 
            href="/packages" 
            className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur font-semibold hover:bg-white/10 transition-all"
          >
            Submit Listing
          </Link>
        </div>
      </section>

      {/* Featured Grid Example */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24 z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Trending Placements</h2>
          <Link href="/explore" className="text-indigo-400 text-sm hover:text-indigo-300">View all &rarr;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 p-6 hover:bg-zinc-900 transition-colors cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              
              <div className="aspect-[4/3] rounded-lg bg-zinc-800 mb-4 overflow-hidden relative">
                {/* Fallback pattern */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_100%)] bg-[length:20px_20px]" />
                <img src={`https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmV0cm98ZW58MHx8MHx8fDI%3D`} alt="Ad Thumbnail" className="object-cover w-full h-full opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              </div>

              <div className="flex items-start justify-between z-20 relative">
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">Premium Synthwave Pack</h3>
                  <p className="text-zinc-400 text-sm">Visual Arts &bull; New York</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
