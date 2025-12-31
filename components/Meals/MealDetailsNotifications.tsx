'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function MealDetailsNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success } = useToast();

  useEffect(() => {
    const successParam = searchParams.get('success');

    if (successParam === 'updated') {
      success('Recipe updated successfully!');
      // Remove the success parameter from URL
      const currentPath = window.location.pathname;
      router.replace(currentPath);
    }
  }, [searchParams, success, router]);

  return null;
}

