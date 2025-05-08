import React, { useState } from "react";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import ListFilter from "./listFilter";
import { IIssue } from "@libs/types/issue";
import { useSearchParams } from "react-router-dom";
import ListTable from "./listTable";
import { TableRowSelection } from "antd/es/table/interface";
import CreateIssueModal from "@libs/app/components/projects/modals/createIssueModal";

const List = ({
  projectId,
  issues,
}: {
  projectId?: string;
  issues?: IIssue[];
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
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
    <div className="min-h-[100vh] flex-col gap-4 bg-gray-100 p-4">
      {/* Search and Filters */}
      <ListFilter setIsCreateModalOpen={setIsCreateModalOpen} />

      <ListTable
        issues={issues || []}
        isLoading={isLoading}
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
