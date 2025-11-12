import { useState, useCallback, useRef } from 'react';
import { ToastData } from '../components/common/Toast';

const TOAST_DURATION = 3000; // 3 секунды

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const toastKey = `${message}-${type}`;

    setToasts((current) => {
      const existingToast = current.find((t) => t.message === message && t.type === type);

      // Очищаем предыдущий таймер
      if (toastTimersRef.current[toastKey]) {
        clearTimeout(toastTimersRef.current[toastKey]);
      }

      const newTimerId = setTimeout(() => {
        setToasts((curr) => curr.filter((t) => !(t.message === message && t.type === type)));
        delete toastTimersRef.current[toastKey];
      }, TOAST_DURATION);

      toastTimersRef.current[toastKey] = newTimerId;

      if (existingToast) {
        // Обновляем существующий тост
        return current.map((t) =>
          t.id === existingToast.id
            ? { ...t, count: (t.count || 1) + 1, duration: TOAST_DURATION, timestamp: Date.now() }
            : t
        );
      } else {
        // Создаём новый тост
        const id = Math.random().toString(36);
        const newToast: ToastData = {
          id,
          message,
          type,
          count: 1,
          duration: TOAST_DURATION,
          timestamp: Date.now(),
        };
        return [...current, newToast];
      }
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => {
      const toast = current.find((t) => t.id === id);
      if (toast) {
        const toastKey = `${toast.message}-${toast.type}`;
        if (toastTimersRef.current[toastKey]) {
          clearTimeout(toastTimersRef.current[toastKey]);
          delete toastTimersRef.current[toastKey];
        }
      }
      return current.filter((t) => t.id !== id);
    });
  }, []);

  return { toasts, showToast, removeToast };
};
