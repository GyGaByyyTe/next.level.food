'use client';
import Link, { LinkProps } from 'next/link';
import cl from './NavLink.module.css';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavLink({
  href,
  children,
}: LinkProps & {
  children?: React.ReactNode | undefined;
}) {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={
        path.startsWith(href as string) ? `${cl.link} ${cl.active}` : cl.link
      }
    >
      {children}
    </Link>
  );
}
