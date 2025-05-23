import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project, Board, ISprint } from "@libs/types";
import { IIssue as Issue } from "@libs/types/issue";

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  currentBoard: Board | null;
  currentSprint: ISprint | null;
  selectedIssueId: string | null;
  selectedIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  currentBoard: null,
  currentSprint: null,
  selectedIssueId: null,
  selectedIssue: null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
    setCurrentSprint: (state, action: PayloadAction<ISprint | null>) => {
      state.currentSprint = action.payload;
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const { currentProject, currentBoard } = state;
      const updatedIssue = action.payload;

      // No need to update sprint since ISprint doesn't contain issues

      // Update issue in current board if exists
      if (currentBoard) {
        currentBoard.columns.forEach((column) => {
          const issueIndex = column.issues.findIndex(
            (i) => i.id === updatedIssue.id,
          );
          if (issueIndex !== -1) {
            column.issues[issueIndex] = updatedIssue;
          }
        });
      }

      // Update issue in current project
      if (currentProject?.boards) {
        currentProject.boards.forEach((board) => {
          board.columns.forEach((column) => {
            const issueIndex = column.issues.findIndex(
              (i) => i.id === updatedIssue.id,
            );
            if (issueIndex !== -1) {
              column.issues[issueIndex] = updatedIssue;
            }
          });
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    selectIssue: (state, action: PayloadAction<Issue | null>) => {
      if (action.payload === null) {
        state.selectedIssueId = null;
        state.selectedIssue = null;
        return;
      }

      // If there's currently a selected issue and trying to select an issue from a different sprint
      if (
        state.selectedIssue &&
        action.payload.sprint_id !== state.selectedIssue.sprint_id
      ) {
        // Unselect current issue and select the new one
        state.selectedIssueId = action.payload.id;
        state.selectedIssue = action.payload;
      } else {
        // Same sprint or no currently selected issue, just select the new issue
        state.selectedIssueId = action.payload.id;
        state.selectedIssue = action.payload;
      }
    },
  },
});

export const {
  setProjects,
  setCurrentProject,
  setCurrentBoard,
  setCurrentSprint,
  updateIssue,
  setLoading,
  setError,
  selectIssue,
} = projectSlice.actions;

export const projectReducer = projectSlice.reducer;
