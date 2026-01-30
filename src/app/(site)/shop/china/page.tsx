import { ShopClient } from "@/components/shop/ShopClient";

export default function ChinaShopPage() {
  return (
    <ShopClient
      title="Перепродажа с Китая"
      description="Товары, которые я проверил и готов рекомендовать. Уточняйте сроки и наличие в Telegram."
      defaultType="china"
    />
  );
}
