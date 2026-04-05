"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getClientAds } from "@/actions/ads";

export default function ClientDashboard() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     getClientAds().then((data) => {
        setAds(data as any[]);
        setLoading(false);
     });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-mono">Active</span>;
      case "PAYMENT_PENDING": return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-xs font-mono">Pay Pending</span>;
      default: return <span className="bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 px-2 py-0.5 rounded text-xs font-mono">{status}</span>;
    }
  };

  return (
    <div className="w-full h-full pb-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Campaigns</h1>
          <p className="text-zinc-400">Manage your active listings, drafts, and payments.</p>
        </div>
        <Link 
          href="/packages"
          className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-full font-semibold shadow-xl hover:scale-105 transition-all"
        >
          + New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative">
            <h3 className="text-zinc-400 font-medium mb-2">Total Impressions</h3>
            <p className="text-4xl font-bold">{loading ? "..." : "0"}</p>
         </div>
         <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative">
            <h3 className="text-zinc-400 font-medium mb-2">Total Campaigns</h3>
            <p className="text-4xl font-bold">{loading ? "..." : ads.length}</p>
         </div>
         <div className="bg-indigo-600 border border-indigo-500 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
            <h3 className="text-indigo-200 font-medium mb-2">Wallet Balance</h3>
            <p className="text-4xl font-bold text-white">$0.00</p>
            <p className="text-xs text-indigo-300 mt-2">Connect Stripe to auto-pay</p>
         </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Ads</h2>
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500 bg-zinc-900 border-b border-white/5 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Campaign</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium">Expiry</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                   No campaigns found. Ready to place your first ad?
                </td>
              </tr>
            ) : ads.map((ad, i) => (
              <tr key={ad.id} className="border-b border-white/5 hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{ad.title}</div>
                  <div className="font-mono text-zinc-500 text-xs">ID: {ad.id}</div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(ad.status)}</td>
                <td className="px-6 py-4 font-mono text-zinc-300">0</td>
                <td className="px-6 py-4 text-zinc-400">{ad.package?.name || "Tier 1"}</td>
                <td className="px-6 py-4 text-right">
                  {ad.status === "PAYMENT_PENDING" ? (
                    <Link href={`/dashboard/client/pay/${ad.id}`} className="inline-block px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded text-xs transition-colors shadow-lg">
                      Pay Now - Upload Proof
                    </Link>
                  ) : ad.status === "SUBMITTED" ? (
                    <button disabled className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded text-xs font-medium cursor-not-allowed">
                      In Review
                    </button>
                  ) : (
                    <button className="px-4 py-1.5 bg-zinc-800 border border-white/10 hover:bg-white/10 text-white rounded text-xs font-medium transition-colors">
                      Analytics
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
