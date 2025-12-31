'use client';

import { useFormStatus } from 'react-dom';
import cl from './MealShareFormSubmitButton.module.css';

export interface MealShareFormSubmitButtonProps {
  label?: string;
  pendingLabel?: string;
}

export default function MealShareFormSubmitButton({
  label = 'Share Meal',
  pendingLabel = 'Submitting...',
}: MealShareFormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={cl.submitButton}>
      {pending ? pendingLabel : label}
    </button>
  );
}
