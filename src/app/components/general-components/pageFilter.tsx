import { memo, lazy, useTransition, useEffect } from "react";
import Button from "@libs/app/components/general-components/button";
import Popover from "antd/lib/popover";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { GetIssuesParams, IssuePriority, IssueType } from "@libs/types/issue";
import { ListProjectColumnsParams } from "@libs/types/project";
import { get } from "lodash";

const DropdownFilter = lazy(() => import("./dropdownFilter"));

interface PageFilterProps {
  initialFilters?: GetIssuesParams | ListProjectColumnsParams;
  onFiltersChange?: (
    filters: GetIssuesParams | ListProjectColumnsParams,
  ) => void;
}
const PageFilter = memo(({ onFiltersChange }: PageFilterProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const [params] = useSearchParams();
  const getSearchParams = () => new URLSearchParams(window.location.search);
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useState<
    GetIssuesParams | ListProjectColumnsParams
  >({
    keyword: params.get("keyword") || "",
    due_date_from: params.get("due_date_from") || undefined,
    due_date_to: params.get("due_date_to") || undefined,
    column_ids: params.get("column_ids")?.split(",").filter(Boolean) || [],
    created_at_from: params.get("created_at_from") || undefined,
    created_at_to: params.get("created_at_to") || undefined,
    assignee_ids: params.get("assignee_ids")?.split(",").filter(Boolean) || [],
    types:
      (params.get("types")?.split(",").filter(Boolean) as IssueType[]) || [],
    priorities:
      (params
        .get("priorities")
        ?.split(",")
        .filter(Boolean) as IssuePriority[]) || [],
    page: params.get("page") ? parseInt(params.get("page")!) : 1,
    limit: params.get("limit") ? parseInt(params.get("limit")!) : 100,
    project_id: projectId,
    is_fetch: true,
  });

  useEffect(() => {
    onFiltersChange?.({
      due_date_to: "unassigned",
      ...filters,
    });
  }, []);
  const updateURL = (
    newFilters: GetIssuesParams | ListProjectColumnsParams,
  ) => {
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
      priorities: [],
      types: [],
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
    if ((get(filters, "column_ids.length", 0) as number) > 0) count++;
    if (filters.created_at_from && filters.created_at_to) count++;
    if (filters.assignee_ids && filters.assignee_ids.length > 0) count++;
    if (filters.priorities && filters.priorities.length > 0) count++;
    if (filters.types && filters.types.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
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
          content={
            <DropdownFilter
              handleClearFilters={handleClearFilters}
              handleSaveFilters={handleSaveFilters}
              setIsPopoverOpen={setIsPopoverOpen}
              filters={filters}
              setFilters={setFilters}
            />
          }
          placement="bottomLeft"
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={() => {
            startTransition(() => {
              setIsPopoverOpen(!isPopoverOpen);
            });
          }}
        >
          <div>
            <Button className="relative">
              <span className="text-base font-semibold">Filter</span>
              <ChevronDown className="ml-1" />
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
});

export default PageFilter;
