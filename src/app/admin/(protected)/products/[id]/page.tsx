import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductByIdServer } from "@/lib/serverProducts";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdServer(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Редактирование товара
        </h1>
        <p className="text-sm text-slate-500">
          Обновите информацию и сохраните изменения.
        </p>
      </div>
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}
