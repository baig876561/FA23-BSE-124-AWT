import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Strict Enforcement 
    if (token?.status === "PENDING") {
       return NextResponse.redirect(new URL("/auth/signin?error=PENDING_APPROVAL", req.url));
    }

    if (path.startsWith("/dashboard/admin") && token?.role !== "SUPER_ADMIN" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/dashboard/moderator") && token?.role !== "MODERATOR" && token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"]
};
