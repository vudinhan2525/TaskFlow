import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
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
<<<<<<< Updated upstream
  isOpenModal:boolean
=======
  isOpenModal: boolean;
>>>>>>> Stashed changes
}

const initialState: UIState = {
  sidebarOpen: true,
  currentView: "board",
  selectedIssueId: null,
  searchQuery: "",
  filters: {
    status: [],
    priority: [],
    assignee: [],
    type: [],
  },
  theme: "light",
<<<<<<< Updated upstream
  isOpenModal:false,
=======
  isOpenModal: false,
>>>>>>> Stashed changes
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action: PayloadAction<UIState["currentView"]>) => {
      state.currentView = action.payload;
    },
    setSelectedIssueId: (state, action: PayloadAction<string | null>) => {
      state.selectedIssueId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<UIState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
<<<<<<< Updated upstream
    toggleModal: (state,action:PayloadAction<boolean>) => {
      state.isOpenModal= action.payload
=======
    toggleModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenModal = action.payload;
>>>>>>> Stashed changes
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  setSelectedIssueId,
  setSearchQuery,
  updateFilters,
  clearFilters,
  toggleTheme,
  toggleModal,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
