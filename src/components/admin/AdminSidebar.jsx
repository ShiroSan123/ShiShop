import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Package, LogOut, Sparkles, ExternalLink } from 'lucide-react';
import { logoutAdmin } from '@/lib/supabase/adminAuth';
import { Button } from "@/components/ui/button";

const navItems = [
  { name: 'Дашборд', href: 'AdminDashboard', icon: LayoutDashboard },
  { name: 'Товары', href: 'AdminProducts', icon: Package },
];

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (href) => {
    const url = createPageUrl(href);
    return location.pathname === url;
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      window.location.href = createPageUrl('Home');
    }
  };

  return (
    <aside className="w-64 bg-card min-h-screen flex flex-col border-r border-border">
      {/* Logo */}
      <div className="p-6">
        <Link to={createPageUrl('AdminDashboard')} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <span className="text-foreground font-bold text-lg">ShiShop</span>
            <span className="block text-muted-foreground text-xs">Админ-панель</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={createPageUrl(item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to={createPageUrl('Home')} target="_blank">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/60 gap-2">
            <ExternalLink className="w-4 h-4" />
            Открыть сайт
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/60 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}
