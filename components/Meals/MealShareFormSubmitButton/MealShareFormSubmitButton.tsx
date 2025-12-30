'use client';

import { useFormStatus } from 'react-dom';

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
    <button disabled={pending} type="submit">
      {pending ? pendingLabel : label}
    </button>
  );
}
