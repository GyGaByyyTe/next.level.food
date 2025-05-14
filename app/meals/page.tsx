import Link from 'next/link';
import MealsGrid from '@/components/Meals/MealsGrid';
import { getMeals } from '@/lib/meals';
import { Meal } from '@/types/meals';
import cl from './page.module.css';

export default function MealsPage() {
  const meals: Meal[] = getMeals();

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
        <MealsGrid meals={meals} />
      </main>
    </>
  );
}
