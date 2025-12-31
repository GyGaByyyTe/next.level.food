'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMealHandler } from '@/lib/actions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import cl from './MealActions.module.css';

interface MealActionsProps {
  slug: string;
  creatorEmail: string;
}

export default function MealActions({
  slug,
  creatorEmail,
}: MealActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { userEmail, isAdmin, isLoading } = useAuth();
  const { success, error } = useToast();

  // Don't show anything while loading
  if (isLoading) {
    return null;
  }

  // Показываем кнопки если пользователь - создатель рецепта или администратор
  const canModify = isAdmin || (userEmail && userEmail === creatorEmail);

  if (!canModify) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/meals/${slug}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteMealHandler(slug);
        success('Recipe deleted successfully!');
      } catch (err) {
        // Ignore NEXT_REDIRECT error - it's not a real error, but Next.js redirect mechanism
        // Next.js uses digest to identify redirects and NotFound errors
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof err.digest === 'string' &&
          err.digest.startsWith('NEXT_REDIRECT')
        ) {
          // This is a Next.js redirect, show notification before redirect
          success('Recipe deleted successfully!');
          // Re-throw it
          throw err;
        }
        console.log('error', err);
        if (err instanceof Error) {
          error(err.message);
        } else {
          error('Failed to delete recipe');
        }
      }
    });
  };

  return (
    <div className={cl.actions}>
      <button
        onClick={handleEdit}
        disabled={isPending}
        className={cl.editButton}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={cl.deleteButton}
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

