import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = (session.user as any).role;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "MODERATOR") {
    redirect("/dashboard/moderator");
  } else {
    redirect("/dashboard/client");
  }
}
