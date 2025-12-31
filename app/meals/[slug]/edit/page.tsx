'use client';

import { useActionState, useEffect, useState } from 'react';
import { FormState } from '@/types/meals';
import ImagePicker from '@/components/ImagePicker';
import { updateMealHandler } from '@/lib/actions';
import MealShareFormSubmitButton from '@/components/Meals/MealShareFormSubmitButton/MealShareFormSubmitButton';
import { useToast } from '@/hooks/useToast';
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
  const { error: showError } = useToast();
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
      .catch((err) => {
        console.error('Error loading meal:', err);
        window.location.href = '/meals';
      });
  }, [slug, userEmail, isAdmin, authLoading]);

  const [formState, formAction] = useActionState(
    updateMealHandler.bind(null, slug),
    initialState,
  );

  // Show error notifications when formState changes
  useEffect(() => {
    if (formState.error) {
      showError(formState.message || 'An error occurred while updating the recipe');
    }
  }, [formState, showError]);

  if (loading || !authorized || !meal) {
    return (
      <div className={cl.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <header className={cl.header}>
        <h1>
          Edit <span className={cl.highlight}>Recipe</span>
        </h1>
        <p>Update your recipe information</p>
      </header>
      <main className={cl.main}>
        <form className={cl.form} action={formAction}>
          <div className={cl.row}>
            <p>
              <label htmlFor="name">Your Name</label>
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
            <label htmlFor="title">Title</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              defaultValue={formState.meal?.title || meal.title}
            />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input
              required
              type="text"
              id="summary"
              name="summary"
              defaultValue={formState.meal?.summary || meal.summary}
            />
          </p>
          <div>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              required
              id="instructions"
              name="instructions"
              rows={10}
              defaultValue={formState.meal?.instructions || meal.instructions}
            />
            <div className={cl.markdownHint}>
              💡 Markdown formatting supported
            </div>
            <div className={cl.markdownExamples}>
              <h4>Examples:</h4>
              <ul>
                <li><code># Heading</code> — level 1 heading</li>
                <li><code>## Subheading</code> — level 2 heading</li>
                <li><code>**bold text**</code> — bold formatting</li>
                <li><code>*italic*</code> — italic formatting</li>
                <li><code>1. First step</code> — numbered list</li>
                <li><code>- List item</code> — bulleted list</li>
                <li><code>:smile: :heart: :one:</code> — emojis (e.g., :one: :two:)</li>
              </ul>
            </div>
          </div>
          <ImagePicker
            name="image"
            label="Image (leave empty to keep current)"
          />
          {formState?.error && <p className={cl.error}>{formState?.error}:</p>}
          {formState?.message && <p className={cl.error}>{formState?.message}</p>}
          <p className={cl.actions}>
            <MealShareFormSubmitButton label="Save Changes" />
          </p>
        </form>
      </main>
    </>
  );
}

