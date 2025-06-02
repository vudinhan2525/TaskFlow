import React from "react";
import { Search, Plus } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  addButtonText: string;
  showProjectFilters?: boolean;
  projectType?: string;
  projectAccess?: string;
  onProjectTypeChange?: (value: string) => void;
  onProjectAccessChange?: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onAddClick,
  addButtonText,
  showProjectFilters = false,
  projectType = "",
  projectAccess = "",
  onProjectTypeChange,
  onProjectAccessChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {showProjectFilters && (
          <div className="flex items-center space-x-2">
            <select
              value={projectType}
              onChange={(e) => onProjectTypeChange?.(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Scrum">Scrum</option>
              <option value="Kanban">Kanban</option>
            </select>
            <select
              value={projectAccess}
              onChange={(e) => onProjectAccessChange?.(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Access</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Teams">Teams</option>
            </select>
          </div>
        )}
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <Plus className="mr-2 h-4 w-4" />
        {addButtonText}
      </button>
    </div>
  );
};

export default SearchFilters;
