"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { submitAd } from "@/actions/ads";
import Link from "next/link";

export default function CreateListing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageTier = searchParams.get("package") || "Basic";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("packageTier", packageTier);

    const res = await submitAd(formData);

    if (res?.error) {
       setError(res.error);
       setLoading(false);
    } else {
       router.push("/dashboard/client?message=submitted");
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 pt-10">
      <div className="mb-10">
        <Link href="/packages" className="text-zinc-500 hover:text-white text-sm flex items-center gap-2 mb-4">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
           Back to Packages
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Campaign</h1>
        <p className="text-zinc-400">Fill out your sponsored listing details. It will enter the moderation queue upon submission.</p>
      </div>

      <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-xl">
         {/* Selected Tier Badge */}
         <div className="flex items-center justify-between bg-zinc-950 border border-white/5 p-4 rounded-xl mb-8">
            <div>
               <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Selected Package</p>
               <p className="font-bold text-white text-lg">{packageTier} Tier</p>
            </div>
            {packageTier === "Premium" || packageTier === "Enterprise" ? (
               <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded text-xs font-bold border border-indigo-500/30">Priority Processing</div>
            ) : (
               <div className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded text-xs font-bold border border-white/10">Standard Queue</div>
            )}
         </div>

         {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

         <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Campaign Title</label>
              <input required name="title" type="text" placeholder="e.g., Luxury Penthouse in Dubai" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Listing Description</label>
              <textarea required name="description" rows={5} placeholder="Describe the product, real estate, or digital asset in detail..." className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Campaign Media</label>
              
              <div className="space-y-4">
                 <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 transition-all shadow-inner focus-within:ring-2 focus-within:ring-indigo-500">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Option A: Upload Local Image</label>
                    <input name="localImage" type="file" accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all cursor-pointer" />
                 </div>

                 <div className="flex items-center text-xs text-zinc-600 uppercase font-bold tracking-widest before:flex-1 before:border-t before:border-zinc-800 before:mr-4 after:flex-1 after:border-t after:border-zinc-800 after:ml-4">
                   Or Provide Link
                 </div>

                 <div>
                    <input name="mediaUrl" type="url" placeholder="https://imgur.com/your-image.jpg" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
                    <p className="text-xs text-zinc-500 mt-2">At least one Option (A or B) must be completely filled out!</p>
                 </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] text-lg">
                {loading ? "Submitting to Queue..." : "Submit Campaign"}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
}
