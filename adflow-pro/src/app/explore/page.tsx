export default function ExploreAds() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-6 sticky top-24 min-h-[min-content]">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Search</label>
                <input 
                  type="text" 
                  placeholder="Keywords..." 
                  className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Category</label>
                <select className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  <option>All Categories</option>
                  <option>Real Estate</option>
                  <option>Vehicles</option>
                  <option>Services</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">City</label>
                <select className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  <option>All Cities</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                </select>
              </div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-md transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Active Listings</h1>
            <span className="text-zinc-400 text-sm">Showing 1-10 of 42</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example Placeholders */}
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="group relative rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-800/80 transition-colors shadow-xl overflow-hidden flex flex-col cursor-pointer">
                {/* Image Section */}
                <div className="h-48 w-full rounded-md bg-zinc-800 mb-4 overflow-hidden relative">
                   <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDI%3D`} alt="Listing thumbnail" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                   
                   {i === 1 && (
                     <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider backdrop-blur">
                        Premium
                     </div>
                   )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold font-mono">Real Estate</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      Miami
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-indigo-400 transition-colors">
                    Luxury Penthouse Condo
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-1">
                    Stunning fully furnished penthouse with 360-degree views of the cityscape. Includes rooftop pool access and private helipad. In pristine condition.
                  </p>
                  <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                     <span className="font-medium text-white">$2,500 <span className="text-zinc-500 text-sm font-normal">/ month</span></span>
                     <span className="text-indigo-500 text-sm hover:underline font-medium">View details &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
             <button className="px-4 py-2 rounded-md bg-zinc-900 border border-white/10 hover:bg-zinc-800 disabled:opacity-50">Prev</button>
             <button className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">1</button>
             <button className="px-4 py-2 rounded-md bg-zinc-900 border border-white/10 hover:bg-zinc-800">2</button>
             <button className="px-4 py-2 rounded-md bg-zinc-900 border border-white/10 hover:bg-zinc-800">3</button>
             <button className="px-4 py-2 rounded-md bg-zinc-900 border border-white/10 hover:bg-zinc-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
