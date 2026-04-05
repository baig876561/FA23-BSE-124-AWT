import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PaymentForm from "./PaymentForm";

export default async function PaymentPage(params: any) {
  const resolvedParams = await Promise.resolve(params.params);
  const adId = resolvedParams.id;
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) redirect("/auth/signin");

  const ad = await prisma.ad.findUnique({
     where: { id: adId, userId: dbUser.id },
     include: { package: true }
  });

  if (!ad || ad.status !== "PAYMENT_PENDING") {
     redirect("/dashboard/client");
  }

  return (
     <div className="w-full max-w-2xl mx-auto pb-20 pt-10">
       <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-zinc-400 text-sm mb-6">Your Ad "{ad.title}" was successfully approved by moderation! Please transfer the balance below and upload your proof of transaction to publish.</p>
          
          <div className="bg-zinc-950 border border-white/5 rounded-xl p-5 mb-8">
             <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500 text-sm">Package Tier:</span>
                <span className="text-white font-mono font-medium">{ad.package?.name || "Tier 1"}</span>
             </div>
             <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500 text-sm">Duration:</span>
                <span className="text-white font-mono font-medium">{ad.package?.durationDays || 30} Days</span>
             </div>
             <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                <span className="text-zinc-400 font-medium">Total Amount Due:</span>
                <span className="text-emerald-400 text-2xl font-bold">${ad.package?.price || 50}</span>
             </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-8">
             <p className="text-sm text-blue-400 font-semibold mb-2">Wire Transfer Details:</p>
             <p className="text-xs text-blue-300 font-mono">Bank: Global Trust Bank</p>
             <p className="text-xs text-blue-300 font-mono">Account Base: 884-2993-1002</p>
             <p className="text-xs text-blue-300 font-mono">Routing: 00299482</p>
          </div>

          <PaymentForm adId={ad.id} />
       </div>
     </div>
  );
}
