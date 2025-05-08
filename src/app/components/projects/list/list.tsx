import React, { useState, useEffect } from "react";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import ListFilter from "./listFilter";
import { IIssue } from "@libs/types/issue";
import CreateIssueModal from "../modals/createIssueModal";
import { useSearchParams } from "react-router-dom";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";




const List = ({
  projectId,
  issues,
}: {
  projectId?: string;
  issues?: IIssue[];
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams] = useSearchParams();

  const [visibleColumns, setVisibleColumns] = useState<
    { key: keyof IIssue; visible: boolean }[]
  >([]);

  const keyword = searchParams.get("keyword");
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<IIssue> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { updateIssueAsync } = useUpdateIssue({ projectId: projectId || "" });

  useEffect(() => {
    const issueProperties = Object.keys(issues?.[0] || {}) as Array<
      keyof IIssue
    >;

    // Get saved columns from localStorage
    const savedColumns = localStorage.getItem("visibleColumns");
    if (savedColumns) {
      // If there are saved columns, use them
      const previousVisibleColumns = savedColumns.split(",");
      setVisibleColumns(
        issueProperties.map((key) => ({
          key: key as keyof IIssue,
          visible: previousVisibleColumns.includes(key as string),
        })),
      );
    } else {
      const defaultVisibleColumns = [
        "title",
        "summary",
        "description",
        "status",
        "sprint_id",
        "assignee_id",
        "story_point",
        "created_at",
        "updated_at",
      ];
      setVisibleColumns(
        issueProperties.map((key) => ({
          key: key as keyof IIssue,
          visible: defaultVisibleColumns.includes(key as string),
        })),
      );
    }
  }, [issues]);

  useEffect(() => {
    if (!visibleColumns.length) return;
    localStorage.setItem(
      "visibleColumns",
      visibleColumns
        .filter((column) => column.visible)
        .map((column) => column.key)
        .join(","),
    );
  }, [visibleColumns]);

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
    <div className="min-h-screen flex-col gap-4 bg-gray-100 p-4">
      {/* Search and Filters */}
      <ListFilter setIsCreateModalOpen={setIsCreateModalOpen} />

      <ListTable
        issues={issues || []}
        visibleColumns={visibleColumns}
        setVisibleColumns={
          setVisibleColumns as (
            columns: { key: string; visible: boolean }[],
          ) => void
        }
        rowSelection={rowSelection}
        handleChangeCellValue={handleChangeCellValue}
        keyword={keyword || ""}
        projectId={projectId || ""}
      />

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        // onSubmit={handleCreateIssue}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default List;
