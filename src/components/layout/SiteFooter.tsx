import Link from "next/link";
import { SITE_NAME, TELEGRAM_USERNAME } from "@/lib/constants";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1.6fr_1fr]">
        <div className="space-y-3">
          <div className="font-display text-lg">{SITE_NAME}</div>
          <p className="text-sm text-slate-500">
            Аккуратная подборка личных вещей и проверенных товаров с Китая.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Навигация
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1 text-sm">
            <Link href="/shop" className="whitespace-nowrap hover:text-slate-900">
              Каталог
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/about" className="whitespace-nowrap hover:text-slate-900">
              Обо мне
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contacts" className="whitespace-nowrap hover:text-slate-900">
              Контакты
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/admin/login"
              className="whitespace-nowrap text-xs text-slate-500 hover:text-slate-900"
            >
              Админка
            </Link>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Связь
          </div>
          <div>Telegram: @{TELEGRAM_USERNAME}</div>
          <div>Ответ в течение дня</div>
        </div>
      </div>
    </footer>
  );
};
