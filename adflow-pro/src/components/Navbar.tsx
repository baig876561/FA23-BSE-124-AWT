import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          AdFlow <span className="text-zinc-500 font-medium">Pro</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors">Explore</Link>
          <Link href="/packages" className="text-zinc-400 hover:text-white transition-colors">Packages</Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/auth/signin" className="bg-white text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
