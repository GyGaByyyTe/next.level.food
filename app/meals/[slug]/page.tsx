import * as React from 'react';
import Image from 'next/image';
import cl from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

export default async function MealDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meal = await getMeal(slug);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={cl.header}>
        <div className={cl.image}>
          <Image fill src={meal.image as string} alt={meal.title} />
        </div>
        <div className={cl.headerText}>
          <h1>{meal.title}</h1>
          <p className={cl.creator}>
            by <a href={`mailto:${meal.creator_email}}`}>{meal.creator}</a>
          </p>
          <p className={cl.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={cl.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        />
      </main>
    </>
  );
}
