import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sprint, Issue } from "../../types";

interface SprintState {
  sprints: Sprint[];
  currentSprint: Sprint | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SprintState = {
  sprints: [],
  currentSprint: null,
  isLoading: false,
  error: null,
};

const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
      state.sprints = action.payload;
    },
    setCurrentSprint: (state, action: PayloadAction<Sprint | null>) => {
      state.currentSprint = action.payload;
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.push(action.payload);
    },
    updateSprint: (state, action: PayloadAction<Sprint>) => {
      const index = state.sprints.findIndex((sprint) => sprint.id === action.payload.id);
      if (index !== -1) {
        state.sprints[index] = action.payload;
        if (state.currentSprint?.id === action.payload.id) {
          state.currentSprint = action.payload;
        }
      }
    },
    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter((sprint) => sprint.id !== action.payload);
      if (state.currentSprint?.id === action.payload) {
        state.currentSprint = null;
      }
    },
    addIssueToSprint: (state, action: PayloadAction<{ sprintId: string; issue: Issue }>) => {
      const { sprintId, issue } = action.payload;
      const sprint = state.sprints.find((s) => s.id === sprintId);
      if (sprint) {
        sprint.issues.push(issue);
        if (state.currentSprint?.id === sprintId) {
          state.currentSprint = sprint;
        }
      }
    },
    removeIssueFromSprint: (state, action: PayloadAction<{ sprintId: string; issueId: string }>) => {
      const { sprintId, issueId } = action.payload;
      const sprint = state.sprints.find((s) => s.id === sprintId);
      if (sprint) {
        sprint.issues = sprint.issues.filter((issue) => issue.id !== issueId);
        if (state.currentSprint?.id === sprintId) {
          state.currentSprint = sprint;
        }
      }
    },
    moveIssue: (
      state,
      action: PayloadAction<{
        fromSprintId: string;
        toSprintId: string;
        issueId: string;
      }>
    ) => {
      const { fromSprintId, toSprintId, issueId } = action.payload;
      const fromSprint = state.sprints.find((s) => s.id === fromSprintId);
      const toSprint = state.sprints.find((s) => s.id === toSprintId);

      if (fromSprint && toSprint) {
        const issue = fromSprint.issues.find((i) => i.id === issueId);
        if (issue) {
          fromSprint.issues = fromSprint.issues.filter((i) => i.id !== issueId);
          toSprint.issues.push(issue);

          // Update current sprint if affected
          if (state.currentSprint?.id === fromSprintId) {
            state.currentSprint = fromSprint;
          } else if (state.currentSprint?.id === toSprintId) {
            state.currentSprint = toSprint;
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
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
} = sprintSlice.actions;

export const sprintReducer = sprintSlice.reducer;
