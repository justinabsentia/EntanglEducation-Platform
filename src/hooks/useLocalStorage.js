import { useState, useEffect, useRef } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const isStorageEvent = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStorageEvent.current) {
      isStorageEvent.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) {
        try {
          isStorageEvent.current = true; 
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setStoredValue(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(error);
    }
  };

  return [storedValue, setValue];
};
