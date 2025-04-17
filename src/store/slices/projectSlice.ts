import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project, Board, Sprint } from "@libs/types";
import { IIssue as Issue } from "@libs/types/issue";

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  currentBoard: Board | null;
  currentSprint: Sprint | null;
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
    setCurrentSprint: (state, action: PayloadAction<Sprint | null>) => {
      state.currentSprint = action.payload;
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const { currentProject, currentBoard, currentSprint } = state;
      const updatedIssue = action.payload;

      // Update issue in current sprint if exists
      if (currentSprint) {
        const issueIndex = currentSprint.issues.findIndex((i) => i.id === updatedIssue.id);
        if (issueIndex !== -1) {
          currentSprint.issues[issueIndex] = updatedIssue;
        }
      }

      // Update issue in current board if exists
      if (currentBoard) {
        currentBoard.columns.forEach((column) => {
          const issueIndex = column.issues.findIndex((i) => i.id === updatedIssue.id);
          if (issueIndex !== -1) {
            column.issues[issueIndex] = updatedIssue;
          }
        });
      }

      // Update issue in current project
      if (currentProject?.boards) {
        currentProject.boards.forEach((board) => {
          board.columns.forEach((column) => {
            const issueIndex = column.issues.findIndex((i) => i.id === updatedIssue.id);
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
      console.log("Selecting issue in redux:", action.payload);
      state.selectedIssueId = action.payload?.id || null;
      state.selectedIssue = action.payload;
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
