import cl from './MainHeader.module.css';
import MainHeaderBackground from '@/components/MainHeader/MainHeaderBackground';

export default function MainHeaderSkeleton() {
  return (
    <>
      <MainHeaderBackground />
      <header className={cl.header}>
        <div className={cl.logo}>
          <div style={{ width: '5rem', height: '5rem', backgroundColor: '#333' }} />
          <span style={{ opacity: 0.5 }}>Next.Level Food</span>
        </div>
        <nav className={cl.nav}>
          <ul>
            <li style={{ opacity: 0.5 }}>Browse Meals</li>
            <li style={{ opacity: 0.5 }}>Foodies Community</li>
            <li className={cl.authItem} style={{ width: '100px', opacity: 0.5 }}>
              Loading...
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

