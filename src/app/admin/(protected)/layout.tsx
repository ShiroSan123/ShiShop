import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { requireAdmin } from "@/lib/serverAuth";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f0ea_65%,#efe7dc_100%)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div className="flex flex-col">
          <AdminTopbar username={session.username} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
