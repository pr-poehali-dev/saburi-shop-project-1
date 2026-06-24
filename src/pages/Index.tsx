import { useState, useMemo } from 'react';
import {
  products,
  CATEGORIES,
  SHOP_CONFIG,
  type Product,
  type CategoryKey,
} from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface CartItem extends Product {
  qty: number;
}

export default function Index() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  };

  const orderText = () => {
    const lines = cart
      .map((i) => `• ${i.name} × ${i.qty} = ${i.price * i.qty} с.`)
      .join('%0A');
    return `Здравствуйте! Заказ из Saburi Kids:%0A%0A${lines}%0A%0AИтого: ${total} с.%0A%0AИмя: ${form.name}%0AТелефон: ${form.phone}%0AАдрес: ${form.address}%0A%0AЧек оплаты прилагаю.`;
  };

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Считаем скидку
  const discount = (p: Product) =>
    p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-50 bg-[#7B2FBE] shadow-lg">
        {/* Top row */}
        <div className="container px-4 py-2.5 flex items-center gap-3">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 flex items-center gap-1.5 mr-2"
          >
            <span className="text-xl">⭐</span>
            <div className="leading-tight">
              <span className="text-white font-black text-lg tracking-tight">Saburi</span>
              <span className="text-purple-200 font-black text-lg"> Kids</span>
            </div>
          </button>

          {/* Search bar */}
          <div className="flex-1 flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Искать товары..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-4 pr-12 rounded-lg bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="absolute right-0 top-0 h-9 w-10 flex items-center justify-center bg-purple-400 hover:bg-purple-300 rounded-r-lg transition-colors">
                <Icon name="Search" size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex flex-col items-center gap-0.5 px-3 py-1 hover:bg-purple-600 rounded-lg transition-colors"
            >
              <Icon name="MessageCircle" size={20} className="text-white" />
              <span className="text-white text-[10px]">WhatsApp</span>
            </a>
            <a
              href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`}
              className="hidden md:flex flex-col items-center gap-0.5 px-3 py-1 hover:bg-purple-600 rounded-lg transition-colors"
            >
              <Icon name="Phone" size={20} className="text-white" />
              <span className="text-white text-[10px]">{SHOP_CONFIG.phone}</span>
            </a>

            {/* Cart */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <button className="relative flex flex-col items-center gap-0.5 px-3 py-1 hover:bg-purple-600 rounded-lg transition-colors">
                  <div className="relative">
                    <Icon name="ShoppingCart" size={22} className="text-white" />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-orange-400 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-[10px]">Корзина</span>
                </button>
              </SheetTrigger>

              {/* Cart side panel */}
              <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="px-5 py-4 border-b bg-[#7B2FBE]">
                  <SheetTitle className="text-white font-bold text-lg flex items-center gap-2">
                    <Icon name="ShoppingCart" size={20} />
                    Корзина
                    {count > 0 && <span className="text-purple-200 font-normal text-sm">· {count} товара</span>}
                  </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 p-8">
                    <Icon name="ShoppingCart" size={56} className="opacity-20" />
                    <p className="font-semibold text-base">Корзина пуста</p>
                    <p className="text-sm text-center text-muted-foreground">Добавьте товары из каталога</p>
                    <Button onClick={() => setCartOpen(false)} className="mt-2 rounded-full px-6">
                      Перейти в каталог
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cart.map((item) => {
                        const cat = CATEGORIES.find((c) => c.key === item.category);
                        return (
                          <div key={item.id} className="flex gap-3 bg-white rounded-xl border border-border p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover bg-muted flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">{cat?.emoji} {cat?.label}</p>
                              <p className="font-semibold text-sm leading-tight line-clamp-2 mt-0.5">{item.name}</p>
                              <p className="font-black text-primary mt-1">{item.price} с.</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => changeQty(item.id, -1)}
                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted text-sm font-bold"
                              >−</button>
                              <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                              <button
                                onClick={() => changeQty(item.id, 1)}
                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted text-sm font-bold"
                              >+</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-4 border-t bg-white space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Итого:</span>
                        <span className="font-black text-2xl text-primary">{total} с.</span>
                      </div>
                      <Button
                        className="w-full h-12 rounded-xl font-bold text-base"
                        onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                      >
                        Оформить заказ
                      </Button>
                      <button
                        onClick={() => setCart([])}
                        className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Очистить корзину
                      </button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Category nav bar */}
        <div className="bg-[#5c1f8f] border-t border-purple-700">
          <div className="container px-4">
            <div className="flex overflow-x-auto scrollbar-hide gap-1 py-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-white text-[#7B2FBE]'
                    : 'text-purple-100 hover:bg-purple-700'
                }`}
              >
                🛍️ Все товары
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setActiveCategory(cat.key); scrollToCatalog(); }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeCategory === cat.key
                      ? 'bg-white text-[#7B2FBE]'
                      : 'text-purple-100 hover:bg-purple-700'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ══ PROMO BANNERS ══ */}
      <section className="container px-4 pt-4 pb-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Big banner */}
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] text-white p-6 md:p-8 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-6" />
          <div>
            <span className="inline-block bg-orange-400 text-white text-xs font-black px-2 py-0.5 rounded-md mb-3">
              🔥 ГОРЯЧИЕ ПРЕДЛОЖЕНИЯ
            </span>
            <h1 className="font-black text-2xl md:text-3xl leading-tight mb-2">
              Всё для дома<br />и вашей семьи
            </h1>
            <p className="text-purple-200 text-sm">Доставка по Таджикистану · {SHOP_CONFIG.address}</p>
          </div>
          <Button
            onClick={scrollToCatalog}
            className="self-start mt-4 bg-white text-[#7B2FBE] hover:bg-purple-50 font-bold rounded-xl h-10 px-6"
          >
            В каталог →
          </Button>
        </div>

        {/* Side banners */}
        <div className="flex flex-row md:flex-col gap-3">
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white p-4 flex flex-col justify-between min-h-[76px]">
            <span className="text-2xl">💍</span>
            <div>
              <p className="font-black text-sm">Украшения</p>
              <p className="text-orange-100 text-xs">Скидки до 20%</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white p-4 flex flex-col justify-between min-h-[76px]">
            <span className="text-2xl">🧸</span>
            <div>
              <p className="font-black text-sm">Детское</p>
              <p className="text-pink-100 text-xs">Новинки сезона</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ROW ══ */}
      <section className="container px-4 py-3">
        <div className="bg-white rounded-xl border border-border px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: 'Truck', label: 'Доставка по Таджикистану', sub: 'Быстро и надёжно' },
            { icon: 'ShieldCheck', label: 'Гарантия качества', sub: 'На все товары' },
            { icon: 'CreditCard', label: 'Удобная оплата', sub: 'Dushanbe City' },
            { icon: 'Headphones', label: 'Поддержка', sub: SHOP_CONFIG.phone },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={f.icon} size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs leading-tight line-clamp-1">{f.label}</p>
                <p className="text-muted-foreground text-xs truncate">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CATALOG ══ */}
      <section id="catalog" className="container px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-xl">
            {activeCategory === 'all'
              ? 'Все товары'
              : `${CATEGORIES.find(c => c.key === activeCategory)?.emoji} ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
            <span className="text-muted-foreground font-normal text-sm ml-2">{filtered.length} товаров</span>
          </h2>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="X" size={12} /> Сбросить
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="font-bold text-lg">Ничего не найдено</p>
            <p className="text-muted-foreground text-sm mt-1">Попробуйте другой запрос</p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => { setSearch(''); setActiveCategory('all'); }}
            >
              Показать все товары
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((p) => {
              const cat = CATEGORIES.find((c) => c.key === p.category)!;
              const disc = discount(p);
              const inCart = cart.find((i) => i.id === p.id);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                    {/* Discount badge */}
                    {disc && (
                      <span className="absolute top-2 left-2 bg-[#f43f5e] text-white text-xs font-black px-1.5 py-0.5 rounded-md">
                        -{disc}%
                      </span>
                    )}
                    {p.badge === 'Новинка' && !disc && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-xs font-black px-1.5 py-0.5 rounded-md">
                        Новинка
                      </span>
                    )}
                    {p.badge === 'Хит' && !disc && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-black px-1.5 py-0.5 rounded-md">
                        🔥 Хит
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <p className="text-xs text-muted-foreground">{cat.emoji} {cat.label}</p>
                    <p className="text-sm font-semibold leading-tight line-clamp-2 flex-1">{p.name}</p>

                    {/* Price row */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-base text-foreground">{p.price} с.</span>
                      {p.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">{p.oldPrice} с.</span>
                      )}
                    </div>

                    {/* Add to cart */}
                    {inCart ? (
                      <div className="flex items-center justify-between border border-primary rounded-lg overflow-hidden h-8">
                        <button
                          onClick={() => changeQty(p.id, -1)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-primary/10 font-black text-primary transition-colors"
                        >−</button>
                        <span className="px-3 font-bold text-sm text-primary">{inCart.qty}</span>
                        <button
                          onClick={() => changeQty(p.id, 1)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-primary/10 font-black text-primary transition-colors"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p)}
                        className="h-8 w-full rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon name="Plus" size={14} /> В корзину
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══ CONTACTS ══ */}
      <section id="contacts" className="container px-4 py-8 mt-4">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="bg-[#7B2FBE] px-6 py-5">
            <h2 className="text-white font-black text-xl">Контакты и доставка</h2>
            <p className="text-purple-200 text-sm mt-1">Свяжитесь с нами любым удобным способом</p>
          </div>
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-6 space-y-3">
              {[
                { icon: 'MapPin', label: 'Адрес', value: SHOP_CONFIG.address },
                { icon: 'Phone', label: 'Телефон', value: SHOP_CONFIG.phone, href: `tel:${SHOP_CONFIG.phone.replace(/\s/g,'')}` },
                { icon: 'MessageCircle', label: 'WhatsApp', value: SHOP_CONFIG.phone, href: `https://wa.me/${SHOP_CONFIG.whatsappNumber}` },
                { icon: 'CreditCard', label: 'Dushanbe City Bank', value: SHOP_CONFIG.dushanbeCityNumber },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        className="font-semibold text-sm hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6">
              <p className="font-bold text-sm mb-4">Как сделать заказ</p>
              <ol className="space-y-3">
                {[
                  'Добавьте товары в корзину',
                  'Нажмите «Оформить заказ»',
                  `Переведите оплату на Dushanbe City: ${SHOP_CONFIG.dushanbeCityNumber}`,
                  'Отправьте скриншот чека в WhatsApp',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-[#1a1033] text-white mt-6">
        <div className="container px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <span className="font-black text-lg text-white">Saburi Kids</span>
            </div>
            <p className="text-purple-300 text-sm">
              Товары для дома, кухни, украшения и детские товары. Доставка по всему Таджикистану.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-purple-300 font-semibold text-xs uppercase tracking-wider mb-3">Каталог</p>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => { setActiveCategory(c.key); scrollToCatalog(); }}
                className="block text-purple-200 hover:text-white transition-colors"
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-purple-300 font-semibold text-xs uppercase tracking-wider mb-3">Контакты</p>
            <p className="text-purple-200 flex items-center gap-2">
              <Icon name="MapPin" size={14} /> {SHOP_CONFIG.address}
            </p>
            <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g,'')}`}
              className="text-purple-200 hover:text-white transition-colors flex items-center gap-2">
              <Icon name="Phone" size={14} /> {SHOP_CONFIG.phone}
            </a>
            <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2">
              <Icon name="MessageCircle" size={14} /> WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-purple-900 py-4 text-center text-xs text-purple-400">
          © {new Date().getFullYear()} {SHOP_CONFIG.shopName}. Все права защищены.
        </div>
      </footer>

      {/* ══ CHECKOUT MODAL ══ */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-[#7B2FBE] px-6 py-5">
            <DialogTitle className="text-white font-black text-xl flex items-center gap-2">
              <Icon name="ShoppingBag" size={22} /> Оформление заказа
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Items */}
            <div className="bg-secondary rounded-xl divide-y divide-border">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <span className="truncate mr-3 text-foreground">{i.name} <span className="text-muted-foreground">× {i.qty}</span></span>
                  <span className="font-bold text-primary flex-shrink-0">{i.price * i.qty} с.</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-2 border-t border-border">
              <span className="font-semibold text-muted-foreground">Итого к оплате:</span>
              <span className="font-black text-2xl text-primary">{total} с.</span>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <Input
                placeholder="Ваше имя *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl h-11"
              />
              <Input
                placeholder="Номер телефона *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl h-11"
              />
              <Textarea
                placeholder="Адрес доставки *"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Payment info */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-sm text-primary flex items-center gap-2">
                <Icon name="CreditCard" size={16} /> Оплата через Dushanbe City Bank
              </p>
              <p className="text-sm text-muted-foreground">
                Переведите <span className="font-black text-foreground">{total} с.</span> на номер:
              </p>
              <div className="bg-white border border-purple-200 rounded-lg py-2 px-4 text-center">
                <p className="font-black text-2xl text-primary tracking-widest">{SHOP_CONFIG.dushanbeCityNumber}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                После оплаты отправьте скриншот чека в WhatsApp: <span className="font-semibold text-foreground">{SHOP_CONFIG.phone}</span>
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${orderText()}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-base gap-2">
                <Icon name="MessageCircle" size={20} />
                Отправить заказ в WhatsApp
              </Button>
            </a>
            <p className="text-center text-xs text-muted-foreground">
              Откроется WhatsApp с заполненным заказом и инструкцией по оплате
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating cart button (mobile) */}
      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 md:hidden bg-primary text-primary-foreground rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-2 font-bold text-sm animate-scale-in"
        >
          <Icon name="ShoppingCart" size={18} />
          {count} товара · {total} с.
        </button>
      )}
    </div>
  );
}
