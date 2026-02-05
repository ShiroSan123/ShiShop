import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, CheckCircle, ArrowRight, Send } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Обо мне
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Привет! Меня зовут [Имя]. Я веду этот магазин, чтобы дать вторую жизнь 
              своим вещам и делиться классными находками из Китая.
            </p>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">Что я делаю</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-500/15 dark:to-amber-500/10 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/25 flex items-center justify-center mb-6">
              <Package className="w-7 h-7 text-rose-600 dark:text-rose-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Продаю личные вещи</h3>
            <p className="text-muted-foreground mb-6">
              Качественная одежда, аксессуары и другие вещи, которые мне больше не нужны. 
              Всё в отличном состоянии, по честным ценам.
            </p>
            <ul className="space-y-3">
              {['Проверенное состояние', 'Реальные фото', 'Честные описания'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle className="w-5 h-5 text-rose-500 dark:text-rose-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-500/15 dark:to-emerald-500/10 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-500/25 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7 text-sky-600 dark:text-sky-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Нахожу товары в Китае</h3>
            <p className="text-muted-foreground mb-6">
              Отбираю интересные и качественные товары с китайских маркетплейсов. 
              Проверяю лично, прежде чем предложить вам.
            </p>
            <ul className="space-y-3">
              {['Тщательный отбор', 'Проверка качества', 'Выгодные цены'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle className="w-5 h-5 text-sky-500 dark:text-sky-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why me */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            Почему выбирают меня
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✨', title: 'Честность', desc: 'Всегда пишу реальное состояние товара' },
              { icon: '📸', title: 'Фото', desc: 'Только настоящие фотографии товаров' },
              { icon: '💬', title: 'На связи', desc: 'Быстро отвечаю на вопросы в Telegram' },
              { icon: '🚀', title: 'Доставка', desc: 'Отправляю удобным для вас способом' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-card rounded-2xl">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-foreground rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-background mb-4">
            Остались вопросы?
          </h2>
          <p className="text-background/70 mb-8 max-w-xl mx-auto">
            Напишите мне в Telegram — отвечу на все вопросы и помогу с выбором
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://t.me/username" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-base font-medium gap-2">
                <Send className="w-5 h-5" />
                Написать в Telegram
              </Button>
            </a>
            <Link to={createPageUrl('Shop')}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl text-base font-medium gap-2 border-2 border-background/40 text-background hover:bg-background/10">
                Смотреть каталог
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
