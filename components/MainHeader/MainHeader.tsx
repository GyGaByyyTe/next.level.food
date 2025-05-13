import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/public/images/logo.png';
import cl from './MainHeader.module.css';
import MainHeaderBackground from '@/components/MainHeader/MainHeaderBackground';

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={cl.header}>
        <Link href="/public" className={cl.logo}>
          <Image priority src={logoImg} alt="Logo with food" />
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
    </>
  );
}
