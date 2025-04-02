import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  setSprints,
  setCurrentSprint,
  addSprint,
  updateSprint,
  deleteSprint,
  addIssueToSprint,
  removeIssueFromSprint,
  moveIssue,
  setLoading,
  setError,
} from "../store/slices/sprintSlice";
import type { Sprint, Issue } from "../types";

export const useSprint = () => {
  const dispatch = useDispatch();
  const { sprints, currentSprint, isLoading, error } = useSelector((state: RootState) => state.sprint);

  const handleSetSprints = (sprints: Sprint[]) => {
    dispatch(setSprints(sprints));
  };

  const handleSetCurrentSprint = (sprint: Sprint | null) => {
    dispatch(setCurrentSprint(sprint));
  };

  const handleAddSprint = (sprint: Sprint) => {
    dispatch(addSprint(sprint));
  };

  const handleUpdateSprint = (sprint: Sprint) => {
    dispatch(updateSprint(sprint));
  };

  const handleDeleteSprint = (sprintId: string) => {
    dispatch(deleteSprint(sprintId));
  };

  const handleAddIssueToSprint = (sprintId: string, issue: Issue) => {
    dispatch(addIssueToSprint({ sprintId, issue }));
  };

  const handleRemoveIssueFromSprint = (sprintId: string, issueId: string) => {
    dispatch(removeIssueFromSprint({ sprintId, issueId }));
  };

  const handleMoveIssue = (fromSprintId: string, toSprintId: string, issueId: string) => {
    dispatch(moveIssue({ fromSprintId, toSprintId, issueId }));
  };

  const handleSetLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  const handleSetError = (error: string | null) => {
    dispatch(setError(error));
  };

  return {
    // State
    sprints,
    currentSprint,
    isLoading,
    error,

    // Actions
    setSprints: handleSetSprints,
    setCurrentSprint: handleSetCurrentSprint,
    addSprint: handleAddSprint,
    updateSprint: handleUpdateSprint,
    deleteSprint: handleDeleteSprint,
    addIssueToSprint: handleAddIssueToSprint,
    removeIssueFromSprint: handleRemoveIssueFromSprint,
    moveIssue: handleMoveIssue,
    setLoading: handleSetLoading,
    setError: handleSetError,
  };
};
