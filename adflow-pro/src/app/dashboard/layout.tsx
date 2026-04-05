"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hardcoded for demonstration workflow
  const role = pathname.includes("/admin") ? "ADMIN" : 
               pathname.includes("/moderator") ? "MODERATOR" : "CLIENT";

  const navLinks = {
    CLIENT: [
      { name: "My Ads", href: "/dashboard/client" },
      { name: "Create New Ad", href: "/dashboard/client/create" },
      { name: "Payments", href: "/dashboard/client/payments" },
    ],
    MODERATOR: [
      { name: "Review Queue", href: "/dashboard/moderator" },
      { name: "Flagged Content", href: "/dashboard/moderator/flagged" },
    ],
    ADMIN: [
      { name: "Overview", href: "/dashboard/admin" },
      { name: "Payment Verification", href: "/dashboard/admin/payments" },
      { name: "System Logs", href: "/dashboard/admin/logs" },
    ],
  };

  const currentLinks = navLinks[role];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-zinc-900/30 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Portal</p>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {role.charAt(0) + role.slice(1).toLowerCase()} Access
          </h2>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {currentLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-transparent"}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
