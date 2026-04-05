"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logActivity } from "./logs";

// Helper to gracefully avoid ForeignKey crashes on an empty DB
async function ensureDefaults(packageTier: string) {
  const city = await prisma.city.upsert({
     where: { name: "System Default City" },
     update: {},
     create: { name: "System Default City" }
  });

  const category = await prisma.category.upsert({
     where: { slug: "general" },
     update: {},
     create: { name: "General Category", slug: "general" }
  });

  const pkg = await prisma.package.upsert({
     where: { id: "pkg_tier_" + packageTier },
     update: {},
     create: { 
        id: "pkg_tier_" + packageTier,
        name: packageTier, 
        price: packageTier === "Premium" ? 150 : packageTier === "Enterprise" ? 500 : 50,
        durationDays: 30 
     }
  });

  return { cityId: city.id, categoryId: category.id, packageId: pkg.id };
}

export async function submitAd(formData: FormData) {
  try {
     const session = await getServerSession(authOptions);
     if (!session?.user?.email) return { error: "Requires authentication." };

     const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
     if (!dbUser) return { error: "User record not found in database." };

     const title = formData.get("title") as string;
     const description = formData.get("description") as string;
     const packageTier = formData.get("packageTier") as string || "Basic";
     
     let finalUrl = formData.get("mediaUrl") as string;
     const localFile = formData.get("localImage") as File | null;

     if (localFile && localFile.size > 0) {
        const bytes = await localFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = Date.now() + "_" + localFile.name.replace(/[^a-zA-Z0-9.]/g, "");
        const uploadDir = join(process.cwd(), "public", "uploads");
        
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
        
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
        finalUrl = "/api/media?file=" + filename;
     }

     if (!finalUrl || finalUrl.trim() === "") {
        return { error: "You must completely provide an image link or upload a file!" };
     }

     // Resolve foreign dependencies seamlessly
     const { cityId, categoryId, packageId } = await ensureDefaults(packageTier);

     const newAd = await prisma.ad.create({
        data: {
           userId: dbUser.id,
           title,
           description,
           status: "SUBMITTED", // Immediately throws into Mod queue
           cityId,
           categoryId,
           packageId,
           media: {
              create: {
                 sourceType: finalUrl.includes("youtube") ? "YOUTUBE" : "IMAGE",
                 originalUrl: finalUrl,
                 validationStat: "PENDING"
              }
           }
        }
     });

     await logActivity(dbUser.id, "CAMPAIGN_SUBMITTED", `Client submitted Ad ${newAd.id.split('-')[0]} for preliminary moderation.`, newAd.id);

     return { success: true, adId: newAd.id };
  } catch (error) {
     console.error("AD INSERTION ERROR:", error);
     return { error: String((error as any).message || error) };
  }
}

// Fetch Client's Own Ads
export async function getClientAds() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];
  
  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return [];

  return prisma.ad.findMany({
     where: { userId: dbUser.id },
     include: { package: true },
     orderBy: { createdAt: "desc" }
  });
}

// Global Mod/Admin Queues
export async function getModerationQueue() {
   return prisma.ad.findMany({
      where: { status: "SUBMITTED" },
      include: { media: true, user: { select: { email: true, id: true } } },
      orderBy: { createdAt: "asc" }
   });
}

export async function approveAdForPayment(adId: string) {
   const session = await getServerSession(authOptions);
   const dbUser = await prisma.user.findUnique({ where: { email: session?.user?.email as string } });
   
   await prisma.ad.update({
      where: { id: adId },
      data: { status: "PAYMENT_PENDING" }
   });

   if (dbUser) await logActivity(dbUser.id, "MODERATION_APPROVED", `Mod approved Ad ${adId.split('-')[0]}, demanding Payment.`, adId);
   return { success: true };
}

export async function rejectAd(adId: string) {
   const session = await getServerSession(authOptions);
   const dbUser = await prisma.user.findUnique({ where: { email: session?.user?.email as string } });

   await prisma.ad.update({
      where: { id: adId },
      data: { status: "DRAFT" } // Sent back to Draft so client can fix
   });

   if (dbUser) await logActivity(dbUser.id, "MODERATION_REJECTED", `Mod rejected Ad ${adId.split('-')[0]} back to client.`, adId);
   return { success: true };
}

export async function getPaymentQueue() {
   return prisma.ad.findMany({
      where: { status: "PAYMENT_SUBMITTED" }, // CHANGED from PAYMENT_PENDING to SUBMITTED to see the proofs!
      include: { package: true, payments: true, user: { select: { email: true, id: true } } },
      orderBy: { updatedAt: "asc" }
   });
}

export async function verifyPaymentAndPublish(adId: string) {
   const session = await getServerSession(authOptions);
   const dbUser = await prisma.user.findUnique({ where: { email: session?.user?.email as string } });

   const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: { status: "PUBLISHED", publishDate: new Date() }
   });

   // Mark payment verification natively
   await prisma.payment.updateMany({
      where: { adId: adId, status: "PENDING" },
      data: { status: "VERIFIED" }
   });

   if (dbUser) await logActivity(dbUser.id, "ADMIN_PUBLISHED", `System Admin confirmed wire transfer natively. Campaign LIVE.`, adId);
   return { success: true };
}
