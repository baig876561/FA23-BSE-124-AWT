"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logActivity } from "./logs";

export async function submitPaymentProof(formData: FormData) {
  try {
     const session = await getServerSession(authOptions);
     if (!session?.user?.email) return { error: "Unauthenticated" };

     const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
     if (!dbUser) return { error: "User not found" };

     const adId = formData.get("adId") as string;
     const txRef = formData.get("txRef") as string;
     const localFile = formData.get("proofImage") as File | null;

     let finalUrl = null;

     if (localFile && localFile.size > 0) {
        const bytes = await localFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = "payment_" + Date.now() + "_" + localFile.name.replace(/[^a-zA-Z0-9.]/g, "");
        const uploadDir = join(process.cwd(), "public", "uploads");
        
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
        
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
        finalUrl = "/api/media?file=" + filename;
     }

     if (!finalUrl) return { error: "Payment Proof Image is strictly required." };

     // Fetch Ad and related Package to get the exact amount
     const ad = await prisma.ad.findUnique({ where: { id: adId }, include: { package: true } });
     if (!ad) return { error: "Ad not found." };

     // Create the secure Payment ledger record
     await prisma.payment.create({
        data: {
           userId: dbUser.id,
           adId: ad.id,
           amount: ad.package?.price || 50,
           proofUrl: finalUrl,
           transactionRef: txRef || null,
           status: "PENDING" // This means the Payment itself is Pending Verification
        }
     });

     // Escalate the Ad Status
     await prisma.ad.update({
        where: { id: ad.id },
        data: { status: "PAYMENT_SUBMITTED" }
     });

     // Record telemetry
     await logActivity(dbUser.id, "PAYMENT_SUBMISSION", `Client submitted $${ad.package?.price || 50} payment proof for Ad: ${ad.id.split('-')[0]}`, ad.id);

     return { success: true };
  } catch (error) {
     console.error("PAYMENT UPLOAD ERROR", error);
     return { error: String((error as any).message || error) };
  }
}
