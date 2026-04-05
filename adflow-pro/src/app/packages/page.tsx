import Link from "next/link";

export default function Packages() {
   const packages = [
     {
       name: "Basic",
       price: "$50",
       duration: "14 Days",
       weight: "Standard",
       features: ["Appear in general search", "1 Category limitation", "Standard support"],
       popular: false
     },
     {
       name: "Premium",
       price: "$150",
       duration: "30 Days",
       weight: "High Priority",
       features: ["Featured Homepage Carousel", "Highlighted search results badge", "Multiple categories", "Priority moderation"],
       popular: true
     },
     {
       name: "Enterprise",
       price: "$500",
       duration: "90 Days",
       weight: "Maximum Rank",
       features: ["Always at the top of category", "Analytics Dashboard API", "Dedicated account manager", "Verified Seller Badge (auto)"],
       popular: false
     }
   ];
 
   return (
     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-950 text-white relative overflow-hidden py-24">
       <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full point-events-none -z-10" />
       
       <div className="text-center max-w-2xl mx-auto px-6 mb-16 z-10">
         <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Choose Your Reach.</h1>
         <p className="text-zinc-400 text-lg">Secure your sponsored space with packages meticulously designed to amplify your visibility across our global network.</p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-6 z-10">
         {packages.map((pkg) => (
           <div 
            key={pkg.name} 
            className={`relative rounded-3xl p-8 border ${
              pkg.popular 
                ? "border-indigo-500 bg-zinc-900/80 shadow-[0_0_40px_rgba(99,102,241,0.2)] transform -translate-y-4" 
                : "border-white/10 bg-zinc-900/50"
            }`}
           >
             {pkg.popular && (
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                 Most Popular
               </div>
             )}
             
             <h3 className="text-xl font-medium mb-2">{pkg.name}</h3>
             <div className="mb-6">
                <span className="text-4xl font-bold">{pkg.price}</span>
                <span className="text-zinc-500 ml-2">/ listing</span>
             </div>
             
             <div className="flex flex-col gap-2 mb-8 text-sm text-zinc-400">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span>Duration</span>
                 <span className="text-white font-medium">{pkg.duration}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span>Sorting Weight</span>
                 <span className="text-emerald-400 font-medium">{pkg.weight}</span>
               </div>
             </div>
 
             <ul className="flex flex-col gap-4 mb-10">
               {pkg.features.map((feat, i) => (
                 <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   {feat}
                 </li>
               ))}
             </ul>
 
             <Link href={`/dashboard/client/create?package=${pkg.name}`} className={`block w-full text-center py-4 rounded-xl font-bold transition-all mt-auto ${
               pkg.popular 
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]" 
                : "bg-white text-black hover:bg-zinc-200"
             }`}>
               Select {pkg.name}
             </Link>
           </div>
         ))}
       </div>
     </div>
   );
 }
