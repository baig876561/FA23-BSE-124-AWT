"use server";

import prisma from "@/lib/prisma";

export async function logActivity(userId: string, actionCategory: string, detailMessage: string, associatedAdId?: string) {
  try {
     await prisma.auditLog.create({
        data: {
           userId: userId,
           action: actionCategory,
           details: detailMessage,
           adId: associatedAdId
        }
     });
     return true;
  } catch (error) {
     console.error("TELEMETRY FAILURE:", error);
     return false;
  }
}

export async function getSystemLogs() {
  return await prisma.auditLog.findMany({
     orderBy: { createdAt: "desc" },
     take: 50,
     include: { user: { select: { email: true, role: true } } }
  });
}
