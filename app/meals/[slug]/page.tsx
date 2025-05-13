import Link from 'next/link';

export default function MealSlugPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Meal With slug Page
      </h1>
      <p>
        <Link href="/">Home</Link>
      </p>
      <p>
        <Link href="/meals">Back</Link>
      </p>
      <h3>{params.slug}</h3>
    </main>
  );
}
