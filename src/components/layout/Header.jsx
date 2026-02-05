import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

const navLinks = [
  { name: 'Каталог', href: 'Shop' },
  { name: 'Личные вещи', href: 'ShopPersonal' },
  { name: 'Из Китая', href: 'ShopChina' },
  { name: 'Обо мне', href: 'About' },
  { name: 'Контакты', href: 'Contacts' },
];

export default function Header({ isAdmin }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    const url = createPageUrl(href);
    return location.pathname === url;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to={createPageUrl('Home')} 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground to-foreground/70 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">ShiShop</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={createPageUrl(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {isAdmin && (
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <User className="w-4 h-4" />
                  Админка
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-bold text-lg">Меню</span>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={createPageUrl(link.href)}
                        onClick={() => setOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        to={createPageUrl('AdminDashboard')}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      >
                        <User className="w-5 h-5" />
                        Админка
                      </Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
