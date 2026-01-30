import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PRODUCT_STATUS_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/labels";
import { getProductBySlugServer } from "@/lib/serverProducts";
import { buildTelegramLink, formatPrice, getBaseUrl } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlugServer(slug);

  if (!product) {
    notFound();
  }

  const productUrl = `${getBaseUrl()}/product/${product.slug}`;
  const telegramLink = buildTelegramLink(product.title, productUrl);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] fade-up">
      <ProductGallery images={product.images} title={product.title} />
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge label={PRODUCT_TYPE_LABELS[product.type]} variant="muted" />
          <h1 className="text-3xl font-semibold text-slate-900">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Badge label={PRODUCT_STATUS_LABELS[product.status]} variant="accent" />
            <span>{formatPrice(product.price, product.currency)}</span>
          </div>
        </div>

        <div className="surface-card space-y-3 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Описание
          </div>
          <p className="text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="space-y-2">
          <a href={telegramLink} target="_blank" rel="noreferrer">
            <Button size="lg">Написать в Telegram</Button>
          </a>
          <div className="text-xs text-slate-500">
            Кнопка откроет Telegram с готовым сообщением и ссылкой на товар.
          </div>
        </div>
      </div>
    </div>
  );
}
