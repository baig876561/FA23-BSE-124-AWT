import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // 1) Handle Hardcoded Admin Override logic (admin@adflow.com)
        if (credentials.email === "admin@adflow.com") {
          // Check if admin exists in DB, if not, create on the fly or just return mock session if strict.
          // Better logic: Find the real record so Prisma references don't break.
          let superAdmin: any = await prisma.user.findUnique({ where: { email: credentials.email } });
          
          if (!superAdmin) {
             const hashedPassword = await bcrypt.hash(credentials.password, 10);
             superAdmin = await (prisma.user as any).create({
                data: {
                  email: "admin@adflow.com",
                  password: hashedPassword,
                  name: "System Administrator",
                  role: "SUPER_ADMIN",
                  status: "APPROVED"
                }
             });
          } else {
             const isValid = await bcrypt.compare(credentials.password, (superAdmin as any).password);
             if (!isValid) throw new Error("Invalid password");
          }

          return { id: superAdmin.id, email: superAdmin.email, role: superAdmin.role, status: (superAdmin as any).status };
        }

        // 2) Standard Standard Flow
        const user: any = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with that email");
        }

        // 3) Strict PENDING wall!
        if ((user as any).status === "PENDING") {
           throw new Error("PENDING_APPROVAL");
        }
        if ((user as any).status === "REJECTED") {
           throw new Error("ACCOUNT_REJECTED");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, (user as any).password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { id: user.id, email: user.email, role: user.role, status: (user as any).status };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
