import { type AdminSession, type Product } from "./types";

interface Store {
  products: Product[];
  sessions: Record<string, AdminSession>;
}

// In-memory store via globalThis; resets on server restart.
const seedProducts = (): Product[] => {
  const now = Date.now();
  const days = (count: number) => new Date(now - count * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "p-001",
      title: "Винтажная камера Canon AE-1",
      slug: "canon-ae1",
      type: "personal",
      status: "available",
      price: 16500,
      currency: "RUB",
      description:
        "Легендарная плёночная камера в отличном состоянии. В комплекте ремешок и крышка.",
      images: [
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519183071298-a2962ae0b2db?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(12),
      updatedAt: days(4),
    },
    {
      id: "p-002",
      title: "Гитара Yamaha F310",
      slug: "yamaha-f310",
      type: "personal",
      status: "sold",
      price: 9800,
      currency: "RUB",
      description:
        "Акустическая гитара для дома и репетиций. Состояние отличное, использовалась бережно.",
      images: [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(20),
      updatedAt: days(9),
    },
    {
      id: "p-003",
      title: "Кресло из ротанга",
      slug: "rattan-chair",
      type: "personal",
      status: "available",
      price: 7400,
      currency: "RUB",
      description:
        "Лёгкое кресло для балкона или гостиной. Натуральный ротанг, мягкая подушка в комплекте.",
      images: [
        "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(18),
      updatedAt: days(3),
    },
    {
      id: "p-004",
      title: "Пальто шерстяное",
      slug: "wool-coat",
      type: "personal",
      status: "preorder",
      price: 12400,
      currency: "RUB",
      description:
        "Тёплое шерстяное пальто в классическом стиле. Размер M, надевалось пару раз.",
      images: [
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(10),
      updatedAt: days(2),
    },
    {
      id: "p-005",
      title: "Набор книг по дизайну",
      slug: "design-books",
      type: "personal",
      status: "available",
      price: 5200,
      currency: "RUB",
      description:
        "5 книг по графическому дизайну и типографике. Отличное состояние, без пометок.",
      images: [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(7),
      updatedAt: days(1),
    },
    {
      id: "p-006",
      title: "Мини LED проектор",
      slug: "mini-led-projector",
      type: "china",
      status: "available",
      price: 15900,
      currency: "RUB",
      description:
        "Компактный проектор для домашнего кино. Поддержка HDMI, USB, Wi‑Fi.",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(6),
      updatedAt: days(1),
    },
    {
      id: "p-007",
      title: "Наушники с ANC",
      slug: "anc-headphones",
      type: "china",
      status: "preorder",
      price: 6900,
      currency: "RUB",
      description:
        "Беспроводные наушники с активным шумоподавлением. 30 часов работы.",
      images: [
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(5),
      updatedAt: days(1),
    },
    {
      id: "p-008",
      title: "Органайзер для кухни",
      slug: "kitchen-organizer",
      type: "china",
      status: "available",
      price: 1200,
      currency: "RUB",
      description:
        "Набор контейнеров и органайзеров для хранения специй и сыпучих продуктов.",
      images: [
        "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(4),
      updatedAt: days(1),
    },
    {
      id: "p-009",
      title: "Рюкзак городской",
      slug: "city-backpack",
      type: "china",
      status: "sold",
      price: 3100,
      currency: "RUB",
      description:
        "Лёгкий рюкзак с отделением для ноутбука 15''. Водоотталкивающая ткань.",
      images: [
        "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(14),
      updatedAt: days(10),
    },
    {
      id: "p-010",
      title: "Умная лампа",
      slug: "smart-lamp",
      type: "china",
      status: "available",
      price: 2600,
      currency: "RUB",
      description:
        "Сценарии освещения, управление с телефона и голосовыми ассистентами.",
      images: [
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
      ],
      createdAt: days(3),
      updatedAt: days(1),
    },
  ];
};

const globalForStore = globalThis as typeof globalThis & {
  __shishopStore?: Store;
};

export const getStore = () => {
  if (!globalForStore.__shishopStore) {
    globalForStore.__shishopStore = {
      products: seedProducts(),
      sessions: {},
    };
  }

  return globalForStore.__shishopStore;
};
