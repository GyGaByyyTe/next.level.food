import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/public/images/logo.png';
import cl from './MainHeader.module.css';
import MainHeaderBackground from '@/components/MainHeader/MainHeaderBackground';
import NavLink from '@/components/NavLink';

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={cl.header}>
        <Link href="/" className={cl.logo}>
          <Image priority src={logoImg} alt="Logo with food" />
          Next.Level Food
        </Link>

        <nav className={cl.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Community Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
