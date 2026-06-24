import { useState, useMemo } from 'react';
import { products, CATEGORIES, SHOP_CONFIG, type Product } from '@/data/products';
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
import Icon from '@/components/ui/icon';

interface CartItem extends Product {
  qty: number;
}

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'Все' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

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
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const orderText = () => {
    const items = cart.map((i) => `• ${i.name} × ${i.qty} = ${i.price * i.qty} с.`).join('%0A');
    return `Здравствуйте! Новый заказ в ${SHOP_CONFIG.shopName}:%0A%0A${items}%0A%0AИтого: ${total} с.%0A%0AИмя: ${form.name}%0AТелефон: ${form.phone}%0AАдрес: ${form.address}%0A%0AПрикладываю скриншот чека.`;
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Топ-бар */}
      <div className="bg-[#1a1a1a] text-white text-xs py-2 hidden md:block">
        <div className="container px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} /> {SHOP_CONFIG.address}
            </span>
            <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Icon name="Phone" size={12} /> {SHOP_CONFIG.phone}
            </a>
          </div>
          <span className="text-gray-400">Доставка по Таджикистану</span>
        </div>
      </div>

      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container px-4 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => scrollTo('top')}
            className="flex-shrink-0 text-2xl font-black tracking-tight text-primary uppercase"
          >
            САБУРИ МОЛ
          </button>

          {/* Поиск по центру */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-sm border-2 border-border focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold mr-4">
              <button onClick={() => scrollTo('top')} className="hover:text-primary transition-colors uppercase text-xs tracking-wide">Главная</button>
              <button onClick={() => scrollTo('catalog')} className="hover:text-primary transition-colors uppercase text-xs tracking-wide">Каталог</button>
              <button onClick={() => scrollTo('contacts')} className="hover:text-primary transition-colors uppercase text-xs tracking-wide">Контакты</button>
            </nav>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm h-10 px-4">
                  <Icon name="ShoppingCart" size={18} />
                  <span className="ml-2 hidden sm:inline font-semibold">Корзина</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scale-in">
                      {count}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col w-full sm:max-w-md rounded-none">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-xl font-black uppercase tracking-wide">
                    {checkout ? 'Оформление заказа' : 'Корзина'}
                  </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <Icon name="ShoppingCart" size={48} />
                    <p>Корзина пуста</p>
                  </div>
                ) : !checkout ? (
                  <>
                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                      {cart.map((i) => (
                        <div key={i.id} className="flex gap-3 items-center border-b pb-4">
                          <img src={i.image} alt={i.name} className="w-20 h-20 rounded-sm object-cover bg-muted" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{i.name}</p>
                            <p className="text-primary font-bold mt-1">{i.price} с.</p>
                          </div>
                          <div className="flex items-center gap-0 border border-border rounded-sm overflow-hidden">
                            <button onClick={() => changeQty(i.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-sm font-bold">
                              −
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-bold border-x border-border">{i.qty}</span>
                            <button onClick={() => changeQty(i.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-sm font-bold">
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between text-xl font-black">
                        <span>ИТОГО:</span>
                        <span className="text-primary">{total} с.</span>
                      </div>
                      <Button className="w-full rounded-sm h-12 text-base font-bold uppercase tracking-wide" onClick={() => setCheckout(true)}>
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    <Input placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-sm h-11" />
                    <Input placeholder="Номер телефона" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-sm h-11" />
                    <Textarea placeholder="Адрес доставки" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-sm" />

                    <div className="rounded-sm bg-red-50 border border-red-200 p-4 space-y-2 text-sm">
                      <p className="font-bold flex items-center gap-2 text-primary">
                        <Icon name="CreditCard" size={16} /> Оплата через Dushanbe City Bank
                      </p>
                      <p>Переведите <b className="text-primary">{total} с.</b> на номер:</p>
                      <p className="font-mono font-black text-xl text-primary">{SHOP_CONFIG.dushanbeCityNumber}</p>
                      <p className="text-muted-foreground">Сделайте скриншот чека и отправьте нам в WhatsApp вместе с заказом.</p>
                    </div>

                    <div className="flex justify-between text-xl font-black pt-1">
                      <span>ИТОГО:</span>
                      <span className="text-primary">{total} с.</span>
                    </div>

                    <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${orderText()}`} target="_blank" rel="noreferrer" className="block">
                      <Button className="w-full rounded-sm h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase text-sm tracking-wide">
                        <Icon name="MessageCircle" size={18} className="mr-2" /> Отправить в WhatsApp
                      </Button>
                    </a>
                    <Button variant="ghost" className="w-full rounded-sm" onClick={() => setCheckout(false)}>
                      ← Назад к корзине
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 py-3 space-y-3 animate-fade-in">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск товаров..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-sm h-10" />
            </div>
            <div className="flex gap-4 text-sm font-bold uppercase tracking-wide">
              <button onClick={() => scrollTo('top')} className="hover:text-primary">Главная</button>
              <button onClick={() => scrollTo('catalog')} className="hover:text-primary">Каталог</button>
              <button onClick={() => scrollTo('contacts')} className="hover:text-primary">Контакты</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero-баннер */}
      <section id="top" className="bg-gradient-to-r from-primary to-red-700 text-white">
        <div className="container px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-red-200 uppercase text-xs tracking-[0.3em] font-bold mb-3">Новая коллекция</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1.0] mb-4">
              Всё для <br /> вашего стиля
            </h1>
            <p className="text-red-100 text-base mb-8 max-w-md">
              Одежда, аксессуары и часы. Быстрая доставка по {SHOP_CONFIG.address}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-red-50 rounded-sm h-12 px-8 font-bold uppercase tracking-wide text-sm"
                onClick={() => scrollTo('catalog')}
              >
                Смотреть каталог
              </Button>
              <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-sm h-12 px-6 font-bold text-sm">
                  <Icon name="Phone" size={16} className="mr-2" /> {SHOP_CONFIG.phone}
                </Button>
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-3 gap-2 opacity-30 hidden md:grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-white/20 rounded-sm" />
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="container px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'Truck', label: 'Быстрая доставка' },
            { icon: 'ShieldCheck', label: 'Гарантия качества' },
            { icon: 'CreditCard', label: 'Удобная оплата' },
            { icon: 'Headphones', label: 'Поддержка 24/7' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 text-sm">
              <Icon name={f.icon} size={20} className="text-primary flex-shrink-0" />
              <span className="font-semibold">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Каталог */}
      <section id="catalog" className="container px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Каталог <span className="text-primary">товаров</span>
          </h2>
          <span className="text-sm text-muted-foreground hidden md:block">{filtered.length} товаров</span>
        </div>

        {/* Фильтры + поиск мобильный */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-sm transition-colors ${
                  category === c
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground hover:bg-muted border border-border'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте другой запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, idx) => (
              <div
                key={p.id}
                className="group bg-card border border-border hover:border-primary hover:shadow-lg transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 uppercase">
                    {p.category}
                  </span>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-sm md:text-base leading-tight mb-1 line-clamp-2">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 hidden md:block line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-lg text-primary">{p.price} с.</span>
                    <Button
                      size="sm"
                      className="rounded-sm h-8 px-3 text-xs font-bold uppercase"
                      onClick={() => addToCart(p)}
                    >
                      <Icon name="ShoppingCart" size={14} className="md:mr-1" />
                      <span className="hidden md:inline">В корзину</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA-баннер */}
      <section className="bg-primary text-white my-4">
        <div className="container px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase">Есть вопросы по заказу?</h3>
            <p className="text-red-200 mt-1">Позвоните или напишите — ответим быстро</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`}>
              <Button className="bg-white text-primary hover:bg-red-50 rounded-sm font-bold h-11 px-6 text-sm uppercase">
                <Icon name="Phone" size={16} className="mr-2" /> {SHOP_CONFIG.phone}
              </Button>
            </a>
            <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer">
              <Button className="bg-[#25D366] hover:bg-[#1da851] rounded-sm font-bold h-11 px-6 text-sm uppercase">
                <Icon name="MessageCircle" size={16} className="mr-2" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts" className="container px-4 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6">
            Контакты
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm">
              <Icon name="MapPin" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Адрес</p>
                <p className="font-semibold">{SHOP_CONFIG.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm">
              <Icon name="Phone" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Телефон</p>
                <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`} className="font-semibold hover:text-primary transition-colors">
                  {SHOP_CONFIG.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm">
              <Icon name="CreditCard" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Dushanbe City Bank</p>
                <p className="font-black text-xl text-primary">{SHOP_CONFIG.dushanbeCityNumber}</p>
              </div>
            </div>
            <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm hover:border-green-400 transition-colors">
              <Icon name="MessageCircle" size={20} className="text-[#25D366] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                <p className="font-semibold">{SHOP_CONFIG.phone}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-[#1a1a1a] text-white rounded-sm p-6 md:p-8">
          <h3 className="text-2xl font-black uppercase mb-6">Как сделать заказ</h3>
          <ol className="space-y-5">
            {[
              { n: '01', t: 'Выберите товары', d: 'Добавьте нужные позиции в корзину' },
              { n: '02', t: 'Оформите заказ', d: 'Укажите имя, телефон и адрес доставки' },
              { n: '03', t: 'Оплатите', d: `Переведите сумму на Dushanbe City: ${SHOP_CONFIG.dushanbeCityNumber}` },
              { n: '04', t: 'Отправьте чек', d: 'Скиньте скриншот оплаты нам в WhatsApp' },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="text-3xl font-black text-primary leading-none flex-shrink-0 w-10">{s.n}</span>
                <div>
                  <p className="font-bold">{s.t}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-[#1a1a1a] text-white">
        <div className="container px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-2xl font-black uppercase text-primary mb-2">{SHOP_CONFIG.shopName}</p>
            <p className="text-gray-400 text-sm">Современный магазин одежды, аксессуаров и часов с доставкой по Таджикистану.</p>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <Icon name="MapPin" size={14} className="text-primary" /> {SHOP_CONFIG.address}
            </p>
            <a href={`tel:${SHOP_CONFIG.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Icon name="Phone" size={14} className="text-primary" /> {SHOP_CONFIG.phone}
            </a>
            <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Icon name="MessageCircle" size={14} className="text-[#25D366]" /> WhatsApp
            </a>
            <p className="flex items-center gap-2">
              <Icon name="CreditCard" size={14} className="text-primary" /> Dushanbe City: {SHOP_CONFIG.dushanbeCityNumber}
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="text-white font-bold uppercase text-xs tracking-wide mb-3">Навигация</p>
            <button onClick={() => scrollTo('top')} className="block hover:text-white transition-colors">Главная</button>
            <button onClick={() => scrollTo('catalog')} className="block hover:text-white transition-colors">Каталог</button>
            <button onClick={() => scrollTo('contacts')} className="block hover:text-white transition-colors">Контакты</button>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {SHOP_CONFIG.shopName}. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Index;