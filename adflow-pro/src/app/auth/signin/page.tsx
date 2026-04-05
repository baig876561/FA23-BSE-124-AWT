"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     if (searchParams.get("error") === "PENDING_APPROVAL") {
        setError("Your account is pending administrator approval. You cannot log in yet.");
     } else if (searchParams.get("error")) {
        setError("Authentication failed. " + searchParams.get("error"));
     }
     
     if (searchParams.get("message") === "registered") {
        setMessage("Application submitted successfully! Please wait for an Admin to review your account before logging in.");
     }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
       setError(res.error === "PENDING_APPROVAL" ? "Your account is pending administrator approval." : "Invalid email or password.");
       setLoading(false);
    } else {
       router.push("/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full overflow-hidden relative p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[150px] rounded-full point-events-none -z-10" />
      
      <div className="w-full max-w-md bg-zinc-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md z-10">
        <div className="text-center mb-8">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
           <p className="text-zinc-400 text-sm">Sign in securely to AdFlow Pro</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        {message && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg mb-6 text-sm text-center">{message}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
           <div>
             <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
             <input required name="email" type="email" placeholder="admin@adflow.com" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
           </div>
           
           <div>
             <div className="flex items-center justify-between mb-1.5">
               <label className="block text-sm font-medium text-zinc-300">Password</label>
               <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
             </div>
             <input required name="password" type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all shadow-inner" />
           </div>

           <button disabled={loading} className="block w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] text-center">
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
           </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
           Don't have an account? <Link href="/auth/signup" className="text-indigo-400 hover:text-white transition-colors">Apply for Marketplace access</Link>
        </div>
      </div>
    </div>
  );
}
