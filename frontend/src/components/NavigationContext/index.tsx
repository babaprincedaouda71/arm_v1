import React, { createContext, useContext, useState } from 'react';

type NavigationContextType = {
  path: { label: string; url: string }[];
  updatePath: (newPath: { label: string; url: string }[]) => void;
  initializePath: (initialPath: { label: string; url: string }[]) => void;
};

const defaultContext: NavigationContextType = {
  path: [],
  updatePath: () => {},
  initializePath: () => {},
};

export const NavigationContext = createContext<NavigationContextType>(defaultContext);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState<{ label: string; url: string }[]>([]);

  const updatePath = (newPath: { label: string; url: string }[]) => {
    setPath(newPath);
  };

  const initializePath = (initialPath: { label: string; url: string }[]) => {
    setPath(initialPath);
  };

  return (
    <NavigationContext.Provider value={{ path, updatePath, initializePath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};