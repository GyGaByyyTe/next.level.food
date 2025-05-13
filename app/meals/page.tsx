import Link from 'next/link';

export default function MealsPage() {
  return (
    <main>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Meals List Page</h1>
      <p>
        <Link href="/">Home</Link>
      </p>
      <p>
        <Link href="/meals/1">Meal1</Link>
      </p>
      <p>
        <Link href="/meals/2">Meal2</Link>
      </p>
      <p>
        <Link href="/meals/share">Shared</Link>
      </p>
    </main>
  );
}
