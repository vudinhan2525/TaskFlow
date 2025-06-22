import { useState, memo } from "react";
import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/useProject";
import Button from "@libs/app/components/general-components/button";
import UnifiedIssueModal from "@libs/app/components/projects/modals/unifiedIssueModal";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import { formatSprintDate } from "../../../../utils/date";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { ISprint } from "@libs/types/index";
import IssueCard from "./IssueCard";
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
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { IoIosResize } from "react-icons/io";
interface ISprintIssues extends ISprint {
  issues: IIssue[];
}

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
        setIsUpdateSprintModalOpen(false);
      },
    });
    const { selectedIssues, setSelectIssues } = useIssueSelection();
    const [isOpenButtonMenu, setIsOpenButtonMenu] = useState(false);
    const [isUpdateSprintModalOpen, setIsUpdateSprintModalOpen] =
      useState(false);
    const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] =
      useState(false);
    const [isDeleteSprintModalOpen, setIsDeleteSprintModalOpen] =
      useState(false);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [isSprintIssuesChecked, setIsSprintIssuesChecked] = useState(
      selectedIssues[sprint.id || ""]?.length ? true : false,
    );
    const [isExpanded, setIsExpanded] = useState(true);
    const { columns } = useProjectColumns(projectId);

    const buttonItems: MenuProps["items"] = [
      {
        label: "Complete Sprint",
        key: "complete-sprint",
      },
      {
        label: "Edit Sprint",
        key: "edit-sprint",
        onClick: () => setIsCreateSprintModalOpen(true),
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
        setSelectIssues({ [sprint.id]: [] });
        setIsSprintIssuesChecked(false);
      } else {
        const issues: IIssue[] = [];
        for (const issue of sprint.issues) {
          issues.push(issue);
        }
        setSelectIssues({ [sprint.id]: issues });
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
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-2 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={isSprintIssuesChecked}
                  onChange={handleToggleSprintIssuesChecked}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <button
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
                  <h3 className="text-md font-semibold text-gray-900">
                    {sprint?.name}
                  </h3>
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
                    Complete Sprint
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
          {/* {overItemId === sprint.id && isDragging && (
          <div className="w-full border-t-1 border-emerald-500" />
        )} */}
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
                        <IssueCard
                          issue={issue}
                          projectId={projectId}
                          setIsSprintIssuesChecked={setIsSprintIssuesChecked}
                        />
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
                className="flex items-center space-x-2 rounded-sm bg-transparent p-2 hover:cursor-pointer hover:bg-gray-200"
              >
                <FaPlus size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Create Issue
                </span>
              </div>
            </div>
          )}

          <UnifiedIssueModal
            isOpen={isUpdateSprintModalOpen}
            onClose={() => setIsUpdateSprintModalOpen(false)}
            projectId={projectId}
            sprintId={sprint?.id}
          />

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

        <div className="flex flex-row items-center">
          <div className="group flex flex-1 flex-row items-center justify-center gap-2">
            <div className="flex-1 border-b-2 border-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="group cursor-row-resize text-gray-500 transition-colors hover:text-gray-900">
              <IoIosResize />
            </div>

            <div className="flex flex-1 flex-row items-center gap-1">
              <div className="flex-1 border-b-2 border-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex gap-2">
                <span>{sprint.issues.length} work items</span>
                <div className="h-full w-[1px] border-r border-gray-300" />
                <span>Estimate: 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ScrumSprint;
