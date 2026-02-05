import React from 'react';
import { Send, MessageCircle, Clock, Package, CreditCard, Truck } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
            Контакты
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Свяжитесь со мной любым удобным способом
          </p>

          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            <a 
              href="https://t.me/username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-gradient-to-br from-[#0088cc]/10 to-[#0088cc]/5 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Telegram</h3>
              <p className="text-muted-foreground text-sm mb-2">Основной способ связи</p>
              <p className="text-[#0088cc] font-medium group-hover:underline">@username</p>
            </a>

            <a 
              href="https://wa.me/79001234567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-foreground mb-1">WhatsApp</h3>
              <p className="text-muted-foreground text-sm mb-2">Альтернативная связь</p>
              <p className="text-[#25D366] font-medium group-hover:underline">+7 (900) 123-45-67</p>
            </a>
          </div>

          {/* Info blocks */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Как купить</h2>
            
            <div className="grid gap-4">
              <div className="p-6 bg-muted rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Бронирование</h3>
                    <p className="text-muted-foreground text-sm">
                      Напишите мне о товаре, который вас заинтересовал. 
                      Я отвечу в течение нескольких часов и забронирую его для вас.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Оплата</h3>
                    <p className="text-muted-foreground text-sm">
                      Принимаю оплату переводом на карту Сбербанка или Тинькофф. 
                      Реквизиты отправлю после подтверждения заказа.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Доставка</h3>
                    <p className="text-muted-foreground text-sm">
                      Отправляю СДЭК, Почтой России или Boxberry — на ваш выбор. 
                      Стоимость доставки рассчитывается отдельно.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Время ответа</h3>
                    <p className="text-muted-foreground text-sm">
                      Обычно отвечаю в течение 2-3 часов в дневное время (с 10:00 до 22:00 по Москве). 
                      Ночью могу ответить позже.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
