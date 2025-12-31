import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import MainHeader from '@/components/MainHeader/MainHeader';
import MainHeaderSkeleton from '@/components/MainHeader/MainHeaderSkeleton';
import { SuppressDevToolsError } from '@/lib/suppress-devtools-error';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { ToastContainer } from '@/components/Toast';

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
        <ToastProvider>
          <SuppressDevToolsError />
          <Suspense key="main-header" fallback={<MainHeaderSkeleton />}>
            <MainHeader />
          </Suspense>
          <ToastContainer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
