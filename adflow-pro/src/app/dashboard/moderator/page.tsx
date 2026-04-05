"use client";

import { useState, useEffect } from "react";
import { getModerationQueue, approveAdForPayment, rejectAd } from "@/actions/ads";

export default function ModeratorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     getModerationQueue().then((data) => {
        setQueue(data as any[]);
        setLoading(false);
     });
  }, []);

  const handleModeration = async (id: string, decision: "APPROVE" | "REJECT") => {
    if (decision === "APPROVE") {
       await approveAdForPayment(id);
    } else {
       await rejectAd(id);
    }
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full h-full pb-20">
      <div className="mb-10">
         <h1 className="text-3xl font-bold tracking-tight mb-2">Moderation Queue</h1>
         <p className="text-zinc-400">Review newly submitted listings for guidelines compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-500">Loading queue...</div>
        ) : queue.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-500 bg-zinc-900 border border-white/5 rounded-xl">
             <h3 className="text-xl font-medium text-white mb-2">Queue is empty!</h3>
             <p>All submitted ads have been reviewed.</p>
          </div>
        ) : queue.map((ad) => (
          <div key={ad.id} className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden flex flex-col group shadow-xl">
            {/* Visual Media Placeholder */}
            <div className="aspect-video bg-zinc-800 relative w-full overflow-hidden flex items-center justify-center">
               <div className="absolute top-2 right-2 bg-indigo-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg font-mono">
                 {ad.media?.[0]?.sourceType || "MEDIA"}
               </div>
               <p className="text-zinc-500 text-sm italic px-4 text-center truncate w-full break-all">
                  <a href={ad.media?.[0]?.originalUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">
                    {ad.media?.[0]?.originalUrl || "No Link Provided"}
                  </a>
               </p>
            </div>
            
            {/* Context */}
            <div className="p-5 flex-1 flex flex-col">
               <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{ad.title}</h3>
               <p className="text-zinc-500 font-mono text-xs mb-4">Ad ID: {ad.id.split("-")[0]}... &bull; User: {ad.user?.email}</p>
               
               <div className="mt-auto grid grid-cols-2 gap-3">
                 <button 
                  onClick={() => handleModeration(ad.id, "REJECT")}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-semibold transition-colors"
                 >
                   Reject
                 </button>
                 <button 
                  onClick={() => handleModeration(ad.id, "APPROVE")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-lg text-sm font-semibold transition-colors"
                 >
                   Approve
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
