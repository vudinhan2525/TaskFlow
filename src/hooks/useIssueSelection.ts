import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { IIssue } from "@libs/types/issue";
import { selectIssue as selectIssueAction } from "../store/slices/projectSlice";

export function useIssueSelection() {
  const dispatch = useDispatch();
  const { selectedIssueId, selectedIssue, isLoading } = useSelector((state: RootState) => state.project);

  const selectIssue = useCallback(
    (issue: IIssue | null) => {
      dispatch(selectIssueAction(issue));
    },
    [dispatch]
  );

  return {
    selectedIssueId,
    selectIssue,
    selectedIssue,
    isLoading,
    isSidebarVisible: !!selectedIssue,
  };
}
