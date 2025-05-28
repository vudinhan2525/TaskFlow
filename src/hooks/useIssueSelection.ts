import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { IIssue } from "@libs/types/issue";
import {
  selectIssue as selectIssueAction,
  selectIssues as selectIssuesAction,
} from "../store/slices/projectSlice";

export function useIssueSelection() {
  const dispatch = useDispatch();
  const { selectedIssue, selectedIssues, isLoading } = useSelector(
    (state: RootState) => state.project,
  );

  const setSelectedIssue = useCallback(
    (issue: IIssue | null) => {
      dispatch(selectIssueAction(issue));
    },
    [dispatch],
  );

  const setSelectIssues = useCallback(
    (issues: Record<string, IIssue[]>) => {
      dispatch(selectIssuesAction(issues));
    },
    [dispatch],
  );

  return {
    setSelectedIssue,
    setSelectIssues,
    selectedIssue,
    selectedIssues,
    isLoading,
  };
}
