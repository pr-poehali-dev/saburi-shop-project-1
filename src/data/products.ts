// ============================================================
//  КАТАЛОГ ТОВАРОВ «САБУРИ МОЛ»
//  Чтобы обновить каталог — редактируйте только этот файл.
//  Скопируйте блок { ... } и измените название, цену, фото и категорию.
//  Цена указывается в сомони (TJS).
// ============================================================

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const CATEGORIES = ['Все', 'Одежда', 'Аксессуары', 'Часы'];

export const products: Product[] = [
  {
    id: 1,
    name: 'Льняная рубашка',
    price: 290,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/f34b97e3-06f9-45fa-965d-cb808839cff6.jpg',
    category: 'Одежда',
    description: 'Натуральный лён, свободный крой, дышащая ткань.',
  },
  {
    id: 2,
    name: 'Кожаная сумка',
    price: 540,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/3b806842-6640-4771-b98e-a18b4bd5c5f9.jpg',
    category: 'Аксессуары',
    description: 'Натуральная кожа карамельного оттенка, вместительная.',
  },
  {
    id: 3,
    name: 'Наручные часы',
    price: 720,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/6757282f-6fff-467a-bc80-3006a982d5eb.jpg',
    category: 'Часы',
    description: 'Классический дизайн, кожаный ремешок, кварцевый механизм.',
  },
  {
    id: 4,
    name: 'Льняная рубашка (белая)',
    price: 310,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/f34b97e3-06f9-45fa-965d-cb808839cff6.jpg',
    category: 'Одежда',
    description: 'Лёгкая летняя модель из чистого льна.',
  },
  {
    id: 5,
    name: 'Сумка-тоут',
    price: 480,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/3b806842-6640-4771-b98e-a18b4bd5c5f9.jpg',
    category: 'Аксессуары',
    description: 'Минималистичная форма, удобные ручки.',
  },
  {
    id: 6,
    name: 'Часы Premium',
    price: 950,
    image: 'https://cdn.poehali.dev/projects/2977d2bc-987f-430c-b46c-8061d0323ca1/files/6757282f-6fff-467a-bc80-3006a982d5eb.jpg',
    category: 'Часы',
    description: 'Премиальная модель с сапфировым стеклом.',
  },
];

// ============================================================
//  НАСТРОЙКИ ОПЛАТЫ И КОНТАКТОВ
//  Замените на свои реальные данные.
// ============================================================
export const SHOP_CONFIG = {
  dushanbeCityNumber: '+992 00 000 0000', // ← укажите свой номер Dushanbe City
  whatsappNumber: '992929221515', // ← номер WhatsApp без + и пробелов
  phone: '+992 92 922 15 15',
  shopName: 'Сабури Мол',
  city: 'Таджикистан, район Мастчох',
  address: 'Таджикистан, район Мастчох',
};