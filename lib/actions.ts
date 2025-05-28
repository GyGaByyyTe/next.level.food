'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateMealDto, FormState } from '@/types/meals';
import { saveMeal } from '@/lib/meals';

const isInvalidText = (text: string) => {
  return !text.trim().length;
};

export const shareMealHandler = async (
  formState: FormState,
  formData: FormData,
) => {
  const meal: CreateMealDto = {
    title: (formData.get('title') as string) || '',
    summary: (formData.get('summary') as string) || '',
    instructions: (formData.get('instructions') as string) || '',
    image: (formData.get('image') as File) || null,
    creator: (formData.get('name') as string) || '',
    creator_email: (formData.get('email') as string) || '',
  };

  if (
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    (meal.image as File).size === 0
  ) {
    return {
      meal,
      error: 'Invalid meal information',
      message: 'Please check your input and try again.',
    };
  }

  await saveMeal(meal);

  // Add this line to revalidate the meals page
  revalidatePath('/meals');

  redirect('/meals');
};
