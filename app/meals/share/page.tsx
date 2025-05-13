import Link from 'next/link';

export default function MealsPage() {
  return (
    <main>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Meals Share Page</h1>
      <p>
        <Link href="/">Home</Link>
      </p>
      <p>
        <Link href="/meals">Back</Link>
      </p>
    </main>
  );
}
