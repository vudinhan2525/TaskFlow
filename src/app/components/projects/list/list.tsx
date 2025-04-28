import React, { useState, useEffect } from "react";
import { FaPlus, FaFileAlt, FaChevronDown } from "react-icons/fa";
import { Issue, IssueStatus } from "@libs/types";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useProjectSprints } from "@libs/hooks/useSprint";
import StatusDropdown from "../backlog/StatusDropdown";
import CreateIssueModal from "../modals/createIssueModal";
import { toast } from "react-toastify";
import { formatDate } from "@libs/utils/date";

// Custom hook for debouncing values
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

interface ListProps {
  projectId?: string;
  issues?: Issue[];
}

const List: React.FC<ListProps> = ({ projectId, issues: propIssues }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const { selectIssue } = useIssueSelection();
  const { createIssueAsync } = useCreateIssue({ projectId: projectId || "" });
  const { updateIssueAsync } = useUpdateIssue({ projectId: projectId || "" });
  const { columns } = useProjectColumns(projectId || "");
  const { sprints } = useProjectSprints(projectId || "");

  // Local state for editing fields
  const [editValues, setEditValues] = useState({
    summary: "",
    description: "",
    storyPoint: 0,
  });

  // Track if values were changed by user
  const [valueChangedByUser, setValueChangedByUser] = useState({
    summary: false,
    description: false,
  });

  // Debounced values
  const debouncedSummary = useDebounce(editValues.summary, 500);
  const debouncedDescription = useDebounce(editValues.description, 500);

  // Update edit values when selecting an issue to edit
  useEffect(() => {
    if (editingIssueId) {
      const issue = propIssues?.find((i) => i.id === editingIssueId);
      if (issue) {
        setEditValues({
          summary: issue.summary || "",
          description: issue.description || "",
          storyPoint: issue.story_point || 0,
        });
        setValueChangedByUser({
          summary: false,
          description: false,
        });
      }
    }
  }, [editingIssueId, propIssues]);

  // Handle debounced updates
  useEffect(() => {
    if (editingIssueId && valueChangedByUser.summary) {
      handleSummaryChange(editingIssueId, debouncedSummary);
    }
  }, [debouncedSummary, editingIssueId, valueChangedByUser.summary]);

  useEffect(() => {
    if (editingIssueId && valueChangedByUser.description) {
      handleDescriptionChange(editingIssueId, debouncedDescription);
    }
  }, [debouncedDescription, editingIssueId, valueChangedByUser.description]);

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    try {
      await updateIssueAsync({
        id: issueId,
        data: { status: newStatus },
      });
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSummaryChange = async (issueId: string, value: string) => {
    try {
      await updateIssueAsync({
        id: issueId,
        data: { summary: value },
      });
      toast.success("Summary updated successfully");
    } catch {
      toast.error("Failed to update summary");
    }
  };

  const handleDescriptionChange = async (issueId: string, value: string) => {
    try {
      await updateIssueAsync({
        id: issueId,
        data: { description: value },
      });
      toast.success("Description updated successfully");
    } catch {
      toast.error("Failed to update description");
    }
  };

  const handleStoryPointChange = async (issueId: string, value: number) => {
    try {
      await updateIssueAsync({
        id: issueId,
        data: { story_point: value },
      });
      toast.success("Story points updated successfully");
    } catch {
      toast.error("Failed to update story points");
    }
  };

  const handleCreateIssue = async (data: any) => {
    try {
      await createIssueAsync({
        title: data.title,
        status: "TO DO",
        priority: data.priority || "Medium",
        type: data.type || "Task",
        project_id: projectId || "",
        summary: data.summary,
      });
      setIsCreateModalOpen(false);
      toast.success("Issue created successfully");
    } catch (error) {
      toast.error("Failed to create issue");
    }
  };

  const handleCreateSubIssue = async (parentId: string) => {
    selectIssue(parentId); // Open the parent issue in sidebar first
    setIsCreateModalOpen(true);
  };

  const handleIssueClick = (issueId: string) => {
    if (editingIssueId === issueId) {
      return; // Don't interfere with editing
    }
    selectIssue(issueId);
  };

  const issues = propIssues || [];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search list"
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200">
              Filter <FaChevronDown className="inline ml-1" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Issue
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white border border-gray-200 rounded">
        {/* Table Header */}
        <div className="grid grid-cols-11 gap-2 p-2 text-sm font-medium text-gray-600 border-b border-gray-200">
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Key</div>
          <div className="col-span-2">Summary</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Sprint</div>
          <div className="col-span-1">Assignee</div>
          <div className="col-span-1">Points</div>
          <div className="col-span-1">Created</div>
        </div>

        {/* Table Rows */}
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="grid grid-cols-11 gap-2 p-2 text-sm border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => setHoveredIssueId(issue.id)}
            onMouseLeave={() => setHoveredIssueId(null)}
            onClick={() => handleIssueClick(issue.id)}
          >
            <div className="col-span-1 flex items-center space-x-1">
              <FaFileAlt className="text-gray-500" />
              {hoveredIssueId === issue.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSubIssue(issue.id);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaPlus className="text-xs" />
                </button>
              )}
            </div>
            <div className="col-span-1">
              <span className="text-blue-600 hover:underline">{issue.id}</span>
            </div>
            <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
              {editingIssueId === issue.id ? (
                <input
                  type="text"
                  value={editValues.summary}
                  onChange={(e) => {
                    setEditValues((prev) => ({ ...prev, summary: e.target.value }));
                    setValueChangedByUser((prev) => ({ ...prev, summary: true }));
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  onBlur={() => setEditingIssueId(null)}
                />
              ) : (
                <div className="text-gray-800" onDoubleClick={() => setEditingIssueId(issue.id)}>
                  {issue.summary || issue.title}
                </div>
              )}
            </div>
            <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
              {editingIssueId === issue.id ? (
                <textarea
                  value={editValues.description}
                  onChange={(e) => {
                    setEditValues((prev) => ({ ...prev, description: e.target.value }));
                    setValueChangedByUser((prev) => ({ ...prev, description: true }));
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  onBlur={() => setEditingIssueId(null)}
                />
              ) : (
                <div className="text-gray-800" onDoubleClick={() => setEditingIssueId(issue.id)}>
                  {issue.description || "-"}
                </div>
              )}
            </div>
            <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
              <StatusDropdown
                status={issue.status}
                columns={columns || []}
                onChange={(newStatus) => handleStatusChange(issue.id, newStatus)}
              />
            </div>
            <div className="col-span-1 text-gray-600">
              {sprints?.find((s) => s.id === issue.sprint_id)?.name || "-"}
            </div>
            <div className="col-span-1 flex items-center space-x-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                {issue.assignee_id ? issue.assignee_id.substring(0, 2).toUpperCase() : "NA"}
              </span>
            </div>
            <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="number"
                value={issue.story_point || 0}
                onChange={(e) => handleStoryPointChange(issue.id, Number(e.target.value))}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                min="0"
              />
            </div>
            <div className="col-span-1 text-gray-600">{formatDate(issue.created_at)}</div>
          </div>
        ))}
      </div>

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIssue}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default List;
