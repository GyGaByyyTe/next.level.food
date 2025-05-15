import { Suspense } from 'react';
import Link from 'next/link';
import MealsGrid from '@/components/Meals/MealsGrid';
import { getMeals } from '@/lib/meals';
import { Meal } from '@/types/meals';
import cl from './page.module.css';
import MealsLoadingPage from '@/app/meals/loading';

async function Meals() {
  const meals: Meal[] = await getMeals();

  return <MealsGrid meals={meals} />;
}

export default async function MealsPage() {
  return (
    <>
      <header className={cl.header}>
        <h1>
          Delicious meals, created <span className={cl.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>
        <p className={cl.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={cl.main}>
        <Suspense fallback={<MealsLoadingPage />}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
