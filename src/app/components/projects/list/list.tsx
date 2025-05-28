import React, { useState } from "react";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import ListFilter from "./listFilter";
import { IIssue } from "@libs/types/issue";
import { useSearchParams } from "react-router-dom";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";
import UnifiedIssueModal from "@libs/app/components/projects/modals/unifiedIssueModal";
import {
  FiltersSearchParams,
  parseFiltersSearchParams,
} from "@libs/utils/parseFiltersSearchParams";

const List = ({ projectId }: { projectId?: string }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams] = useSearchParams();
  const filtersSearchParams = searchParams.get("filters");
  const keyword = searchParams.get("keyword");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const keywordSearchParams = searchParams.get("keyword");

  const filters: FiltersSearchParams = parseFiltersSearchParams(
    filtersSearchParams || "",
  );
  const {
    issues,
    pagination,
    isLoading: isFetching,
  } = useProjectIssues({
    project_id: projectId,
    keyword: keywordSearchParams || undefined,
    sprint_ids: filters.sprint_ids,
    assignee_ids: filters.assignee_ids,
    column_ids: filters.column_ids,
    page: page || 1,
    limit: limit || 12,
  });
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
      <ListFilter setIsCreateModalOpen={setIsCreateModalOpen} />

      <ListTable
        issues={issues || []}
        isLoading={isLoading}
        rowSelection={rowSelection}
        isFetching={isFetching}
        handleChangeCellValue={handleChangeCellValue}
        keyword={keyword || ""}
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
