import { createContext, useCallback, useContext, useState } from 'react';

const ContactPrefillContext = createContext(null);

export function ContactPrefillProvider({ children }) {
  const [prefill, setPrefill] = useState({
    interests: [],
    packageName: '',
    message: '',
    version: 0,
  });

  const setContactPrefill = useCallback(({ interests = [], packageName = '', message = '' }) => {
    setPrefill((prev) => ({
      interests,
      packageName,
      message,
      version: prev.version + 1,
    }));
  }, []);

  const clearContactPrefill = useCallback(() => {
    setPrefill({ interests: [], packageName: '', message: '', version: 0 });
  }, []);

  return (
    <ContactPrefillContext.Provider
      value={{ prefill, setContactPrefill, clearContactPrefill }}
    >
      {children}
    </ContactPrefillContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContactPrefill() {
  const ctx = useContext(ContactPrefillContext);
  if (!ctx) throw new Error('useContactPrefill must be used inside ContactPrefillProvider');
  return ctx;
}
