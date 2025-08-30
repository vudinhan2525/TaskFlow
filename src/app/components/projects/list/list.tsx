import React, { useState } from "react";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import { GetIssuesParams, IIssue } from "@libs/types/issue";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";
import PageFilter from "@libs/app/components/general-components/pageFilter";

const List = ({ projectId }: { projectId?: string }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [filters, setFilter] = useState<GetIssuesParams>({
    project_id: projectId,
    limit: 8,
    page: 0,
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

  const { updateIssueAsync } = useUpdateIssue({
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
    <div className="flex flex-col gap-4 bg-gray-100 p-4">
      <h1 className="p-2 text-2xl font-bold text-gray-700">List Issues</h1>

      {/* Search and Filters */}
      <PageFilter
        onFiltersChange={(filter) => {
        setFilter(filter);
        }}
      />

      <ListTable
        issues={issues || []}
        isFetching={isFetching}
        rowSelection={rowSelection}
        handleChangeCellValue={handleChangeCellValue}
        keyword={filters?.keyword || ""}
        pagination={pagination}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default List;
