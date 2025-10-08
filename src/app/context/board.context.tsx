import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BoardContextType {
  fieldVisibility: FieldVisibilityState;
  toggleField: (field: keyof FieldVisibilityState) => void;
  setFieldVisibility: (
    field: keyof FieldVisibilityState,
    value: boolean,
  ) => void;
  resetToDefault: () => void;
  overItemId?: string;
  setOverItemId: (id: string) => void;
}

export interface FieldVisibilityState {
  workType: boolean;
  workItemKey: boolean;
  epic: boolean;
  dueDate: boolean;
  labels: boolean;
  estimate: boolean;
  linkedWorkItems: boolean;
  priority: boolean;
  assignee: boolean;
  openWorkItemsInSidebar: boolean;
  workSuggestions: boolean;
}

const defaultFieldVisibility: FieldVisibilityState = {
  workType: true,
  workItemKey: true,
  epic: true,
  dueDate: true,
  labels: true,
  estimate: true,
  linkedWorkItems: true,
  priority: true,
  assignee: true,
  openWorkItemsInSidebar: true,
  workSuggestions: true,
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useFieldVisibility = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error(
      "useFieldVisibility must be used within a BoardContextProvider",
    );
  }
  return context;
};

export const useOverItem = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useOverItem must be used within a BoardContextProvider");
  }
  return context;
};

interface BoardContextProviderProps {
  children: ReactNode;
}

export const BoardContextProvider: React.FC<BoardContextProviderProps> = ({
  children,
}) => {
  const [fieldVisibility, setFieldVisibilityState] =
    useState<FieldVisibilityState>(defaultFieldVisibility);
  const [overItemId, setOverItemId] = useState<string | undefined>(undefined);
  const toggleField = (field: keyof FieldVisibilityState) => {
    setFieldVisibilityState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const setFieldVisibility = (
    field: keyof FieldVisibilityState,
    value: boolean,
  ) => {
    setFieldVisibilityState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetToDefault = () => {
    setFieldVisibilityState(defaultFieldVisibility);
  };

  const value: BoardContextType = {
    fieldVisibility,
    toggleField,
    setFieldVisibility,
    resetToDefault,
    overItemId,
    setOverItemId,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
