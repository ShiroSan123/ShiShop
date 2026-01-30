import { Badge } from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4 fade-up">
        <Badge label="Обо мне" variant="accent" />
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Я собрал магазин из вещей, которые люблю сам
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          ShiShop — это мой личный проект. Я продаю аккуратные вещи, которыми
          пользовался, и параллельно подбираю полезные товары из Китая, которые
          проверяю и описываю без рекламных обещаний.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card space-y-4 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            История
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Отбор вместо перепродажи
          </h2>
          <p className="text-sm text-slate-600">
            Я не гонюсь за объёмами. В ShiShop попадают только вещи, которые я
            готов рекомендовать друзьям. Каждую позицию описываю честно: что
            хорошо, а что стоит учесть.
          </p>
        </div>
        <div className="surface-card space-y-4 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Подход
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Комфорт и быстрый контакт
          </h2>
          <p className="text-sm text-slate-600">
            Покупка начинается с сообщения в Telegram. Я отвечаю быстро, честно
            рассказываю о состоянии товара и помогаю с доставкой.
          </p>
        </div>
      </div>

      <div className="surface-soft p-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Если хотите узнать больше — пишите
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Я открыт к вопросам и всегда готов рассказать о товарах, сроках
          поставки и вариантах оплаты.
        </p>
      </div>
    </div>
  );
}
