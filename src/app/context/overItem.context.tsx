import React, { createContext, useContext, useState, ReactNode } from "react";

interface OverItemContextType {
  overItemId: string | null;
  setOverItemId: (id: string | null) => void;
}

const OverItemContext = createContext<OverItemContextType | undefined>(
  undefined,
);

export const useOverItem = () => {
  const context = useContext(OverItemContext);
  if (context === undefined) {
    throw new Error("useOverItem must be used within an OverItemProvider");
  }
  return context;
};

interface OverItemProviderProps {
  children: ReactNode;
}

export const OverItemProvider: React.FC<OverItemProviderProps> = ({
  children,
}) => {
  const [overItemId, setOverItemId] = useState<string | null>(null);

  return (
    <OverItemContext.Provider value={{ overItemId, setOverItemId }}>
      {children}
    </OverItemContext.Provider>
  );
};
