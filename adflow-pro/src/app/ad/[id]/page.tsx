import Link from "next/link";

export default function AdDetail({ params }: { params: { id: string } }) {
  // In a real scenario, fetch ad details using Prisma based on params.id
  const isPremium = true;

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
       {/* Breadcrumbs */}
       <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 font-medium">
          <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          <span>/</span>
          <Link href="/category/real-estate" className="hover:text-white transition-colors">Real Estate</Link>
          <span>/</span>
          <span className="text-zinc-300">New York</span>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          {/* Main Visuals & Content */}
          <div className="space-y-8">
             {/* Media Gallery (External Normalizer Mock) */}
             <div className="w-full aspect-video bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
                {isPremium && (
                   <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1 text-xs font-bold rounded shadow-lg uppercase tracking-wider z-20">
                      Premium Listing
                   </div>
                )}
                <img 
                  src={`https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmV0cm98ZW58MHx8MHx8fDI%3D`} 
                  alt="Listing Media"
                  className="w-full h-full object-cover relative z-10"
                />
             </div>

             <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Luxury Miami Yacht Charter</h1>
                <p className="text-xl text-zinc-400 font-light mb-8 leading-relaxed">
                   Experience the ultimate getaway with our 120ft Super Yacht. Fully staffed with a private chef, onboard jet skis, and helicopter pad. Available for weekend or weekly charters across the Caribbean and Florida Keys.
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-6">
                   <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                      S
                   </div>
                   <div>
                      <h3 className="font-medium text-white">Seller: Horizon Charters</h3>
                      <p className="text-zinc-500 text-sm">Member since 2024 &bull; Verified</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Action Sidebar */}
          <aside className="space-y-6">
             {/* Pricing Card */}
             <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl sticky top-24">
                <p className="text-zinc-400 font-medium mb-1">Pricing / Rate</p>
                <h2 className="text-3xl font-bold text-white mb-6">$15,000 <span className="text-zinc-500 text-lg font-normal">/ day</span></h2>
                
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-4">
                   Contact Seller
                </button>
                <button className="w-full py-4 border border-white/10 text-white hover:bg-white/5 font-bold rounded-xl transition-all">
                   Save to Favorites
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-xs">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                   Secure Platform Transactions Only
                </div>
             </div>

             {/* Details Metadata */}
             <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm text-zinc-400 space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>Ad ID</span>
                   <span className="font-mono text-zinc-300">#{params.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>Published</span>
                   <span className="text-zinc-300">Oct 12, 2024</span>
                </div>
                <div className="flex justify-between">
                   <span>Expires In</span>
                   <span className="text-orange-400 font-medium">14 Days</span>
                </div>
             </div>
          </aside>
       </div>
    </div>
  );
}
