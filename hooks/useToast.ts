'use client';

import { useContext } from 'react';
import type { ToastContextType } from '@/lib/contexts/ToastContext';
import { ToastContext } from '@/lib/contexts/ToastContext';

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

