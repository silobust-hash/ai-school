import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page itself doesn't need auth check
  // We check the path via a wrapper approach
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}

async function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  // We can't easily check the current path in a layout,
  // so we'll render conditionally based on auth status
  const authed = await isAuthenticated();

  // If not authenticated, show children without admin nav
  // (the login page will be rendered as children)
  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <div className="pt-2">{children}</div>
    </div>
  );
}
