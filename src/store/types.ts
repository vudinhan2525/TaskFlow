import { Issue } from "../types";

export interface RootState {
  ui: {
    sidebarOpen: boolean;
    currentView: "board" | "backlog" | "roadmap";
    selectedIssueId: string | null;
    searchQuery: string;
    filters: {
      status: string[];
      priority: string[];
      assignee: string[];
      type: string[];
    };
    theme: "light" | "dark";
  };
}
