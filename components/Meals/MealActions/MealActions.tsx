'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMealHandler } from '@/lib/actions';
import { useAuth } from '@/hooks/useAuth';
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
    if (!confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteMealHandler(slug);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
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
        Редактировать
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={cl.deleteButton}
      >
        {isPending ? 'Удаление...' : 'Удалить'}
      </button>
    </div>
  );
}

