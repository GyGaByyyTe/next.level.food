import Link from 'next/link';
import logoImg from '@/public/images/logo.png';
import cl from './MainHeader.module.css';

export default function MainHeader() {
  return (
    <header className={cl.header}>
      <Link href="/" className={cl.logo}>
        <img src={logoImg.src} alt="Logo with food" />
        Next.Level Food
      </Link>

      <nav className={cl.nav}>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
