import React, { useState, useEffect } from "react";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { GetIssuesParams, IIssue } from "@libs/types/issue";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { useSearchParams } from "react-router-dom";

const List = ({ projectId }: { projectId?: string }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams] = useSearchParams();

  const [filters, setFilter] = useState<GetIssuesParams>({
    project_id: projectId,
    limit: 8,
    page: 0,
  });

  // Listen to URL changes for pagination
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setFilter((prev) => ({
        ...prev,
        page: parseInt(page),
      }));
    }
  }, [searchParams]);

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

  return (
    <div className="flex flex-col gap-4 bg-gray-100 p-4">
      <h1 className="p-2 text-2xl font-bold text-gray-700">List Issues</h1>

      {/* Search and Filters */}
      <PageFilter
        onFiltersChange={(filter) => {
          setFilter(filter as GetIssuesParams);
        }}
      />

      <ListTable
        issues={issues || []}
        isFetching={isFetching}
        rowSelection={rowSelection}
        keyword={filters?.keyword || ""}
        pagination={pagination}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default List;
