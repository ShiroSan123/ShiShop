import Link from "next/link";
import { listProductsServer } from "@/lib/serverProducts";
import { PRODUCT_STATUS_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const products = await listProductsServer();
  const total = products.length;
  const available = products.filter((product) => product.status === "available")
    .length;
  const sold = products.filter((product) => product.status === "sold").length;
  const personal = products.filter((product) => product.type === "personal")
    .length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Дашборд</h1>
          <p className="text-sm text-slate-500">
            Краткая статистика по каталогу
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>Добавить товар</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Всего товаров</div>
          <div className="text-2xl font-semibold text-slate-900">{total}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">
            {PRODUCT_STATUS_LABELS.available}
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {available}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">
            {PRODUCT_STATUS_LABELS.sold}
          </div>
          <div className="text-2xl font-semibold text-slate-900">{sold}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">
            {PRODUCT_TYPE_LABELS.personal}
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {personal}
          </div>
        </div>
      </div>

      <div className="surface-card p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Быстрые действия
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Перейдите в таблицу товаров, чтобы редактировать, удалять и менять
          статус.
        </p>
        <Link href="/admin/products" className="mt-4 inline-flex">
          <Button variant="secondary">Открыть таблицу товаров</Button>
        </Link>
      </div>
    </div>
  );
}
