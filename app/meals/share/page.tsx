'use client';

import { useActionState, useEffect, useState } from 'react';
import { FormState } from '@/types/meals';
import ImagePicker from '@/components/ImagePicker';
import { shareMealHandler } from '@/lib/actions';
import MealShareFormSubmitButton from '@/components/Meals/MealShareFormSubmitButton';
import { useToast } from '@/hooks/useToast';
import cl from './page.module.css';

const initialState: FormState = {
  meal: null,
  error: '',
  message: '',
};

export default function ShareMealPage() {
  const { error } = useToast();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [formState, formAction] = useActionState(
    shareMealHandler,
    initialState,
  );

  useEffect(() => {
    // Get user data from session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setUserEmail(session.user.email || '');
          setUserName(session.user.name || '');
        }
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
      });
  }, []);

  // Show error notifications when formState changes
  useEffect(() => {
    if (formState.error) {
      error(formState.message || 'An error occurred while creating the recipe');
    }
  }, [formState, error]);

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
          <div>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              required
              id="instructions"
              name="instructions"
              rows={10}
              defaultValue={formState.meal?.instructions}
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
