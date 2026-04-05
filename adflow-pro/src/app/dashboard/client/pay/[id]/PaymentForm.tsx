"use client";

import { useState } from "react";
import { submitPaymentProof } from "@/actions/payments";
import { useRouter } from "next/navigation";

export default function PaymentForm({ adId }: { adId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setLoading(true);
     setError("");

     const formData = new FormData(e.currentTarget);
     formData.append("adId", adId);

     const res = await submitPaymentProof(formData);
     if (res?.error) {
        setError(res.error);
        setLoading(false);
     } else {
        router.push("/dashboard/client?message=payment_submitted");
     }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {error && <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg text-sm">{error}</div>}

       <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Upload Proof of Transaction (Screenshot)</label>
          <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 transition-all shadow-inner focus-within:ring-2 focus-within:ring-emerald-500">
             <input required name="proofImage" type="file" accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 transition-all cursor-pointer" />
          </div>
       </div>

       <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Transaction Reference ID (Optional)</label>
          <input name="txRef" type="text" placeholder="e.g. TR-2024-X992" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all shadow-inner" />
       </div>

       <button disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] text-lg">
          {loading ? "Submitting Ledger..." : "Submit Payment for Verification"}
       </button>
    </form>
  );
}
