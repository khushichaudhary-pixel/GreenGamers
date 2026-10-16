import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'success', duration = 4000, xp = null, isCelebration = false }) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 5);

      if (isCelebration) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#059669', '#10B981', '#F59E0B', '#34D399'],
        });
      }

      setToasts((prev) => [...prev, { id, title, message, type, xp }]);

      if (duration) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastSuccess = (title, message, xp = null) =>
    addToast({ title, message, type: 'success', xp, isCelebration: !!xp });

  const toastError = (title, message) =>
    addToast({ title, message, type: 'error' });

  const toastInfo = (title, message) =>
    addToast({ title, message, type: 'info' });

  const toastCelebration = (title, message, xp = null) =>
    addToast({ title, message, type: 'celebration', xp, isCelebration: true, duration: 6000 });

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        toastSuccess,
        toastError,
        toastInfo,
        toastCelebration,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
