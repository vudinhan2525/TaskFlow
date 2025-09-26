import { create } from "zustand";
import { ITeam } from "@libs/types/team";

interface UserTeamState {
  userTeams: ITeam[] | null;
  setUserTeams: (userTeams: ITeam[] | null) => void;
}

export const useUserTeamStore = create<UserTeamState>((set) => ({
  userTeams: null,
  setUserTeams: (userTeams) => set({ userTeams }),
}));
