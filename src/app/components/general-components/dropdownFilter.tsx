import Button from "@libs/app/components/general-components/button";
import { DatePicker, Checkbox } from "antd";

import dayjs from "dayjs";

import StatusBadge from "@libs/app/components/general-components/badge/statusBadge";
import TypeBadge, {
  typeOptions,
} from "@libs/app/components/general-components/badge/typeBadge";
import PriorityBadge, {
  priorityOptions,
} from "@libs/app/components/general-components/badge/priorityBadge";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
const { RangePicker } = DatePicker;
import { useParams } from "react-router-dom";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";

import { useProjectColumns } from "@libs/hooks/apis/useProject";

const DropdownFilter = ({
  handleClearFilters,
  handleSaveFilters,
  setIsPopoverOpen,
  filters,
  setFilters,
}: {
  handleClearFilters: () => void;
  handleSaveFilters: () => void;
  setIsPopoverOpen: (isOpen: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projectMembers } = useProjectMembers({
    project_id: projectId as string,
  });
  const { columns } = useProjectColumns({ project_id: projectId as string });
  return (
    <div className="w-[500px] rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between border-b-[1px] border-gray-200 px-4 py-2">
        <span className="text-[15px] font-bold text-gray-600">FILTERS</span>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      <div className="flex max-h-[400px] flex-col gap-4 overflow-y-auto px-4 py-4">
        {/* Due Date */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Due date</p>
          <RangePicker
            className="w-full"
            value={
              filters.due_date_from && filters.due_date_to
                ? [dayjs(filters.due_date_from), dayjs(filters.due_date_to)]
                : null
            }
            onChange={(dates) => {
              setFilters({
                ...filters,
                due_date_from: dates?.[0]?.format("YYYY-MM-DD"),
                due_date_to: dates?.[1]?.format("YYYY-MM-DD"),
              });
            }}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Status</p>
          <div className="flex flex-wrap gap-2">
            {columns.map((column) => (
              <div
                onClick={() => {
                  const currentIds = filters.column_ids;
                  if (currentIds?.includes(column.id)) {
                    setFilters({
                      ...filters,
                      column_ids: currentIds.filter(
                        (id: string) => id !== column.id,
                      ),
                    });
                  } else {
                    setFilters({
                      ...filters,
                      column_ids: [...(currentIds || []), column.id],
                    });
                  }
                }}
                key={column.id}
                className={`flex items-center rounded-2xl border-[2px] ${filters?.column_ids?.includes(column.id) ? "border-blue-500" : "border-transparent"}`}
              >
                <StatusBadge column={column} size="medium" />
              </div>
            ))}
          </div>
        </div>
        {/* Priority */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Priority</p>
          <div className="flex flex-row items-center gap-4">
            {priorityOptions.map((priority) => (
              <div
                onClick={() => {
                  const currentIds = filters.priorities || [];
                  const newIds = currentIds.includes(priority.name)
                    ? currentIds.filter((id: string) => id !== priority.name)
                    : [...currentIds, priority.name];
                  setFilters({ ...filters, priorities: newIds });
                }}
                key={priority.name}
                className={`flex items-center rounded-2xl border-[2px] ${filters?.priorities?.includes(priority.name) ? "border-blue-500" : "border-transparent"}`}
              >
                <PriorityBadge priority={priority.name} isShowLabel={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Created at */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Created at</p>
          <RangePicker
            className="w-full"
            value={
              filters.created_at_from && filters.created_at_to
                ? [dayjs(filters.created_at_from), dayjs(filters.created_at_to)]
                : null
            }
            onChange={(dates) => {
              setFilters({
                ...filters,
                created_at_from: dates?.[0]?.format("YYYY-MM-DD"),
                created_at_to: dates?.[1]?.format("YYYY-MM-DD"),
              });
            }}
          />
        </div>

        {/* Work Type */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Work type</p>
          <div className="flex flex-row flex-wrap gap-3">
            {typeOptions.map((workType) => (
              <div key={workType.id} className="flex items-center gap-1">
                <Checkbox
                  checked={filters.types?.includes(workType.id)}
                  onChange={(e) => {
                    const currentIds = filters.types || [];
                    const newIds = e.target.checked
                      ? [...currentIds, workType.id]
                      : currentIds.filter((id: string) => id !== workType.id);
                    setFilters({ ...filters, types: newIds });
                  }}
                ></Checkbox>
                <TypeBadge type={workType.id} />
              </div>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Assignee</p>
          <div className="flex flex-row gap-2">
            {projectMembers?.map((assignee) => (
              <div
                key={assignee.id}
                onClick={() => {
                  const currentIds = filters.assignee_ids || [];
                  const newIds = currentIds.includes(assignee.id)
                    ? currentIds.filter((id: string) => id !== assignee.id)
                    : [...currentIds, assignee.id];
                  setFilters({ ...filters, assignee_ids: newIds });
                }}
                className={`flex items-center rounded-full border-[2px] ${filters?.assignee_ids?.includes(assignee.id) ? "border-blue-500" : "border-transparent"}`}
              >
                <UserAvatar
                  size={40}
                  isDisplayName={false}
                  userId={assignee.user_id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
        <Button
          onClick={() => setIsPopoverOpen(false)}
          variant="outline"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveFilters}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DropdownFilter;
