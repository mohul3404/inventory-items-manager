import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Toast, type ToastType } from './Toast';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = `toast-${Date.now()}-${crypto.randomUUID()}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<ToastContextType>(
    () => ({
      showSuccess: (message, duration) => showToast(message, 'success', duration),
      showError: (message, duration) => showToast(message, 'error', duration ?? 7000),
      showWarning: (message, duration) => showToast(message, 'warning', duration),
      showInfo: (message, duration) => showToast(message, 'info', duration),
      dismiss,
      clearAll
    }),
    [clearAll, dismiss, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-md flex-col gap-3 sm:right-6 sm:top-6"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        <div className="pointer-events-auto space-y-3">
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
