'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function MealDetailsNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success } = useToast();
  const hasShownNotification = useRef(false);

  useEffect(() => {
    const successParam = searchParams.get('success');

    // Prevent showing notification twice
    if (hasShownNotification.current) {
      return;
    }

    if (successParam === 'updated') {
      hasShownNotification.current = true;
      success('Recipe updated successfully!');
      // Remove the success parameter from URL
      const currentPath = window.location.pathname;
      router.replace(currentPath);
    }
  }, [searchParams, success, router]);

  return null;
}

