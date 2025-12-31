'use client';

import { useEffect } from 'react';
import cl from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${cl.toast} ${cl[type]}`} onClick={onClose}>
      <div className={cl.content}>
        <span className={cl.icon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className={cl.message}>{message}</span>
      </div>
      <button className={cl.closeButton} onClick={onClose} aria-label="Закрыть">
        ✕
      </button>
    </div>
  );
}

