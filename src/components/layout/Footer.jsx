import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Send, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground to-foreground/70 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">ShiShop</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Личные вещи и находки из Китая. 
              Качественные товары по честным ценам.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <Link to={createPageUrl('ShopPersonal')} className="text-muted-foreground hover:text-foreground text-sm">
                  Личные вещи
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ShopChina')} className="text-muted-foreground hover:text-foreground text-sm">
                  Товары из Китая
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Shop')} className="text-muted-foreground hover:text-foreground text-sm">
                  Все товары
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Связаться</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://t.me/ShiruiSan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/79001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} ShiShop. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
