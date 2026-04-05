"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "CLIENT" | "MODERATOR";

  if (!email || !password || !name) {
    return { error: "All fields are required." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       return { error: "Email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        status: "PENDING", // Enforce strict queue
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred during signup." };
  }
}

export async function getPendingUsers() {
   try {
     const users = await prisma.user.findMany({
       where: { status: "PENDING" },
       orderBy: { createdAt: "asc" }
     });
     return { users };
   } catch(e) {
     return { error: "Failed to fetch pending users." };
   }
}

export async function approveUser(userId: string) {
   try {
     await prisma.user.update({
       where: { id: userId },
       data: { status: "APPROVED" }
     });
     return { success: true };
   } catch (e) {
      return { error: "Failed to approve user." };
   }
}

export async function rejectUser(userId: string) {
   try {
     await prisma.user.update({
       where: { id: userId },
       data: { status: "REJECTED" }
     });
     return { success: true };
   } catch (e) {
      return { error: "Failed to reject user." };
   }
}
