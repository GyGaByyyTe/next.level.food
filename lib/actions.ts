'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateMealDto, FormState } from '@/types/meals';
import { saveMeal } from '@/lib/meals';
import { auth } from '@/lib/auth';

const isInvalidText = (text: string) => {
  return !text.trim().length;
};

export const shareMealHandler = async (
  formState: FormState,
  formData: FormData,
) => {
  const session = await auth();

  const meal: CreateMealDto = {
    title: (formData.get('title') as string) || '',
    summary: (formData.get('summary') as string) || '',
    instructions: (formData.get('instructions') as string) || '',
    image: (formData.get('image') as File) || null,
    creator: (formData.get('name') as string) || '',
    // Используем email из сессии, если пользователь авторизован
    creator_email:
      session?.user?.email || (formData.get('email') as string) || '',
  };

  // Логирование для отладки
  console.log('Meal validation:', {
    title: meal.title,
    summary: meal.summary,
    instructions: meal.instructions,
    creator: meal.creator,
    creator_email: meal.creator_email,
    hasImage: !!meal.image,
    imageSize: meal.image ? (meal.image as File).size : 0,
    imageName: meal.image ? (meal.image as File).name : 'no file',
  });

  // Detailed validation with specific messages
  if (isInvalidText(meal.title)) {
    return {
      meal,
      error: 'Invalid title',
      message: 'Please enter a recipe title',
    };
  }

  if (isInvalidText(meal.summary)) {
    return {
      meal,
      error: 'Invalid description',
      message: 'Please enter a short recipe description',
    };
  }

  if (isInvalidText(meal.instructions)) {
    return {
      meal,
      error: 'Invalid instructions',
      message: 'Please enter cooking instructions',
    };
  }

  if (isInvalidText(meal.creator)) {
    return {
      meal,
      error: 'Invalid name',
      message: 'Please enter your name',
    };
  }

  if (isInvalidText(meal.creator_email) || !meal.creator_email.includes('@')) {
    return {
      meal,
      error: 'Invalid email',
      message: 'Please enter a valid email address',
    };
  }

  if (!meal.image) {
    return {
      meal,
      error: 'No image selected',
      message: 'Please select a recipe image',
    };
  }

  if ((meal.image as File).size === 0) {
    return {
      meal,
      error: 'Empty image',
      message: 'The selected image is empty. Please select another image',
    };
  }

  try {
    await saveMeal(meal);
  } catch (error) {
    let errorMessage = 'Failed to save recipe.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      meal,
      error: 'Save failed',
      message: errorMessage,
    };
  }

  // Add this line to revalidate the meals page
  revalidatePath('/meals');

  redirect('/meals?success=created');
};

export const updateMealHandler = async (
  slug: string,
  formState: FormState,
  formData: FormData,
) => {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      meal: null,
      error: 'Unauthorized',
      message: 'You must be logged in to update a meal.',
    };
  }

  const meal: Partial<CreateMealDto> = {
    title: (formData.get('title') as string) || '',
    summary: (formData.get('summary') as string) || '',
    instructions: (formData.get('instructions') as string) || '',
    image: (formData.get('image') as File) || null,
    creator: (formData.get('name') as string) || '',
  };

  if (
    isInvalidText(meal.instructions || '') ||
    isInvalidText(meal.title || '') ||
    isInvalidText(meal.summary || '') ||
    isInvalidText(meal.creator || '')
  ) {
    return {
      meal: meal as CreateMealDto,
      error: 'Invalid meal information',
      message: 'Please check your input and try again.',
    };
  }

  try {
    const { updateMeal } = await import('@/lib/meals');
    await updateMeal(slug, meal);
  } catch (error) {
    let errorMessage = 'Failed to update meal.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      meal: meal as CreateMealDto,
      error: 'Update Operation Failed',
      message: errorMessage,
    };
  }

  revalidatePath('/meals');
  revalidatePath(`/meals/${slug}`);

  redirect(`/meals/${slug}?success=updated`);
};

export const deleteMealHandler = async (
  slug: string,
) => {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('You must be logged in to delete a meal.');
  }

  try {
    const { deleteMeal } = await import('@/lib/meals');
    await deleteMeal(slug, session.user.email, session.user.isAdmin);
  } catch (error) {
    let errorMessage = 'Failed to delete meal.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }

  revalidatePath('/meals');

  redirect('/meals');
};
