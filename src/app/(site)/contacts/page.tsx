import { Button } from "@/components/ui/Button";
import { TELEGRAM_USERNAME } from "@/lib/constants";

export default function ContactsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 fade-up">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Контакты
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Лучший способ связаться — Telegram. Я отвечаю в течение дня и всегда
          уточняю детали по товарам.
        </p>
      </div>

      <div className="surface-card grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Telegram
          </div>
          <div className="text-lg font-semibold text-slate-900">
            @{TELEGRAM_USERNAME}
          </div>
          <p className="text-sm text-slate-600">
            Пишите по любому товару или вопросу. Можно сразу отправить ссылку на
            нужный товар.
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-4">
          <div className="text-sm text-slate-600">
            Если хотите узнать статус конкретной позиции — просто отправьте её
            название.
          </div>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary">Написать в Telegram</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
