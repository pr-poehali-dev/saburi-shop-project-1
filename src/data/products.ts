// ============================================================
//  КАТАЛОГ ТОВАРОВ «SABURI KIDS»
//  Чтобы обновить каталог — редактируйте только этот файл.
//  Скопируйте блок { ... } и измените нужные поля.
//  Цена указывается в сомони (TJS).
// ============================================================

export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: CategoryKey;
  description: string;
  badge?: string; // 'Новинка' | 'Хит' | 'Скидка'
}

export type CategoryKey = 'home' | 'kitchen' | 'jewelry' | 'kids';

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  color: string;        // Tailwind bg class
  textColor: string;    // Tailwind text class
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    key: 'home',
    label: 'Дом и интерьер',
    emoji: '🏠',
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: 'Декор, подушки, ковры, свечи и уютные мелочи для дома',
  },
  {
    key: 'kitchen',
    label: 'Кухня',
    emoji: '🍳',
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Посуда, кастрюли, миски и всё необходимое для готовки',
  },
  {
    key: 'jewelry',
    label: 'Украшения',
    emoji: '💍',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Кольца, ожерелья, браслеты и серьги ручной работы',
  },
  {
    key: 'kids',
    label: 'Детское',
    emoji: '🧸',
    color: 'bg-pink-50',
    textColor: 'text-pink-700',
    description: 'Игрушки, развивающие наборы и товары для детей',
  },
];

// Изображения — замените URL на ссылки ваших фото
const IMG = {
  home: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/d07b5576-3415-466d-a162-9c43d943485b.jpg',
  kitchen: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/ca26a29c-abf3-4e01-8563-7f6b993dd494.jpg',
  jewelry: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/11a13757-a67f-4b4e-9287-cce94ac16d0e.jpg',
  kids: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/5dae10b7-fce4-45c6-902a-3a1c2b983178.jpg',
};

export const products: Product[] = [
  // ——— ДОМ И ИНТЕРЬЕР ———
  {
    id: 1,
    name: 'Декоративные подушки (набор 2 шт)',
    price: 185,
    image: IMG.home,
    category: 'home',
    description: 'Мягкие подушки с традиционным орнаментом. Наполнитель — гипоаллергенный синтепон.',
    badge: 'Хит',
  },
  {
    id: 2,
    name: 'Керамическая ваза',
    price: 130,
    oldPrice: 160,
    image: IMG.home,
    category: 'home',
    description: 'Ручная роспись, высота 28 см. Подходит для живых и искусственных цветов.',
    badge: 'Скидка',
  },
  {
    id: 3,
    name: 'Ароматические свечи (набор 3 шт)',
    price: 95,
    image: IMG.home,
    category: 'home',
    description: 'Натуральный пчелиный воск, ароматы жасмина, розы и сандала.',
  },
  {
    id: 4,
    name: 'Настенное зеркало в раме',
    price: 340,
    image: IMG.home,
    category: 'home',
    description: 'Деревянная рама ручной работы, размер 50×70 см. Подходит для прихожей и спальни.',
    badge: 'Новинка',
  },

  // ——— КУХНЯ ———
  {
    id: 5,
    name: 'Набор кастрюль (5 предметов)',
    price: 480,
    image: IMG.kitchen,
    category: 'kitchen',
    description: 'Нержавеющая сталь, антипригарное покрытие. Подходят для всех типов плит.',
    badge: 'Хит',
  },
  {
    id: 6,
    name: 'Керамические миски (6 шт)',
    price: 210,
    oldPrice: 260,
    image: IMG.kitchen,
    category: 'kitchen',
    description: 'Цветные керамические миски разных размеров. Можно ставить в микроволновку и посудомойку.',
    badge: 'Скидка',
  },
  {
    id: 7,
    name: 'Деревянные лопатки (набор 4 шт)',
    price: 75,
    image: IMG.kitchen,
    category: 'kitchen',
    description: 'Бамбуковые лопатки разных форм. Экологичные, не царапают посуду.',
  },
  {
    id: 8,
    name: 'Кухонные весы электронные',
    price: 145,
    image: IMG.kitchen,
    category: 'kitchen',
    description: 'Точность до 1 г, максимум 5 кг. Съёмная чаша, работают от батареек.',
    badge: 'Новинка',
  },

  // ——— УКРАШЕНИЯ ———
  {
    id: 9,
    name: 'Золотое ожерелье с подвеской',
    price: 650,
    image: IMG.jewelry,
    category: 'jewelry',
    description: 'Позолоченный металл, подвеска в форме цветка. Длина цепочки 45 см.',
    badge: 'Хит',
  },
  {
    id: 10,
    name: 'Серебряные серьги-кольца',
    price: 290,
    oldPrice: 350,
    image: IMG.jewelry,
    category: 'jewelry',
    description: 'Нежные серьги-кольца из серебра 925 пробы. Диаметр 2 см.',
    badge: 'Скидка',
  },
  {
    id: 11,
    name: 'Браслет с натуральными камнями',
    price: 380,
    image: IMG.jewelry,
    category: 'jewelry',
    description: 'Натуральные камни (агат, бирюза), регулируемый размер. Ручная работа.',
  },
  {
    id: 12,
    name: 'Набор украшений (3 предмета)',
    price: 520,
    image: IMG.jewelry,
    category: 'jewelry',
    description: 'Кольцо + серьги + браслет в едином стиле. Идеальный подарочный набор.',
    badge: 'Новинка',
  },

  // ——— ДЕТСКОЕ ———
  {
    id: 13,
    name: 'Деревянный конструктор',
    price: 220,
    image: IMG.kids,
    category: 'kids',
    description: 'Развивающий набор из 50 деталей. Натуральное дерево, безопасные краски. От 3 лет.',
    badge: 'Хит',
  },
  {
    id: 14,
    name: 'Мягкая игрушка Мишка',
    price: 155,
    oldPrice: 195,
    image: IMG.kids,
    category: 'kids',
    description: 'Плюшевый мишка высотой 35 см. Гипоаллергенный наполнитель. От 0+.',
    badge: 'Скидка',
  },
  {
    id: 15,
    name: 'Набор для рисования',
    price: 180,
    image: IMG.kids,
    category: 'kids',
    description: '48 цветных карандашей + 12 фломастеров + скетчбук. От 4 лет.',
  },
  {
    id: 16,
    name: 'Интерактивный детский планшет',
    price: 390,
    image: IMG.kids,
    category: 'kids',
    description: 'Обучающий планшет: алфавит, цифры, музыка. Русский и таджикский язык. От 2 лет.',
    badge: 'Новинка',
  },
];

// ============================================================
//  НАСТРОЙКИ МАГАЗИНА
//  Замените на свои реальные данные.
// ============================================================
export const SHOP_CONFIG = {
  shopName: 'Saburi Kids',
  tagline: 'Всё для вашего дома и семьи',
  dushanbeCityNumber: '929221515',
  whatsappNumber: '992929221515',
  phone: '+992 92 922 15 15',
  address: 'Таджикистан, район Мастчох',
  ambassadorImage: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/ceb574d9-037c-44e9-be68-51d4eff50c26.jpg',
};
