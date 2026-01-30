import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative grid items-center gap-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_35px_70px_rgba(31,28,23,0.12)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,#f0b289_0%,rgba(240,178,137,0.35)_45%,transparent_70%)]"
          aria-hidden
        />
        <div className="space-y-6 fade-up">
          <Badge label="ShiShop" variant="accent" />
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Личные вещи и проверенные находки из Китая — в одном месте
          </h1>
          <p className="text-base text-slate-600">
            Я собираю аккуратные подборки предметов, которыми пользовался сам,
            и готовые к покупке товары из Китая. Всё тщательно описано и
            проверено.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button size="lg">Перейти в каталог</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary">
                Обо мне
              </Button>
            </Link>
          </div>
        </div>
        <div className="surface-card grid gap-4 p-6">
          <div className="text-sm text-slate-500">Почему {SITE_NAME}</div>
          <ul className="space-y-4 text-sm text-slate-600">
            <li>
              <span className="font-semibold text-slate-900">
                Прозрачные описания
              </span>
              <div>Показываю состояние вещей и даю честные комментарии.</div>
            </li>
            <li>
              <span className="font-semibold text-slate-900">
                Сильный отбор
              </span>
              <div>В каталоге только то, что действительно стоит внимания.</div>
            </li>
            <li>
              <span className="font-semibold text-slate-900">
                Быстрый контакт
              </span>
              <div>Сразу пишите в Telegram и уточняйте детали.</div>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 fade-up">
        <div className="surface-card flex flex-col gap-4 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Каталог
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            Личные вещи
          </div>
          <p className="text-sm text-slate-600">
            Аккуратные предметы с историей: техника, одежда, декор и книги.
          </p>
          <Link href="/shop/personal" className="mt-auto">
            <Button variant="secondary">Смотреть подборку</Button>
          </Link>
        </div>
        <div className="surface-card flex flex-col gap-4 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Каталог
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            Перепродажа с Китая
          </div>
          <p className="text-sm text-slate-600">
            Проверенные товары и аккуратные комплекты с понятным сроком
            доставки.
          </p>
          <Link href="/shop/china" className="mt-auto">
            <Button variant="secondary">Смотреть подборку</Button>
          </Link>
        </div>
      </section>

      <section className="surface-soft grid gap-6 p-6 md:grid-cols-3 fade-up">
        <div>
          <div className="text-2xl font-semibold text-slate-900">10+</div>
          <div className="text-sm text-slate-600">позиций в каталоге</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-slate-900">24h</div>
          <div className="text-sm text-slate-600">среднее время ответа</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-slate-900">100%</div>
          <div className="text-sm text-slate-600">личный контроль качества</div>
        </div>
      </section>
    </div>
  );
}
