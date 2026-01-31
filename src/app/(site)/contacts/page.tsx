import { Button } from "@/components/ui/Button";
import { OTHER_SITE_URL, SITE_URL, TELEGRAM_USERNAME } from "@/lib/constants";

export default function ContactsPage() {
  const qrItems = [
    {
      id: "telegram",
      label: "Telegram",
      meta: `@${TELEGRAM_USERNAME}`,
      url: `https://t.me/${TELEGRAM_USERNAME}`,
    },
    {
      id: "site",
      label: "ShiShop",
      meta: SITE_URL,
      url: SITE_URL,
    },
    {
      id: "other-site",
      label: "Разработка сайтов",
      meta: OTHER_SITE_URL,
      url: OTHER_SITE_URL,
    },
  ];

  const buildQrUrl = (value: string) => {
    const params = new URLSearchParams({
      size: "240x240",
      data: value,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

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

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            QR-коды
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Сканируйте, чтобы открыть ссылки
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {qrItems.map((item) => (
            <div
              key={item.id}
              className="surface-card flex flex-col items-center gap-4 p-5 text-center"
            >
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 break-all">
                  {item.meta}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                <img
                  src={buildQrUrl(item.url)}
                  alt={`QR: ${item.label}`}
                  className="h-36 w-36"
                  loading="lazy"
                />
              </div>
              <a href={item.url} target="_blank" rel="noreferrer">
                <Button variant="secondary">Открыть</Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
