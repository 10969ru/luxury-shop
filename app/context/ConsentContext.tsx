"use client";
import { createContext, useContext, useState } from 'react';

const ConsentContext = createContext({
  isAgreed: true,
  setIsAgreed: (val: boolean) => {}
});

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAgreed, setIsAgreed] = useState(true);
  return (
    <ConsentContext.Provider value={{ isAgreed, setIsAgreed }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => useContext(ConsentContext);