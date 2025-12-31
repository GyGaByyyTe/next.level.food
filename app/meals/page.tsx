import { Suspense } from 'react';
import Link from 'next/link';
import MealsGrid from '@/components/Meals/MealsGrid';
import MealsNotifications from '@/components/Meals/MealsNotifications';
import { getMeals } from '@/lib/meals';
import { Meal } from '@/types/meals';
import cl from './page.module.css';
import MealsLoadingPage from '@/app/meals/loading';

// Disable prerendering at build time to avoid MinIO calls during build
export const dynamic = 'force-dynamic';

async function Meals() {
  const meals: Meal[] = await getMeals();

  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <>
      <MealsNotifications />
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
        <Suspense key="meals-list" fallback={<MealsLoadingPage />}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
