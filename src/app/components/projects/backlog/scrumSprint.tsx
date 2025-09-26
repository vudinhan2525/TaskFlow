import { useState, memo, useMemo } from "react";
import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/useProject";
import Button from "@libs/app/components/general-components/button";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import { formatSprintDate } from "../../../../utils/date";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { ISprint } from "@libs/types/index";
import IssueCard from "./issueCard";
import { statusOptions } from "@libs/constants/list";
import { MenuProps, Dropdown } from "antd";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import ConfirmDeleteModal from "@libs/app/components/general-components/modal/modalDeleteConfirm";
import CreateIssueModal from "@libs/app/components/projects/modals/createIssueModal";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { useDeleteSprint } from "@libs/hooks/useSprint";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useIssueStore } from "@libs/store/useIssueStore";
interface ISprintIssues extends ISprint {
  issues: IIssue[];
}
import { toggleIssue, isIssueSelected } from "@libs/utils/issue";

interface ScrumSprintProps {
  sprint: ISprintIssues;
  projectId: string;
  isDragging: boolean;
  overItemId: string | null;
}

const ScrumSprint = memo(
  ({ sprint, projectId, isDragging, overItemId }: ScrumSprintProps) => {
    const { setNodeRef } = useSortable({
      id: sprint.id,
      data: {
        type: "Sprint",
        sprint,
      },
    });

    const { deleteSprint } = useDeleteSprint({
      projectId,
      onClose: () => {
        setIsDeleteSprintModalOpen(false);
      },
    });
    const { updateIssueAsync } = useUpdateIssue({
      projectId,
      onClose: () => {
        // setIsUpdateSprintModalOpen(false);
      },
    });
    const { selectedIssues, setSelectedIssues } = useIssueStore();

    const [isOpenButtonMenu, setIsOpenButtonMenu] = useState(false);

    const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] =
      useState(false);
    const [isDeleteSprintModalOpen, setIsDeleteSprintModalOpen] =
      useState(false);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [isSprintIssuesChecked, setIsSprintIssuesChecked] = useState(
      selectedIssues.get(sprint.id)?.size ? true : false,
    );

    const [isExpanded, setIsExpanded] = useState(true);
    const { columns } = useProjectColumns({ project_id: projectId });
    const estimate = useMemo(() => {
      return sprint.issues.reduce((total, issue) => {
        return total + (issue.story_point || 0);
      }, 0);
    }, [sprint.issues]);

 

    const buttonItems: MenuProps["items"] = [
      {
        label: "Edit Sprint",
        key: "edit-sprint",
        // onClick: () => setIsUpdateSprintModalOpen(true),
      },
      {
        label: "Delete Sprint",
        key: "delete-sprint",
        onClick: () => setIsDeleteSprintModalOpen(true),
      },
    ];

    const handleDeleteSprint = async () => {
      try {
        for (const issue of sprint.issues) {
          await updateIssueAsync({
            id: issue.id,
            data: {
              sprint_id: undefined,
            },
          });
        }
        // Delete the sprint after all issues are updated
        await deleteSprint(sprint?.id);
      } catch (error) {
        console.log(error);
      }
    };

    const handleToggleSprintIssuesChecked = () => {
      if (isSprintIssuesChecked) {
        const newSelectedIssues = new Map(selectedIssues);
        newSelectedIssues.set(sprint.id, new Set());
        setSelectedIssues(newSelectedIssues);
        setIsSprintIssuesChecked(false);
      } else {
        for (const issue of sprint.issues) {
          toggleIssue(issue.id, issue.sprint_id || "backlog", true);
        }
        const newSelectedIssues = new Map(selectedIssues);
        newSelectedIssues.set(
          sprint.id,
          new Set(sprint.issues.map((issue) => issue.id)),
        );
        setSelectedIssues(newSelectedIssues);
        setIsSprintIssuesChecked(true);
      }
    };

    return (
      <div className="flex w-full flex-col gap-2">
        <div
          ref={setNodeRef}
          className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-[#f8f8f8] px-2 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={isSprintIssuesChecked}
                  onChange={handleToggleSprintIssuesChecked}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <button
                  title="Expand/Collapse Sprint"
                  className="scale-110 text-gray-500 transition-colors hover:cursor-pointer hover:text-gray-900"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </button>
                <div className="flex flex-row items-center space-x-4">
                  <h2 className="text-md font-semibold text-gray-700">
                    {sprint?.name}
                  </h2>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-sm text-gray-600">
                      {formatSprintDate(sprint?.date_started)} -{" "}
                      {formatSprintDate(sprint?.date_ended)}
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {sprint.issues.length} issues
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Column Count */}
                <div className="flex flex-row items-center space-x-3">
                  {columns?.map((column) => (
                    <div
                      key={column.id}
                      className={`rounded-sm px-1.5 py-0.5 text-center ${statusOptions.find((option) => option.key === column.name)?.bgColor}`}
                    >
                      <div className="text-xs font-semibold text-gray-900">
                        {
                          sprint.issues.filter(
                            (issue) => issue?.column?.name === column.name,
                          ).length
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Issue Button */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    className="rounded-lg border border-gray-300 bg-white px-1 py-1 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    {new Date(sprint.date_started).getTime() <
                    new Date().getTime() ? (
                      <span
                        onClick={() => {
                          // setIsUpdateSprintModalOpen(true)
                        }}
                        className="text-sm font-semibold text-gray-900"
                      >
                        Complete Sprint
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          // setIsUpdateSprintModalOpen(true)
                        }}
                        className="text-sm font-semibold text-gray-900"
                      >
                        Start Sprint
                      </span>
                    )}
                  </Button>

                  <Dropdown
                    menu={{
                      items: buttonItems,
                    }}
                    trigger={["click"]}
                    onOpenChange={setIsOpenButtonMenu}
                    open={isOpenButtonMenu}
                  >
                    <div
                      className={`rounded-sm border-2 p-1 text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 hover:text-gray-900 ${
                        isOpenButtonMenu
                          ? "border-emerald-500"
                          : "border-transparent"
                      } `}
                    >
                      <BsThreeDots size={16} />
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          {isExpanded && (
            <div className="flex flex-col gap-2 divide-y divide-gray-100 bg-[#f8f8f8] p-2">
              <div>
                <SortableContext
                  strategy={horizontalListSortingStrategy}
                  items={sprint.issues.map((issue) => issue.id)}
                >
                  {sprint.issues.length > 0 ? (
                    sprint.issues.map((issue) => (
                      <div key={issue.id} className="group relative my-1">
                        <IssueCard issue={issue} projectId={projectId} />
                        {/* // Line DragOverlay */}
                        <div
                          style={{
                            opacity:
                              isDragging && issue.id === overItemId ? 1 : 0,
                          }}
                          className="absolute bottom-[-6px] left-0 z-50 flex w-full flex-row items-center"
                        >
                          <div className="z-50 rounded-[100%] border-1 border-emerald-500 p-1" />
                          <div className="h-[2px] w-full bg-emerald-500" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`border-3 py-3 text-center text-sm text-gray-800 ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-dashed border-gray-400"} `}
                    >
                      No issues in this sprint
                    </div>
                  )}
                </SortableContext>
              </div>

              <div
                onClick={() => {
                  setIsCreateIssueModalOpen(true);
                }}
                className="flex items-center space-x-2 rounded-sm bg-transparent p-2 text-gray-700 hover:cursor-pointer hover:bg-gray-200"
              >
                <FaPlus size={16} />
                <span className="text-sm font-semibold">Create Issue</span>
              </div>
            </div>
          )}

          <ConfirmDeleteModal
            title={`Delete Sprint ${sprint?.name}`}
            description={`Are you sure you want to delete "${sprint?.name}"?`}
            open={isDeleteSprintModalOpen}
            onClose={() => setIsDeleteSprintModalOpen(false)}
            onConfirm={handleDeleteSprint}
          />

          <CreateSprintModal
            isOpen={isCreateSprintModalOpen}
            onClose={() => setIsCreateSprintModalOpen(false)}
            projectId={projectId}
            isEditing={true}
            initialSprint={{
              id: sprint?.id,
              name: sprint?.name,
              date_started: sprint?.date_started,
              date_ended: sprint?.date_ended,
            }}
          />
          <CreateIssueModal
            isOpen={isCreateIssueModalOpen}
            onClose={() => setIsCreateIssueModalOpen(false)}
            projectId={projectId}
          />
        </div>

        <div className="flex h-full flex-row items-center">
          <div className="flex flex-1 flex-row items-center justify-end gap-1">
            <div className="flex h-full gap-2">
              <span className="text-sm font-medium text-gray-600">
                {sprint.issues.length} work items
              </span>
              <span className="text-sm font-semibold text-gray-600">|</span>
              <span className="text-sm font-medium text-gray-600">
                Estimate:{" "}
                <span className="text-sm font-bold text-gray-800">
                  {estimate}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ScrumSprint;
