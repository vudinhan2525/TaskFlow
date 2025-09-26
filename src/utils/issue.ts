import { IIssue } from "../types/issue";
import { useIssueStore } from "@libs/store/useIssueStore";

export function getIssuesNotEpic(issues: IIssue[]): IIssue[] {
  return issues.filter((issue) => issue.type !== "Epic");
}

export function getIssuesEpic(issues: IIssue[]): IIssue[] {
  return issues.filter((issue) => issue.type === "Epic");
}

export function getIssuesByEpic(issues: IIssue[]): {
  [epicId: string]: IIssue[];
} {
  const epicIssues: { [epicId: string]: IIssue[] } = {};
  issues.forEach((issue) => {
    if (issue.type === "Epic") return; // Skip epic issues
    const epicId = issue.parent_id || "no-epic";
    if (!epicIssues[epicId]) {
      epicIssues[epicId] = [];
    }
    epicIssues[epicId].push(issue);
  });
  return epicIssues;
}

export function isIssueSelected(
  issue: IIssue,
) {
  const { selectedIssues } = useIssueStore();
  return selectedIssues.get(issue.sprint_id || "")?.has(issue.id) ?? false;
}

export function toggleIssue(issue: string, sprintId: string, value?: boolean) {
  const { selectedIssues, setSelectedIssues } = useIssueStore();
  const newSelected = new Map(selectedIssues);

  if (!newSelected.has(sprintId)) {
    newSelected.set(sprintId, new Set());
  }
  const set = newSelected.get(sprintId)!;
  if (value === true) {
    set.add(issue);
    setSelectedIssues(newSelected);
    return;
  }
  if (value === false) {
    set.delete(issue);
    setSelectedIssues(newSelected);
    return;
  }
  if (set.has(issue)) set.delete(issue);
  else set.add(issue);

  setSelectedIssues(newSelected);
}
