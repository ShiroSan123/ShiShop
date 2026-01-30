import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const AdminSidebar = () => {
  return (
    <aside className="flex flex-col gap-6 border-b border-slate-200 bg-white/95 px-6 py-6 lg:h-full lg:border-b-0 lg:border-r lg:py-8">
      <div>
        <div className="font-display text-xl text-slate-900">{SITE_NAME}</div>
        <div className="text-xs text-slate-500">Админ-панель</div>
      </div>
      <nav className="flex flex-wrap gap-2 text-sm text-slate-600 lg:flex-col">
        <Link href="/admin" className="rounded-xl px-3 py-2 hover:bg-slate-100">
          Дашборд
        </Link>
        <Link
          href="/admin/products"
          className="rounded-xl px-3 py-2 hover:bg-slate-100"
        >
          Товары
        </Link>
        <Link
          href="/admin/products/new"
          className="rounded-xl px-3 py-2 hover:bg-slate-100"
        >
          Добавить товар
        </Link>
      </nav>
    </aside>
  );
};
