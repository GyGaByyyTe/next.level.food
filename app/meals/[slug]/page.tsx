import * as React from 'react';
import Image from 'next/image';
import cl from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';
import MealActions from '@/components/Meals/MealActions';
import MealDetailsNotifications from '@/components/Meals/MealDetailsNotifications';
import MarkdownRenderer from '@/components/Meals/MarkdownRenderer';

export default async function MealDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meal = getMeal(slug);

  if (!meal) {
    notFound();
  }

  return (
    <>
      <MealDetailsNotifications />
      <header className={cl.header}>
        <div className={cl.image}>
          <Image fill src={meal.image as string} alt={meal.title} />
        </div>
        <div className={cl.headerText}>
          <h1>{meal.title}</h1>
          <p className={cl.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={cl.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <MarkdownRenderer content={meal.instructions} className={cl.instructions} />
        <MealActions
          slug={meal.slug}
          creatorEmail={meal.creator_email}
        />
      </main>
    </>
  );
}

// Disable prerendering for this page at build time
export const dynamic = 'force-dynamic';
