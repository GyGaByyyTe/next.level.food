import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import MainHeader from '@/components/MainHeader/MainHeader';
import MainHeaderSkeleton from '@/components/MainHeader/MainHeaderSkeleton';
import { SuppressDevToolsError } from '@/lib/suppress-devtools-error';

export const metadata: Metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SuppressDevToolsError />
        <Suspense key="main-header" fallback={<MainHeaderSkeleton />}>
          <MainHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
