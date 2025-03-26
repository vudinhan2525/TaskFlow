import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { projectReducer } from "./slices/projectSlice.ts";
import { uiReducer } from "./slices/uiSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setUser"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
