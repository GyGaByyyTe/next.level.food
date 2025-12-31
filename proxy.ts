import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Используем NextAuth с базовой конфигурацией без БД зависимостей для Edge Runtime
const { auth } = NextAuth(authConfig);

export default auth(() => {
  // Proxy logic can be added here if needed
  // For now, just let NextAuth handle authentication
})

export const config = {
  matcher: ['/meals/share'],
};

