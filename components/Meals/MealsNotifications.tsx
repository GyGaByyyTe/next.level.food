'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function MealsNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success } = useToast();

  useEffect(() => {
    const successParam = searchParams.get('success');

    if (successParam === 'created') {
      success('Recipe created successfully!');
      // Remove the success parameter from URL
      router.replace('/meals');
    } else if (successParam === 'updated') {
      success('Recipe updated successfully!');
      router.replace('/meals');
    }
  }, [searchParams, success, router]);

  return null;
}

