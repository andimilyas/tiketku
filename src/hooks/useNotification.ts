import { useState, useCallback } from 'react';
import { useSnackbar, VariantType } from 'notistack';

interface NotificationOptions {
  variant?: VariantType;
  persist?: boolean;
  preventDuplicate?: boolean;
  autoHideDuration?: number;
}

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeNotifications, setActiveNotifications] = useState<Set<string>>(new Set());

  const showNotification = useCallback((
    message: string, 
    options: NotificationOptions = {}
  ) => {
    const {
      variant = 'default',
      persist = false,
      preventDuplicate = true,
      autoHideDuration = 5000
    } = options;

    // Prevent duplicate notifications
    if (preventDuplicate && activeNotifications.has(message)) {
      return;
    }

    const key = enqueueSnackbar(message, {
      variant,
      persist,
      autoHideDuration: persist ? undefined : autoHideDuration,
      onEntered: () => {
        setActiveNotifications(prev => new Set(prev).add(message));
      },
      onExited: () => {
        setActiveNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(message);
          return newSet;
        });
      }
    });

    return key;
  }, [enqueueSnackbar, activeNotifications]);

  const showSuccess = useCallback((message: string, options?: Omit<NotificationOptions, 'variant'>) => {
    return showNotification(message, { ...options, variant: 'success' });
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Omit<NotificationOptions, 'variant'>) => {
    return showNotification(message, { ...options, variant: 'error' });
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Omit<NotificationOptions, 'variant'>) => {
    return showNotification(message, { ...options, variant: 'warning' });
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Omit<NotificationOptions, 'variant'>) => {
    return showNotification(message, { ...options, variant: 'info' });
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification: closeSnackbar,
    activeNotifications: Array.from(activeNotifications)
  };
};