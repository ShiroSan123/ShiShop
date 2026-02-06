import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { getAdminSession } from '@/lib/supabase/adminAuth';

export default function Layout({ children, currentPageName }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getAdminSession();
        setIsAdmin(Boolean(session));
      } catch {
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, [currentPageName]);

  // Admin pages have their own layout
  const isAdminPage = currentPageName?.startsWith('Admin');

  if (isAdminPage) {
    return (
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
        <Header isAdmin={isAdmin} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
