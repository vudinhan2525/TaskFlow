// PermissionContext.tsx
import { createContext, useContext } from "react";
import { PermissionResult } from "@libs/hooks/common/usePermission";

export const PermissionContext = createContext<PermissionResult | undefined>(
  undefined,
);

export const useRowPermission = () => {
  const ctx = useContext(PermissionContext);
  if (ctx === undefined)
    throw new Error(
      "useRowPermission must be used within PermissionContext.Provider",
    );
  return ctx;
};
