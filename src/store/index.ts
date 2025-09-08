import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { projectReducer } from "./slices/projectSlice";
// import { sprintReducer } from "./slices/sprintSlice";
// import { uiReducer } from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ["auth/setUser"],
  //       ignoredPaths: ["auth.user"],
  //     },
  //   }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
