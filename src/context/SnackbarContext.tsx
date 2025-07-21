import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, SnackbarMessage } from '../components/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: Omit<SnackbarMessage, 'id'>) => void;
  showSuccess: (message: string, action?: SnackbarMessage['action']) => void;
  showError: (message: string, action?: SnackbarMessage['action']) => void;
  showInfo: (message: string, action?: SnackbarMessage['action']) => void;
  showWarning: (message: string, action?: SnackbarMessage['action']) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (message: Omit<SnackbarMessage, 'id'>) => {
    const snackbarMessage: SnackbarMessage = {
      ...message,
      id: Date.now().toString(),
    };
    setCurrentMessage(snackbarMessage);
  };

  const showSuccess = (message: string, action?: SnackbarMessage['action']) => {
    showSnackbar({ message, type: 'success', action });
  };

  const showError = (message: string, action?: SnackbarMessage['action']) => {
    showSnackbar({ message, type: 'error', action });
  };

  const showInfo = (message: string, action?: SnackbarMessage['action']) => {
    showSnackbar({ message, type: 'info', action });
  };

  const showWarning = (message: string, action?: SnackbarMessage['action']) => {
    showSnackbar({ message, type: 'warning', action });
  };

  const handleDismiss = () => {
    setCurrentMessage(null);
  };

  const contextValue: SnackbarContextType = {
    showSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar message={currentMessage} onDismiss={handleDismiss} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
