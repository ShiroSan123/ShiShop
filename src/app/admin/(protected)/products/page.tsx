import { ProductTable } from "@/components/admin/ProductTable";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Товары</h1>
        <p className="text-sm text-slate-500">
          Управляйте ассортиментом, статусами и ценами.
        </p>
      </div>
      <ProductTable />
    </div>
  );
}
