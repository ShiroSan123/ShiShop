import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Heart, Send, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AisShop</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Уникальные находки и личные вещи в отличном состоянии. Всё
              проверено, всё качественно.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-3">
              {[
                { name: "Каталог", href: "Catalog" },
                { name: "Личные вещи", href: "CatalogPersonal" },
                { name: "Из Китая", href: "CatalogChina" },
                { name: "Мои заказы", href: "Orders" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.href)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-3">
              {[
                { name: "Обо мне", href: "About" },
                { name: "Контакты", href: "Contacts" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.href)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} AisShop. Все права защищены.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Сделано с <Heart className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
