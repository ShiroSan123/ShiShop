import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[var(--bg)]/85 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-display text-xl text-slate-900">{SITE_NAME}</span>
            <span className="text-xs text-slate-500">{SITE_TAGLINE}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/shop">Магазин</Link>
            <Link href="/shop/personal">Личные вещи</Link>
            <Link href="/shop/china">Из Китая</Link>
            <Link href="/about">Обо мне</Link>
            <Link href="/contacts">Контакты</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/shop">
              <Button size="sm">Открыть каталог</Button>
            </Link>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 md:hidden">
          <Link href="/shop">Магазин</Link>
          <Link href="/shop/personal">Личные вещи</Link>
          <Link href="/shop/china">Из Китая</Link>
          <Link href="/about">Обо мне</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
      </div>
    </header>
  );
};
