'use client';

import { useActionState, useEffect, useState } from 'react';
import { FormState } from '@/types/meals';
import ImagePicker from '@/components/ImagePicker';
import { shareMealHandler } from '@/lib/actions';
import MealShareFormSubmitButton from '@/components/Meals/MealShareFormSubmitButton';
import cl from './page.module.css';

const initialState: FormState = {
  meal: null,
  error: '',
  message: '',
};

export default function ShareMealPage() {
  const [formState, formAction] = useActionState(
    shareMealHandler,
    initialState,
  );
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Получаем данные пользователя из сессии
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setUserEmail(session.user.email || '');
          setUserName(session.user.name || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
      });
  }, []);

  return (
    <>
      <header className={cl.header}>
        <h1>
          Share your <span className={cl.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={cl.main}>
        <form className={cl.form} action={formAction}>
          <div className={cl.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                defaultValue={formState.meal?.creator || userName}
                key={userName}
              />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input
                required
                type="email"
                id="email"
                name="email"
                defaultValue={formState.meal?.creator_email || userEmail}
                readOnly={!!userEmail}
                key={userEmail}
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
              defaultValue={formState.meal?.title}
            />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input
              required
              type="text"
              id="summary"
              name="summary"
              defaultValue={formState.meal?.summary}
            />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              required
              id="instructions"
              name="instructions"
              rows={10}
              defaultValue={formState.meal?.instructions}
            />
          </p>
          <ImagePicker name="image" label="Your image" />
          {formState?.error && <p>{formState?.error}:</p>}
          {formState?.message && <p>{formState?.message}</p>}
          <p className={cl.actions}>
            <MealShareFormSubmitButton />
          </p>
        </form>
      </main>
    </>
  );
}
