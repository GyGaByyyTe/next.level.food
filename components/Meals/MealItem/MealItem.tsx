import Link from 'next/link';
import Image from 'next/image';
import { MealItemProps } from '@/types/meals';
import cl from './MealItem.module.css';

export default function MealItem({
  title,
  slug,
  image,
  summary,
  creator,
}: MealItemProps) {
  return (
    <article className={cl.meal}>
      <header>
        <div className={cl.image}>
          <Image src={image as string} alt={title} fill />
        </div>
        <div className={cl.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={cl.content}>
        <p className={cl.summary}>{summary}</p>
        <div className={cl.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
