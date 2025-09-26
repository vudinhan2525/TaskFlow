import { create } from "zustand";
import { IIssue } from "@libs/types/issue";

interface IssueState {
  selectedIssueId: string | null;
  openIssueDetail: (issue: string) => void;
  closeIssueDetail: () => void;

  // selectedIssues: Record<string, IIssue[]>;
  // setSelectedIssues: (issues: Record<string, IIssue[]>) => void;
  selectedIssues: Map<string, Set<string>>;
  setSelectedIssues: (issues: Map<string, Set<string>>) => void;
}

const params = new URLSearchParams(window.location.search);
const selectedIssueId = params.get("selectedIssue");
export const useIssueStore = create<IssueState>((set) => ({
  selectedIssueId: selectedIssueId,

  openIssueDetail: (issueId) => {
    set({ selectedIssueId: issueId });
    const params = new URLSearchParams(window.location.search);
    params.set("selectedIssue", issueId);
    window.history.pushState({}, "", `?${params.toString()}`);
  },

  closeIssueDetail: () => {
    set({ selectedIssueId: null });
    const params = new URLSearchParams(window.location.search);
    params.delete("selectedIssue");
    window.history.pushState({}, "", `?${params.toString()}`);
  },


  selectedIssues: new Map<string, Set<string>>(),
  setSelectedIssues: (selectedIssues) => set({ selectedIssues }),
}));
