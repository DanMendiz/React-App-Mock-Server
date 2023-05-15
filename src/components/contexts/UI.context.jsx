import React, { createContext, useState, useCallback } from 'react';
import { TodosContext } from './todo.context';

export const UIContext = createContext({
  snackbar: {
    isOpen: false,
    message: '',
    hideDuration: 6000,
    onClose: () => {},
    message: 'success',
    showMessage: () => {},
  },
});

export const UIProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const onClose = () => {
    setOpen(false);
    setMessage('');
    setSeverity('');
  };

  const showMessage = ({ type, string }) => {
    console.log(type, string);
    setOpen(true);
    setMessage(string);
    setSeverity(type);
  };

  return (
    <UIContext.Provider
      value={{
        isOpen: open,
        hideDuration: 6000,
        onClose,
        message,
        showMessage,
        severity,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

/* <Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Note archived"
  action={action}
/>  */
