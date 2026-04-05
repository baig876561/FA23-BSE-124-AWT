"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/auth/signin?message=registered");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full overflow-hidden relative p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full point-events-none -z-10" />
      
      <div className="w-full max-w-md bg-zinc-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md z-10">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Apply for Access</h1>
           <p className="text-zinc-400 text-sm">Create an AdFlow Pro account. All accounts require manual administration approval.</p>
        </div>

        {error && (
           <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
             {error}
           </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
           <div>
             <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
             <input required name="name" type="text" placeholder="John Doe" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
             <input required name="email" type="email" placeholder="you@example.com" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
           </div>
           
           <div>
             <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
             <input required name="password" type="password" placeholder="••••••••" minLength={6} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-300 mb-1.5">Requested Role</label>
             <select name="role" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner appearance-none cursor-pointer">
                <option value="CLIENT">Client (Advertiser)</option>
                <option value="MODERATOR">Moderator</option>
             </select>
           </div>

           <button disabled={loading} className="block w-full py-3.5 mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] text-center">
              {loading ? "Submitting Request..." : "Submit Application"}
           </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
           Already have an account? <Link href="/auth/signin" className="text-indigo-400 hover:text-white transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
