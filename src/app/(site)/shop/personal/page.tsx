import { ShopClient } from "@/components/shop/ShopClient";

export default function PersonalShopPage() {
  return (
    <ShopClient
      title="Личные вещи"
      description="Подборка предметов, которыми пользовался сам. Все вещи описаны честно и подробно."
      defaultType="personal"
    />
  );
}
