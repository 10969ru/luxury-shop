"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

interface ConsentContextType {
  isAgreed: boolean;
  setIsAgreed: (val: boolean) => void;

  showFog: boolean;
  setShowFog: (val: boolean) => void;

  logoutFog: boolean;
  setLogoutFog: (val: boolean) => void;
}

const ConsentContext = createContext<
  ConsentContextType | undefined
>(undefined);

export const ConsentProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showFog, setShowFog] = useState(false);

  // ★追加
  const [logoutFog, setLogoutFog] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem("hasAgreed");

    if (agreed === "true") {
      setIsAgreed(true);
    }
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        isAgreed,
        setIsAgreed,

        showFog,
        setShowFog,

        logoutFog,
        setLogoutFog
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error(
      "useConsent must be used within ConsentProvider"
    );
  }

  return context;
};