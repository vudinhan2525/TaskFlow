import { create } from "zustand";
import { IUser } from "@libs/types/user";

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;

  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },

  error: null,
  setError: (error) => set({ error }),
}));
