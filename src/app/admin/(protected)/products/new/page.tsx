import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminProductNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Новый товар
        </h1>
        <p className="text-sm text-slate-500">
          Заполните информацию о товаре.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
