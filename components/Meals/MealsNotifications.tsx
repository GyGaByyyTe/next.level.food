'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function MealsNotifications() {
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

    if (successParam === 'created') {
      hasShownNotification.current = true;
      success('Recipe created successfully!');
      // Remove the success parameter from URL
      router.replace('/meals');
    } else if (successParam === 'updated') {
      hasShownNotification.current = true;
      success('Recipe updated successfully!');
      router.replace('/meals');
    }
  }, [searchParams, success, router]);

  return null;
}

