'use client';

import { useToast } from '@/hooks/useToast';
import Toast from './Toast';
import cl from './ToastContainer.module.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={cl.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}

