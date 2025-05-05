import React, { useState, useEffect } from "react";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import ListFilter from "./listFilter";
import { IIssue, IssueStatus } from "@libs/types/issue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import UnifiedIssueModal from "../modals/unifiedIssueModal";
import { useSearchParams } from "react-router-dom";
import ListTable from "./listTable";
import { Sprint } from "@libs/types";
import { TableRowSelection } from "antd/es/table/interface";

const List = ({ projectId, issues }: { projectId?: string; issues?: IIssue[] }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams] = useSearchParams();
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

  const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
  const [visibleColumns, setVisibleColumns] = useState<{ key: keyof IIssue; visible: boolean }[]>(
    issueProperties.map((key) => ({
      key: key as keyof IIssue,
      visible: defaultVisibleColumns.includes(key as string),
    }))
  );

  const keyword = searchParams.get("keyword");
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<IIssue> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const { updateIssueAsync } = useUpdateIssue({ projectId: projectId || "" });
  const { sprints } = useProjectSprints(projectId || "");

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedSprintId("");
  };

  const [initTypeValues, setInitTypeValues] = useState(
    issues?.length
      ? issues.map((issue) => ({
          id: issue.id || "",
          title: issue.title || "",
          summary: issue.summary || "",
          description: issue.description || "",
        }))
      : []
  );

  useEffect(() => {
    setInitTypeValues(
      issues?.map((issue) => ({
        id: issue.id,
        title: issue.title,
        summary: issue.summary,
        description: issue.description,
      })) || []
    );
    const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
    setVisibleColumns(
      issueProperties.map((key) => ({
        key: key as keyof IIssue,
        visible: defaultVisibleColumns.includes(key as string),
      }))
    );
  }, [issues]);

  const handleFieldChange = async (issueId: string, field: string, value: string) => {
    setInitTypeValues((prev) => prev.map((item) => (item.id === issueId ? { ...item, [field]: value } : item)));
  };

  const handleFieldBlur = async (issueId: string, field: string, value: string) => {
    await updateIssueAsync({
      id: issueId,
      data: { [field]: value },
    });
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    await updateIssueAsync({
      id: issueId,
      data: { status: newStatus },
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex-col gap-4">
      {/* Search and Filters */}
      <ListFilter setIsCreateModalOpen={setIsCreateModalOpen} onSprintSelect={setSelectedSprintId} />

      <ListTable
        issues={issues || []}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns as (columns: { key: string; visible: boolean }[]) => void}
        rowSelection={rowSelection}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
        handleStatusChange={handleStatusChange}
        keyword={keyword || ""}
        projectId={projectId || ""}
        initTypeValues={initTypeValues as IIssue[]}
        sprints={sprints as unknown as Sprint[]}
      />
      {/* Create Issue Modal */}
      <UnifiedIssueModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        projectId={projectId || ""}
        sprintId={selectedSprintId}
      />
    </div>
  );
};

export default List;

// const renderDateCell = (date: string) => {
//   return (
//     <div className="px-2">
//       <span className="bg-gray-300 text-gray-700 rounded-md py-1 px-2 font-medium text-center">
//         {format(new Date(date), "MM/dd/yyyy")}
//       </span>
//     </div>
//   );
// };

// const renderStatusCell = (status: IssueStatus) => {
//   return (
//     <button
//       className={`text-xs rounded-md  p-1 hover:cursor-pointer ${
//         statusOptions.find((option) => option.name === status)?.color
//       } group-hover:bg-none`}
//     >
//       <p
//         className={`text-xs
// ${
//   statusOptions.find((option) => option.name === status)?.textColor
// } text-center font-bold
// `}
//       >
//         {status ? status.toUpperCase() : "-"}
//       </p>
//     </button>
//   );
// };

// const renderTypeCell = (type: IssueType) => {
//   return (
//     <div className="bg-gray-300 text-gray-700 rounded-md p-1 font-medium text-center">
//       {type}
//     </div>
//   );
// };
