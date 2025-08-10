import React, { useState } from "react";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import { GetIssuesParams, IIssue } from "@libs/types/issue";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";
import UnifiedIssueModal from "@libs/app/components/projects/modals/unifiedIssueModal";
import ListFilter from "@libs/app/components/projects/list/listFilter/listFilter";
import { useSearchParams } from "react-router-dom";

const List = ({ projectId }: { projectId?: string }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [searchParams] = useSearchParams();

  const [filters, setFilter] = useState<GetIssuesParams>({
    keyword: searchParams.get("keyword") || undefined,
    column_ids:
      searchParams.get("column_ids")?.split(",").filter(Boolean) || undefined,
    assignee_ids:
      searchParams.get("assignee_ids")?.split(",").filter(Boolean) || undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    due_date_from: searchParams.get("due_date_from") || undefined,
    due_date_to: searchParams.get("due_date_to") || undefined,
    created_at_from: searchParams.get("created_at_from") || undefined,
    created_at_to: searchParams.get("created_at_to") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 12,
    project_id: projectId,
  });

  const {
    issues,
    pagination,
    isLoading: isFetching,
  } = useProjectIssues(filters);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<IIssue> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { updateIssueAsync, isLoading } = useUpdateIssue({
    projectId: projectId || "",
  });

  const handleChangeCellValue = async (
    issueId: string,
    field: keyof IIssue,
    value: string,
  ) => {
    await updateIssueAsync({
      id: issueId,
      data: { [field]: value },
    });
  };
  return (
    <div className="flex-col gap-4 bg-gray-100 p-4">
      {/* Search and Filters */}
      <ListFilter
        setIsCreateModalOpen={setIsCreateModalOpen}
        onFiltersChange={(filter) => {
          setFilter(filter);
        }}
      />

      <ListTable
        issues={issues || []}
        isLoading={isLoading}
        rowSelection={rowSelection}
        isFetching={isFetching}
        handleChangeCellValue={handleChangeCellValue}
        keyword={filters?.keyword || ""}
        pagination={pagination}
        projectId={projectId || ""}
      />

      {/* Create Issue Modal */}
      <UnifiedIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        // onSubmit={handleCreateIssue}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default List;
