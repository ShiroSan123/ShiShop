import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Публичная часть: агрессивное кэширование (staleTime 5 мин, cacheTime 30 мин)
// Админка: короткое кэширование (staleTime 30 сек) для актуальности данных

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут — данные считаются свежими
      gcTime: 30 * 60 * 1000,   // 30 минут — хранение в кэше
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

// Хелперы для разных стратегий кэширования
export const cacheStrategies = {
  // Для публичного каталога — долгое кэширование
  publicCatalog: {
    staleTime: 5 * 60 * 1000,      // 5 минут
    gcTime: 30 * 60 * 1000,        // 30 минут
    refetchOnWindowFocus: false,
  },
  
  // Для страницы товара — среднее кэширование
  productPage: {
    staleTime: 3 * 60 * 1000,      // 3 минуты
    gcTime: 15 * 60 * 1000,        // 15 минут
    refetchOnWindowFocus: false,
  },
  
  // Для админки — короткое кэширование для актуальности
  admin: {
    staleTime: 30 * 1000,          // 30 секунд
    gcTime: 5 * 60 * 1000,         // 5 минут
    refetchOnWindowFocus: true,
  },
  
  // Для статистики в админке — очень короткое
  adminStats: {
    staleTime: 10 * 1000,          // 10 секунд
    gcTime: 60 * 1000,             // 1 минута
    refetchOnWindowFocus: true,
  },
};

export { queryClient };

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}