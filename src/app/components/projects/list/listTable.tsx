import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Table } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import { format } from "date-fns";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTable/ColumnInputFiled";
import { ColumnDropdown } from "../../general-components/dropdown/index";

import { columnsIcon } from "../../../../constants/list";
import TableColumn from "./listTable/TableColumn";
import { PaginationRes } from "@libs/apis/api";
import { useNavigate } from "react-router-dom";
import RenderTextCell from "./common/RenderTextCell";
import {
  TypeDropdown,
  StatusDropdown,
  PriorityDropdown,
  SprintDropdown,
} from "../../general-components/dropdown/index";
import UserDropdown from "../../general-components/dropdown/userDropdown";

interface ListTableProps {
  isLoading: boolean;
  isFetching: boolean;
  issues: IIssue[];
  rowSelection: TableProps<IIssue>["rowSelection"];
  pagination?: PaginationRes;
  handleChangeCellValue: (
    id: string,
    field: keyof IIssue,
    value: string,
  ) => void;
  keyword: string;
  projectId: string;
}

const ListTable = ({
  isLoading,
  isFetching,
  issues,
  rowSelection,
  handleChangeCellValue,
  keyword,
  projectId,
  pagination,
}: ListTableProps) => {
  const { columns } = useProjectColumns(projectId || "");
  const { sprints } = useProjectSprints(projectId || "");
  const navigate = useNavigate();
  const [visibleColumns, setVisibleColumns] = useState<
    { key: keyof IIssue; visible: boolean }[]
  >([]);
  const [sorterColumns, setSorterColumns] = useState<
    {
      key: keyof IIssue;
      sortOrder: "ascend" | "descend" | null;
    }[]
  >([]);

  const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleSort = (
    key: keyof IIssue,
    sortOrder: "ascend" | "descend" | null,
  ) => {
    setSorterColumns((prev) => {
      const updatedColumns = prev.map((column) =>
        column.key === key ? { ...column, sortOrder } : column,
      );
      return updatedColumns;
    });
  };
  const handleVisible = (key: keyof IIssue) => {
    setVisibleColumns((prev) => {
      const updatedColumns = prev.map((column) =>
        column.key === key ? { ...column, visible: !column.visible } : column,
      );
      return updatedColumns;
    });
  };
  const tableColumns: TableColumnType<IIssue>[] = [
    // Type
    TableColumn(
      "type",
      "Type",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, type }) => (
        <TypeDropdown
          projectId={projectId}
          issueId={id}
          type={type as IssueType}
        />
      ),
      {
        multiple: 6,
        sortOrder: sorterColumns.find((column) => column.key === "type")
          ?.sortOrder,
      },
    ),
    // Title
    TableColumn(
      "title",
      "Title",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { title }) => (
        <div className="p-2">
          {keyword ? (
            <p className="line-clamp-1">
              {title.slice(
                0,
                title.toLowerCase().indexOf(keyword.toLowerCase()),
              )}
              <span className="text-emerald-500">{keyword}</span>
              {title.slice(
                title.toLowerCase().indexOf(keyword.toLowerCase()) +
                  keyword.length,
              )}
            </p>
          ) : (
            title
          )}
        </div>
      ),
      {
        multiple: 7,
        sortOrder: sorterColumns.find((column) => column.key === "title")
          ?.sortOrder,
      },
    ),
    // Summary
    TableColumn(
      "summary",
      "Summary",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id }) => (
        <ColumnInputFiled
          issueId={id}
          field="summary"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      {
        multiple: 8,
        sortOrder: sorterColumns.find((column) => column.key === "summary")
          ?.sortOrder,
        width: 250,
      },
    ),
    // Status
    TableColumn(
      "column",
      "Status",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, column }) => (
        <StatusDropdown
          projectId={projectId}
          issueId={id}
          column={columns.find((col) => col.id === column.id) || columns[0]}
        />
      ),
      {
        multiple: 2,
        sortOrder: sorterColumns.find((column) => column.key === "column")
          ?.sortOrder,
      },
    ),
    // Priority
    TableColumn(
      "priority",
      "Priority",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, priority }) => (
        <PriorityDropdown
          projectId={projectId}
          issueId={id}
          priority={priority as IssuePriority}
        />
      ),
      {
        multiple: 1,
        sortOrder: sorterColumns.find((column) => column.key === "priority")
          ?.sortOrder,
      },
    ),
    // Sprint
    TableColumn(
      "sprint_id",
      "Sprint",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, sprint_id }) => (
        <SprintDropdown
          projectId={projectId}
          issueId={id}
          currentSprint={
            sprints.find((sprint) => sprint.id === sprint_id) || sprints[0]
          }
        />
      ),
      {
        multiple: 3,
        sortOrder: sorterColumns.find((column) => column.key === "sprint_id")
          ?.sortOrder,
      },
    ),
    // Assignee
    TableColumn(
      "assignee_id",
      "Assignee",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, assignee_id }) => (
        <div className="px-4">
          <UserDropdown
            projectId={projectId}
            issueId={id}
            selectedUserId={assignee_id || ""}
            columnField="assignee_id"
          />
        </div>
      ),
      {
        multiple: 4,
        sortOrder: sorterColumns.find((column) => column.key === "assignee_id")
          ?.sortOrder,
      },
    ),
    // Reporter
    TableColumn(
      "reporter_id",
      "Reporter",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id, reporter_id }) => (
        <UserDropdown
          projectId={projectId}
          issueId={id}
          selectedUserId={reporter_id || ""}
          columnField="reporter_id"
        />
      ),
      {
        multiple: 5,
        sortOrder: sorterColumns.find((column) => column.key === "reporter_id")
          ?.sortOrder,
      },
    ),
    // Team
    TableColumn(
      "team_id",
      "Team",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { team_id }) => (
        <span className="inline-flex items-center gap-1">
          <RiTeamFill className="text-gray-500" />
          {team_id || "-"}
        </span>
      ),
      {
        multiple: 10,
        sortOrder: sorterColumns.find((column) => column.key === "team_id")
          ?.sortOrder,
      },
    ),
    // Parent Issue
    TableColumn(
      "parent_id",
      "Parent Issue",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { parent_id }) => (
        <span className="px-4 text-sm text-gray-500">
          {parent_id ? parent_id.substring(0, 8) : ""}
        </span>
      ),
      {
        multiple: 11,
        sortOrder: sorterColumns.find((column) => column.key === "parent_id")
          ?.sortOrder,
      },
    ),
    // Labels
    TableColumn(
      "labels",
      "Labels",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { labels }) => (
        <div className="flex flex-wrap gap-1">
          {labels?.map((label) => (
            <span
              key={label}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {label}
            </span>
          )) || "-"}
        </div>
      ),
      {
        multiple: 12,
        sortOrder: sorterColumns.find((column) => column.key === "labels")
          ?.sortOrder,
      },
    ),
    // Attachments
    TableColumn(
      "attachments",
      "Attachments",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { attachments }) => (
        <div className="px-4">
          <span className="text-gray-500">
            {attachments.length > 0 ? `📎 ${attachments.length}` : ""}
          </span>
        </div>
      ),
      {
        multiple: 13,
        sortOrder: sorterColumns.find((column) => column.key === "attachments")
          ?.sortOrder,
      },
    ),
    // Points
    TableColumn(
      "story_point",
      "Story Point",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id }) => (
        <ColumnInputFiled
          issueId={id}
          field="story_point"
          inputType="number"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      {
        multiple: 14,
        sortOrder: sorterColumns.find((column) => column.key === "story_point")
          ?.sortOrder,
      },
    ),
    // Created
    TableColumn(
      "created_at",
      "Created At",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { created_at }) => (
        <RenderTextCell
          text={format(new Date(created_at), "MM/dd/yyyy")}
          className="p-1 text-sm font-medium"
        />
      ),
      {
        multiple: 15,
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
    ),
    // Updated
    TableColumn(
      "updated_at",
      "Updated At",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { updated_at }) => (
        <RenderTextCell
          text={format(new Date(updated_at), "MM/dd/yyyy")}
          className="p-1 text-sm font-medium"
        />
      ),
      {
        multiple: 16,
        sorter: (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      },
    ),
  ];

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

    setSorterColumns(
      issueProperties.map((key) => ({
        key: key as keyof IIssue,
        sortOrder: null,
      })),
    );
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

  return (
    <div ref={tableContainerRef} className="relative">
      <Table
        columns={tableColumns}
        dataSource={issues}
        bordered={true}
        size="small"
        style={{
          width: tableContainerRef.current?.offsetWidth,
        }}
        rowSelection={{ ...rowSelection }}
        rowKey="id"
        loading={isLoading || isFetching}
        scroll={{ x: "max-content", y: 300 }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pagination?.limit || 12,
          total: pagination?.total_items || 0,
          showSizeChanger: false,
        }}
        onChange={(pagination) => {
          const url = new URL(window.location.href);
          url.searchParams.set("page", pagination.current?.toString() || "1");
          navigate(url.search);
        }}
      />

      <div className="absolute top-0 right-0 z-30 bg-gray-300">
        <ColumnDropdown
          currentItem={""}
          items={[
            ...issueProperties
              .filter(
                (property) =>
                  !visibleColumns.find((column) => column.key === property)
                    ?.visible,
              )
              // TODO: RENDER Label not field name
              .map((property) => ({
                label: (
                  <div className="flex items-center gap-2">
                    {property in columnsIcon ? (
                      columnsIcon[property]
                    ) : (
                      <FaPlus />
                    )}
                    {property}
                  </div>
                ),
                key: property,
                onClick: () =>
                  setVisibleColumns(
                    visibleColumns.map((c) =>
                      c.key === property ? { ...c, visible: !c.visible } : c,
                    ),
                  ),
              })),
          ]}
          children={
            <div className="cursor-pointer rounded-sm px-2 py-1 hover:bg-gray-100">
              <FaPlus />
            </div>
          }
        ></ColumnDropdown>
      </div>
    </div>
  );
};

export default ListTable;
