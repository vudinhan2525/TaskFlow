import Button from "@libs/app/components/general-components/button";
import { Popover, DatePicker } from "antd";
import Search from "antd/es/input/Search";
import { Dispatch, SetStateAction, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "react-router-dom";
import { useProjectColumns } from "@libs/hooks/useProject";
import { GetIssuesParams } from "@libs/types/issue";
import StatusBadge from "@libs/app/components/general-components/badge/statusBadge";

const { RangePicker } = DatePicker;

interface ListFilterProps {
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  onFiltersChange?: (filters: GetIssuesParams) => void;
}

// const mockWorkTypes = [
//   { id: "1", name: "Bug", icon: "🐛" },
//   { id: "2", name: "Task", icon: "✓" },
//   { id: "3", name: "Story", icon: "📖" },
//   { id: "4", name: "Epic", icon: "⚡" },
// ];

// const mockAssignees = [
//   {
//     id: "1",
//     name: "John Doe",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
//   },
//   {
//     id: "3",
//     name: "Mike Johnson",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
//   },
// ];

export default function ListFilter({
  setIsCreateModalOpen,
  onFiltersChange,
}: ListFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const [params] = useSearchParams();
  const getSearchParams = () => new URLSearchParams(window.location.search);

  const { columns } = useProjectColumns(projectId);
  const [filters, setFilters] = useState<GetIssuesParams>({
    keyword: params.get("keyword") || "",
    due_date_from: params.get("due_date_from") || undefined,
    due_date_to: params.get("due_date_to") || undefined,
    column_ids: params.get("column_ids")?.split(",").filter(Boolean) || [],
    created_at_from: params.get("created_at_from") || undefined,
    created_at_to: params.get("created_at_to") || undefined,
    assignee_ids: params.get("assignee_ids")?.split(",").filter(Boolean) || [],
    page: params.get("page") ? parseInt(params.get("page")!) : 1,
    limit: params.get("limit") ? parseInt(params.get("limit")!) : 12,
    project_id: projectId,
  });
  const updateURL = (newFilters: GetIssuesParams) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    const currentParams = getSearchParams();
    const preserveParams = ["projectId", "page", "limit"];
    preserveParams.forEach((param) => {
      const value = currentParams.get(param);
      if (value && !params.has(param)) {
        params.set(param, value);
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };
  const handleSaveFilters = () => {
    updateURL(filters);
    setIsPopoverOpen(false);
    onFiltersChange?.(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters: GetIssuesParams = {
      keyword: "",
      due_date_from: undefined,
      due_date_to: undefined,
      column_ids: [],
      created_at_from: undefined,
      created_at_to: undefined,
      assignee_ids: [],
      project_id: projectId,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const handleKeywordSearch = (value: string) => {
    const newFilters = { ...filters, keyword: value };
    updateURL(newFilters);
    onFiltersChange?.(newFilters);
  };
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.due_date_from && filters.due_date_to) count++;
    if (filters.column_ids && filters.column_ids.length > 0) count++;
    if (filters.created_at_from && filters.created_at_to) count++;
    if (filters.assignee_ids && filters.assignee_ids.length > 0) count++;
    return count;
  };

  const dropdownFilter = () => (
    <div className="w-[500px] rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between border-b-[1px] border-gray-200 px-4 py-3">
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
        <div>
          <p className="mb-2 font-semibold text-gray-700">Due date</p>
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
        <div>
          <p className="mb-2 font-semibold text-gray-700">Status</p>
          <div className="flex flex-wrap gap-2">
            {columns.map((column, i) => (
              <div
                onClick={() => {
                  const currentIds = filters.column_ids;
                  if (currentIds?.includes(column.id)) {
                    setFilters({
                      ...filters,
                      column_ids: currentIds.filter((id) => id !== column.id),
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
                <StatusBadge column={column} index={i} size="medium" />
              </div>
            ))}
          </div>
        </div>

        {/* Created at */}
        <div>
          <p className="mb-2 font-semibold text-gray-700">Created at</p>
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
        {/* <div>
          <p className="mb-2 font-semibold text-gray-700">Work type</p>
          <div className="space-y-2">
            {mockWorkTypes.map((workType) => (
              <div key={workType.id} className="flex items-center">
                <Checkbox
                  checked={filters.work_type_ids?.includes(workType.id)}
                  onChange={(e) => {
                    const currentIds = filters.work_type_ids || [];
                    const newIds = e.target.checked
                      ? [...currentIds, workType.id]
                      : currentIds.filter((id) => id !== workType.id);
                    setFilters({ ...filters, work_type_ids: newIds });
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>{workType.icon}</span>
                    {workType.name}
                  </span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div> */}

        {/* Assignee */}
        {/* <div>
          <p className="mb-2 font-semibold text-gray-700">Assignee</p>
          <div className="space-y-2">
            {mockAssignees.map((assignee) => (
              <div key={assignee.id} className="flex items-center">
                <Checkbox
                  checked={filters.assignee_ids?.includes(assignee.id)}
                  onChange={(e) => {
                    const currentIds = filters.assignee_ids || [];
                    const newIds = e.target.checked
                      ? [...currentIds, assignee.id]
                      : currentIds.filter((id) => id !== assignee.id);
                    setFilters({ ...filters, assignee_ids: newIds });
                  }}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="h-6 w-6 rounded-full"
                    />
                    {assignee.name}
                  </span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div> */}
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

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Issues</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Issue
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Search
          size="large"
          className="max-w-md flex-1"
          placeholder="Search issues..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          onSearch={handleKeywordSearch}
          allowClear
        />

        <Popover
          content={dropdownFilter()}
          placement="bottomLeft"
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
        >
          <div>
            <Button className="relative">
              <span className="text-base font-semibold">Filter</span>
              <FaChevronDown className="ml-1" />
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  );
}
