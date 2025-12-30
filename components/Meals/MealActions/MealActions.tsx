'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMealHandler } from '@/lib/actions';
import cl from './MealActions.module.css';

interface MealActionsProps {
  slug: string;
  creatorEmail: string;
  userEmail: string | null | undefined;
}

export default function MealActions({
  slug,
  creatorEmail,
  userEmail,
}: MealActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Показываем кнопки только если пользователь - создатель рецепта
  if (!userEmail || userEmail !== creatorEmail) {
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
        await deleteMealHandler(slug, creatorEmail);
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

