insert into public.products (title, slug, type, status, price, currency, description, images, created_at, updated_at)
values
  (
    'Винтажная камера Canon AE-1',
    'canon-ae1',
    'personal',
    'available',
    16500,
    'RUB',
    'Легендарная плёночная камера в отличном состоянии. В комплекте ремешок и крышка.',
    array[
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519183071298-a2962ae0b2db?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '12 days',
    now() - interval '4 days'
  ),
  (
    'Гитара Yamaha F310',
    'yamaha-f310',
    'personal',
    'sold',
    9800,
    'RUB',
    'Акустическая гитара для дома и репетиций. Состояние отличное, использовалась бережно.',
    array[
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '20 days',
    now() - interval '9 days'
  ),
  (
    'Кресло из ротанга',
    'rattan-chair',
    'personal',
    'available',
    7400,
    'RUB',
    'Лёгкое кресло для балкона или гостиной. Натуральный ротанг, мягкая подушка в комплекте.',
    array[
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '18 days',
    now() - interval '3 days'
  ),
  (
    'Пальто шерстяное',
    'wool-coat',
    'personal',
    'preorder',
    12400,
    'RUB',
    'Тёплое шерстяное пальто в классическом стиле. Размер M, надевалось пару раз.',
    array[
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '10 days',
    now() - interval '2 days'
  ),
  (
    'Набор книг по дизайну',
    'design-books',
    'personal',
    'available',
    5200,
    'RUB',
    '5 книг по графическому дизайну и типографике. Отличное состояние, без пометок.',
    array[
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '7 days',
    now() - interval '1 days'
  ),
  (
    'Мини LED проектор',
    'mini-led-projector',
    'china',
    'available',
    15900,
    'RUB',
    'Компактный проектор для домашнего кино. Поддержка HDMI, USB, Wi-Fi.',
    array[
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '6 days',
    now() - interval '1 days'
  ),
  (
    'Наушники с ANC',
    'anc-headphones',
    'china',
    'preorder',
    6900,
    'RUB',
    'Беспроводные наушники с активным шумоподавлением. 30 часов работы.',
    array[
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '5 days',
    now() - interval '1 days'
  ),
  (
    'Органайзер для кухни',
    'kitchen-organizer',
    'china',
    'available',
    1200,
    'RUB',
    'Набор контейнеров и органайзеров для хранения специй и сыпучих продуктов.',
    array[
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '4 days',
    now() - interval '1 days'
  ),
  (
    'Рюкзак городской',
    'city-backpack',
    'china',
    'sold',
    3100,
    'RUB',
    'Лёгкий рюкзак с отделением для ноутбука 15". Водоотталкивающая ткань.',
    array[
      'https://images.unsplash.com/photo-1509762774605-f07235a08f1f?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '14 days',
    now() - interval '10 days'
  ),
  (
    'Умная лампа',
    'smart-lamp',
    'china',
    'available',
    2600,
    'RUB',
    'Сценарии освещения, управление с телефона и голосовыми ассистентами.',
    array[
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80'
    ],
    now() - interval '3 days',
    now() - interval '1 days'
  );
