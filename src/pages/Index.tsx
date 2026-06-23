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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <button onClick={() => scrollTo('top')} className="font-display text-2xl font-700 tracking-tight text-primary">
            Сабури Мол
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollTo('top')} className="hover:text-primary transition-colors">Главная</button>
            <button onClick={() => scrollTo('catalog')} className="hover:text-primary transition-colors">Каталог</button>
            <button onClick={() => scrollTo('contacts')} className="hover:text-primary transition-colors">Контакты</button>
          </nav>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative rounded-full">
                <Icon name="ShoppingBag" size={18} />
                <span className="ml-2 hidden sm:inline">Корзина</span>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {count}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">
                  {checkout ? 'Оформление заказа' : 'Ваша корзина'}
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
                      <div key={i.id} className="flex gap-3 items-center">
                        <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{i.name}</p>
                          <p className="text-sm text-muted-foreground">{i.price} с.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(i.id, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted">
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-5 text-center">{i.qty}</span>
                          <button onClick={() => changeQty(i.id, 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-muted">
                            <Icon name="Plus" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span className="text-primary">{total} с.</span>
                    </div>
                    <Button className="w-full rounded-full h-12" onClick={() => setCheckout(true)}>
                      Оформить заказ
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  <Input placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="Номер телефона" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Textarea placeholder="Адрес доставки" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

                  <div className="rounded-xl bg-accent/60 p-4 space-y-2 text-sm">
                    <p className="font-semibold flex items-center gap-2">
                      <Icon name="CreditCard" size={16} /> Как оплатить
                    </p>
                    <p>
                      Пожалуйста, переведите общую сумму <b>{total} с.</b> на номер Dushanbe City:
                    </p>
                    <p className="font-mono font-semibold text-primary">{SHOP_CONFIG.dushanbeCityNumber}</p>
                    <p>и отправьте скриншот чека нам в WhatsApp.</p>
                  </div>

                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span>Итого:</span>
                    <span className="text-primary">{total} с.</span>
                  </div>

                  <a
                    href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${orderText()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <Button className="w-full rounded-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white">
                      <Icon name="MessageCircle" size={18} className="mr-2" /> Отправить заказ в WhatsApp
                    </Button>
                  </a>
                  <Button variant="ghost" className="w-full" onClick={() => setCheckout(false)}>
                    Назад к корзине
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Главная / Hero */}
      <section id="top" className="container px-4 py-16 md:py-24 text-center">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4 animate-fade-in">{SHOP_CONFIG.city}</p>
        <h1 className="font-display text-5xl md:text-7xl font-700 leading-[1.05] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Стиль, который <br /> говорит за вас
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Тщательно отобранная коллекция одежды, аксессуаров и часов. Доставка по {SHOP_CONFIG.city}.
        </p>
        <Button size="lg" className="rounded-full h-12 px-8 animate-fade-in" style={{ animationDelay: '0.3s' }} onClick={() => scrollTo('catalog')}>
          Смотреть каталог
        </Button>
      </section>

      {/* Каталог */}
      <section id="catalog" className="container px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <h2 className="font-display text-4xl font-600">Каталог</h2>
          <div className="relative w-full md:w-80">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full h-11"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">Ничего не найдено</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {filtered.map((p, idx) => (
              <div
                key={p.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{p.category}</p>
                  <h3 className="font-display text-xl font-600 mt-1 mb-1">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 hidden md:block">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{p.price} с.</span>
                    <Button size="sm" className="rounded-full" onClick={() => addToCart(p)}>
                      <Icon name="Plus" size={16} className="md:mr-1" />
                      <span className="hidden md:inline">В корзину</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Контакты */}
      <section id="contacts" className="bg-secondary/50 border-t border-border">
        <div className="container px-4 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-4xl font-600 mb-4">Контакты</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Есть вопросы по заказу или товару? Напишите нам — ответим быстро.
            </p>
            <div className="space-y-3">
              <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} /> WhatsApp для заказов
              </a>
              <p className="flex items-center gap-3">
                <Icon name="MapPin" size={20} /> {SHOP_CONFIG.city}
              </p>
              <p className="flex items-center gap-3">
                <Icon name="CreditCard" size={20} /> Оплата: Dushanbe City {SHOP_CONFIG.dushanbeCityNumber}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-display text-2xl font-600 mb-4">Как оформить заказ</h3>
            <ol className="space-y-3 text-sm">
              {['Выберите товары и добавьте в корзину', 'Заполните данные доставки', 'Переведите сумму на Dushanbe City', 'Отправьте скриншот чека в WhatsApp'].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer className="container px-4 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {SHOP_CONFIG.shopName}. Все права защищены.
      </footer>
    </div>
  );
};

export default Index;
