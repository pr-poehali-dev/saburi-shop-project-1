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

const BADGE_COLORS: Record<string, string> = {
  'Хит': 'bg-orange-500 text-white',
  'Новинка': 'bg-primary text-white',
  'Скидка': 'bg-red-500 text-white',
};

export default function Index() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setCartOpen(true);
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

  const catObj = CATEGORIES.find((c) => c.key === activeCategory);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── TOP INFO BAR ── */}
      <div className="bg-primary text-primary-foreground text-xs py-2 hidden md:block">
        <div className="container px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <Icon name="MapPin" size={12} /> {SHOP_CONFIG.address}
            </span>
            <a
              href={`tel:${SHOP_CONFIG.phone.replace(/\s/g,'')}`}
              className="flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity"
            >
              <Icon name="Phone" size={12} /> {SHOP_CONFIG.phone}
            </a>
          </div>
          <span className="opacity-80">Доставка по всему Таджикистану</span>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-border">
        <div className="container px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <button onClick={() => scrollTo('top')} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🌟</span>
            <span className="font-black text-xl text-primary tracking-tight leading-tight">
              Saburi<br className="hidden" /><span className="text-foreground"> Kids</span>
            </span>
          </button>

          {/* Search — desktop */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Icon name="Search" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold mr-2">
              <button onClick={() => scrollTo('top')} className="hover:text-primary transition-colors">Главная</button>
              <button onClick={() => scrollTo('catalog')} className="hover:text-primary transition-colors">Каталог</button>
              <button onClick={() => scrollTo('about')} className="hover:text-primary transition-colors">О нас</button>
              <button onClick={() => scrollTo('contacts')} className="hover:text-primary transition-colors">Контакты</button>
            </nav>

            {/* Cart button */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button className="relative rounded-full h-10 px-4 gap-2">
                  <Icon name="ShoppingCart" size={18} />
                  <span className="hidden sm:inline font-bold">Корзина</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black animate-scale-in">
                      {count}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              {/* ── CART SHEET ── */}
              <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader className="border-b pb-3">
                  <SheetTitle className="font-black text-xl flex items-center gap-2">
                    <Icon name="ShoppingCart" size={20} /> Корзина
                    {count > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">({count} товара)</span>
                    )}
                  </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <span className="text-6xl">🛒</span>
                    <p className="font-semibold">Корзина пуста</p>
                    <p className="text-sm text-center">Добавьте товары из каталога</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                      {cart.map((item) => {
                        const cat = CATEGORIES.find((c) => c.key === item.category);
                        return (
                          <div key={item.id} className="flex gap-3 items-start border-b border-border pb-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-18 h-18 w-[72px] h-[72px] rounded-xl object-cover bg-muted flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat?.color} ${cat?.textColor}`}>
                                {cat?.emoji} {cat?.label}
                              </span>
                              <p className="font-bold text-sm mt-1 leading-tight line-clamp-2">{item.name}</p>
                              <p className="text-primary font-black mt-1">{item.price} с.</p>
                            </div>
                            <div className="flex items-center border border-border rounded-full overflow-hidden flex-shrink-0">
                              <button
                                onClick={() => changeQty(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-sm font-black"
                              >−</button>
                              <span className="w-7 h-7 flex items-center justify-center text-sm font-bold">{item.qty}</span>
                              <button
                                onClick={() => changeQty(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-sm font-black"
                              >+</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-muted-foreground">Итого:</span>
                        <span className="font-black text-2xl text-primary">{total} с.</span>
                      </div>
                      <Button
                        className="w-full h-12 rounded-full font-black text-base"
                        onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                      >
                        Оформить заказ →
                      </Button>
                      <button
                        onClick={() => setCart([])}
                        className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Очистить корзину
                      </button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            {/* Burger mobile */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3 animate-fade-in">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              {['Главная','Каталог','О нас','Контакты'].map((l, i) => (
                <button key={l} onClick={() => scrollTo(['top','catalog','about','contacts'][i])} className="text-left p-2 hover:text-primary">
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-amber-50">
        <div className="container px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <span className="inline-block bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              🌟 Официальный магазин
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-4 text-foreground">
              Всё для <span className="text-primary">вашего</span><br />дома и семьи
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Товары для дома, кухни, украшения и детские товары — всё в одном месте.
              Доставка по всему Таджикистану.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full h-12 px-8 font-black text-base" onClick={() => scrollTo('catalog')}>
                Смотреть каталог
              </Button>
              <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-6 font-bold text-base border-2">
                  <Icon name="MessageCircle" size={18} className="mr-2" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); scrollTo('catalog'); }}
                className={`${cat.color} rounded-2xl p-4 text-left hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-current`}
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <p className={`font-black text-sm ${cat.textColor}`}>{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
      </section>

      {/* ── AMBASSADOR BANNER ── */}
      <section id="about" className="bg-gradient-to-r from-primary to-teal-600 text-white">
        <div className="container px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-teal-200 text-xs font-black uppercase tracking-widest mb-3">Наш бренд-амбассадор</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Настоящий Таджикистан<br />в каждой вещи
            </h2>
            <p className="text-teal-100 mb-6 max-w-md">
              Мы с любовью отбираем товары, отражающие традиции и современный стиль нашей страны.
              Каждая покупка — это частица нашей культуры.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[['500+', 'Товаров'], ['1 200+', 'Довольных клиентов'], ['3 года', 'На рынке']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-black text-2xl">{n}</p>
                  <p className="text-teal-200">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src={SHOP_CONFIG.ambassadorImage}
                  alt="Бренд-амбассадор Saburi Kids"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl px-3 py-2 shadow-lg">
                <p className="text-primary font-black text-sm">Saburi Kids ✨</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalog" className="container px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black">Наш каталог</h2>
            <p className="text-muted-foreground mt-1">
              {activeCategory === 'all'
                ? `Все товары · ${filtered.length} позиций`
                : `${catObj?.emoji} ${catObj?.label} · ${filtered.length} позиций`}
            </p>
          </div>
          {/* Search mobile visible here */}
          <div className="relative w-full md:w-72 md:hidden">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full h-10"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            🛍️ Все товары
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : `${cat.color} ${cat.textColor} hover:opacity-80`
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="font-bold text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте другой запрос или категорию</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => { setSearch(''); setActiveCategory('all'); }}>
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, idx) => {
              const cat = CATEGORIES.find((c) => c.key === p.category)!;
              return (
                <div
                  key={p.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col animate-fade-in"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.badge && (
                      <span className={`absolute top-2 left-2 text-xs font-black px-2 py-1 rounded-full ${BADGE_COLORS[p.badge]}`}>
                        {p.badge}
                      </span>
                    )}
                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${cat.color} ${cat.textColor}`}>
                      {cat.emoji}
                    </span>
                  </div>
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <p className={`text-xs font-bold ${cat.textColor} mb-1`}>{cat.label}</p>
                    <h3 className="font-black text-sm md:text-base leading-tight line-clamp-2 flex-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden md:block">{p.description}</p>
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <div>
                        <span className="font-black text-lg text-primary">{p.price} с.</span>
                        {p.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-1">{p.oldPrice} с.</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full h-8 px-3 font-bold text-xs flex-shrink-0"
                        onClick={() => addToCart(p)}
                      >
                        <Icon name="Plus" size={14} className="md:mr-1" />
                        <span className="hidden md:inline">В корзину</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="bg-secondary/60 border-t border-border">
        <div className="container px-4 py-14 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-black mb-6">Контакты</h2>
            <div className="space-y-3">
              {[
                { icon: 'MapPin', label: SHOP_CONFIG.address },
                { icon: 'Phone', label: SHOP_CONFIG.phone, href: `tel:${SHOP_CONFIG.phone.replace(/\s/g,'')}` },
                { icon: 'MessageCircle', label: 'WhatsApp: ' + SHOP_CONFIG.phone, href: `https://wa.me/${SHOP_CONFIG.whatsappNumber}` },
                { icon: 'CreditCard', label: 'Dushanbe City: ' + SHOP_CONFIG.dushanbeCityNumber },
              ].map(({ icon, label, href }) => (
                href ? (
                  <a key={icon} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary transition-colors">
                    <Icon name={icon} size={18} className="text-primary flex-shrink-0" />
                    <span className="font-semibold text-sm">{label}</span>
                  </a>
                ) : (
                  <div key={icon} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                    <Icon name={icon} size={18} className="text-primary flex-shrink-0" />
                    <span className="font-semibold text-sm">{label}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <h3 className="text-xl font-black mb-5">Как сделать заказ</h3>
            <ol className="space-y-4">
              {[
                { n: '01', t: 'Выберите товары', d: 'Добавьте нужные позиции в корзину' },
                { n: '02', t: 'Нажмите «Оформить заказ»', d: 'Укажите имя, телефон и адрес' },
                { n: '03', t: 'Переведите оплату', d: `Dushanbe City: ${SHOP_CONFIG.dushanbeCityNumber}` },
                { n: '04', t: 'Отправьте чек в WhatsApp', d: 'Скриншот подтверждения перевода' },
              ].map((s) => (
                <li key={s.n} className="flex gap-4 items-start">
                  <span className="text-2xl font-black text-primary/30 leading-none w-10 flex-shrink-0">{s.n}</span>
                  <div>
                    <p className="font-bold text-sm">{s.t}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-background">
        <div className="container px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌟</span>
              <span className="font-black text-xl text-primary">Saburi Kids</span>
            </div>
            <p className="text-sm opacity-60">Товары для дома, кухни, украшения и детские товары. Всё для вашей семьи.</p>
          </div>
          <div className="space-y-2 text-sm opacity-70">
            <p className="flex items-center gap-2"><Icon name="MapPin" size={14} className="text-primary opacity-100" /> {SHOP_CONFIG.address}</p>
            <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g,'')}`} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Icon name="Phone" size={14} className="text-primary opacity-100" /> {SHOP_CONFIG.phone}
            </a>
            <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Icon name="MessageCircle" size={14} className="text-green-400 opacity-100" /> WhatsApp
            </a>
          </div>
          <div className="space-y-2 text-sm opacity-70">
            <p className="text-white font-black text-xs uppercase tracking-widest mb-3 opacity-100">Каталог</p>
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => { setActiveCategory(c.key); scrollTo('catalog'); }}
                className="block hover:opacity-100 transition-opacity text-left">
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs opacity-40">
          © {new Date().getFullYear()} {SHOP_CONFIG.shopName}. Все права защищены.
        </div>
      </footer>

      {/* ── CHECKOUT MODAL ── */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-black text-2xl flex items-center gap-2">
              🛍️ Оформление заказа
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Order summary */}
            <div className="bg-secondary rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2 font-semibold">{i.name} × {i.qty}</span>
                  <span className="font-black text-primary flex-shrink-0">{i.price * i.qty} с.</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xl font-black">
              <span>Итого:</span>
              <span className="text-primary">{total} с.</span>
            </div>

            {/* Contact form */}
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

            {/* Payment instruction */}
            <div className="bg-primary/8 border-2 border-primary/20 rounded-xl p-4 space-y-2">
              <p className="font-black flex items-center gap-2 text-primary">
                <Icon name="CreditCard" size={18} /> Инструкция по оплате
              </p>
              <p className="text-sm leading-relaxed">
                Для завершения заказа переведите сумму{' '}
                <span className="font-black text-primary">{total} с.</span>{' '}
                на наш счёт в{' '}
                <span className="font-black">Dushanbe City Bank:</span>
              </p>
              <div className="bg-white rounded-lg px-4 py-2 text-center border border-primary/20">
                <p className="font-black text-2xl text-primary tracking-widest">
                  {SHOP_CONFIG.dushanbeCityNumber}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                После оплаты сделайте скриншот чека и отправьте нам в WhatsApp:{' '}
                <span className="font-bold text-foreground">{SHOP_CONFIG.phone}</span>
              </p>
            </div>

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${orderText()}`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-black text-base gap-2">
                <Icon name="MessageCircle" size={20} /> Отправить заказ в WhatsApp
              </Button>
            </a>
            <p className="text-center text-xs text-muted-foreground">
              Нажав кнопку, вы будете перенаправлены в WhatsApp с заполненным заказом
            </p>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
