'use client';

import { useActionState, useEffect, useState } from 'react';
import { FormState } from '@/types/meals';
import ImagePicker from '@/components/ImagePicker';
import { updateMealHandler } from '@/lib/actions';
import MealShareFormSubmitButton from '@/components/Meals/MealShareFormSubmitButton/MealShareFormSubmitButton';
import cl from './page.module.css';
import { Meal } from '@/types/meals';
import { useAuth } from '@/hooks/useAuth';

const initialState: FormState = {
  meal: null,
  error: '',
  message: '',
};

interface EditMealPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditMealPage({ params }: EditMealPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { userEmail, isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug || authLoading) return;

    // Загружаем данные рецепта и проверяем авторизацию
    fetch(`/api/meals/${slug}`)
      .then((res) => res.json())
      .then((mealData) => {
        if (!mealData || !userEmail) {
          window.location.href = '/meals';
          return;
        }

        // Проверяем права: администратор может редактировать любой рецепт
        const isCreator = mealData.creator_email === userEmail;

        if (!isAdmin && !isCreator) {
          alert('Вы можете редактировать только свои рецепты');
          window.location.href = '/meals';
          return;
        }

        setMeal(mealData);
        setAuthorized(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading meal:', error);
        window.location.href = '/meals';
      });
  }, [slug, userEmail, isAdmin, authLoading]);

  const [formState, formAction] = useActionState(
    updateMealHandler.bind(null, slug),
    initialState,
  );

  if (loading || !authorized || !meal) {
    return (
      <div className={cl.loading}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <>
      <header className={cl.header}>
        <h1>
          Редактировать <span className={cl.highlight}>рецепт</span>
        </h1>
        <p>Обновите информацию о вашем рецепте</p>
      </header>
      <main className={cl.main}>
        <form className={cl.form} action={formAction}>
          <div className={cl.row}>
            <p>
              <label htmlFor="name">Ваше имя</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                defaultValue={formState.meal?.creator || meal.creator}
              />
            </p>
          </div>
          <p>
            <label htmlFor="title">Название</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              defaultValue={formState.meal?.title || meal.title}
            />
          </p>
          <p>
            <label htmlFor="summary">Краткое описание</label>
            <input
              required
              type="text"
              id="summary"
              name="summary"
              defaultValue={formState.meal?.summary || meal.summary}
            />
          </p>
          <p>
            <label htmlFor="instructions">Инструкции</label>
            <textarea
              required
              id="instructions"
              name="instructions"
              rows={10}
              defaultValue={formState.meal?.instructions || meal.instructions}
            />
          </p>
          <ImagePicker
            name="image"
            label="Изображение (оставьте пустым, чтобы сохранить текущее)"
          />
          {formState?.error && <p className={cl.error}>{formState?.error}:</p>}
          {formState?.message && <p className={cl.error}>{formState?.message}</p>}
          <p className={cl.actions}>
            <MealShareFormSubmitButton label="Сохранить изменения" />
          </p>
        </form>
      </main>
    </>
  );
}

