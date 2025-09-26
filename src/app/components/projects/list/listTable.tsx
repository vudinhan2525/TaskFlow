import React, { lazy, Suspense } from "react";
import { Table, Skeleton } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import TableColumn from "./listTable/tableColumn";
import { PaginationRes } from "@libs/apis/api";
import { useNavigate } from "react-router-dom";

const ColumnInputFiled = lazy(() => import("./listTable/ColumnInputFiled"));
const TypeDropdown = lazy(() => import("../../general-components/dropdown/typeDropdown").then(m => (m)));
const StatusDropdown = lazy(() => import("../../general-components/dropdown/statusDropdown").then(m => (m)));
const PriorityDropdown = lazy(() => import("../../general-components/dropdown/priorityDropdown").then(m => (m)));
const SprintDropdown = lazy(() => import("../../general-components/dropdown/sprintDropdown").then(m => (m)));

const UserDropdown = lazy(() => import("../../general-components/dropdown/userDropdown"));
const CustomDatePicker = lazy(() => import("../../general-components/customDatePicker"));

interface ListTableProps {
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

const FallBack = () => {
  return (
    <div className="flex items-center justify-center p-2">
      <Skeleton active={true} title paragraph={false} />
    </div>
  );
};

const ListTable = ({
  isFetching,
  issues,
  rowSelection,
  handleChangeCellValue,
  keyword,
  projectId,
  pagination,
}: ListTableProps) => {
  const navigate = useNavigate();
  const tableColumns: TableColumnType<IIssue>[] = [
  // Type
  TableColumn("type", "Type", (_, { id, type }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4">
        <TypeDropdown
          projectId={projectId}
          issueId={id}
          type={type as IssueType}
        />
      </div>
    </Suspense>
  ),120),

  // Title (không lazy)
  TableColumn("title", "Title", (_, { title }) => (
    <div className="p-2">
      {keyword ? (
        <p className="font-semibold text-gray-300">
          {title.slice(0, title.toLowerCase().indexOf(keyword.toLowerCase()))}
          <span className="text-emerald-500">{keyword}</span>
          {title.slice(
            title.toLowerCase().indexOf(keyword.toLowerCase()) +
              keyword.length,
          )}
        </p>
      ) : (
        <p className="font-[600] text-gray-900">{title}</p>
      )}
    </div>
  )),

  // Summary
  TableColumn("summary", "Summary", (_, { id }) => (
    <Suspense fallback={<FallBack />}>
      <ColumnInputFiled
        issue={issues.find((issue) => issue.id === id)}
        field="summary"
        handleChangeCellValue={handleChangeCellValue}
      />
    </Suspense>
  ), 250),

  // Status
  TableColumn("column.name", "Status", (_, { id, column }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4">
        <StatusDropdown projectId={projectId} issueId={id} column={column} />
      </div>
    </Suspense>
  )),

  // Sprint
  TableColumn("sprint_id", "Sprint", (_, { id, sprint_id }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4">
        <SprintDropdown
          projectId={projectId}
          issueId={id}
          sprintId={sprint_id || ""}
        />
      </div>
    </Suspense>
  )),

  // Assignee
  TableColumn("assignee_id", "Assignee", (_, { id, assignee_id }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4">
        <UserDropdown
          projectId={projectId}
          issueId={id}
          selectedUserId={assignee_id || ""}
          columnField="assignee_id"
        />
      </div>
    </Suspense>
  )),

  // Reporter
  TableColumn("reporter_id", "Reporter", (_, { id, reporter_id }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4">
        <UserDropdown
          projectId={projectId}
          issueId={id}
          selectedUserId={reporter_id || ""}
          columnField="reporter_id"
        />
      </div>
    </Suspense>
  )),

  // Priority
  TableColumn("priority", "Priority", (_, { id, priority }) => (
    <Suspense fallback={<FallBack />}>
      <div className="px-4 py-1">
        <PriorityDropdown
          projectId={projectId}
          issueId={id}
          priority={priority as IssuePriority}
        />
      </div>
    </Suspense>
  ), 100),

  // Parent Issue (không lazy)
  TableColumn("parent_id", "Parent Issue", (_, { parent_id }) => (
    <span className="px-4 text-sm text-gray-500">
      {parent_id ? parent_id.substring(0, 8) : ""}
    </span>
  )),

  TableColumn("team_id", "Team", (_, { team_id }) => (
    <span className="px-4 text-sm text-gray-500">
      {team_id ? team_id.substring(0, 8) : ""}
    </span>
  )),

  // Story Point
  TableColumn("story_point", "Story Point", (_, { id }) => (
    <Suspense fallback={<FallBack />}>
      <ColumnInputFiled
        issue={issues.find((issue) => issue.id === id)}
        field="story_point"
        inputType="number"
        handleChangeCellValue={handleChangeCellValue}
      />
    </Suspense>
  ), 120),

  // Due Date From
  TableColumn("due_date_from", "Due Date From", (_, { id }) => (
    <Suspense fallback={<FallBack />}>
      <CustomDatePicker
        field="due_date_from"
        projectId={projectId}
        className="px-2"
        issue={issues.find((issue) => issue.id === id)!}
      />
    </Suspense>
  )),

  // Due Date To
  TableColumn("due_date_to", "Due Date To", (_, { id }) => (
    <Suspense fallback={<FallBack />}>
      <CustomDatePicker
        field="due_date_to"
        projectId={projectId}
        className="px-2"
        issue={issues.find((issue) => issue.id === id)!}
      />
    </Suspense>
  )),

  // Created At
  TableColumn("created_at", "Created At", (_, { id }) => (
    <Suspense fallback={<FallBack />}>
      <CustomDatePicker
        field="created_at"
        projectId={projectId}
        className="px-2"
        isEditable={false}
        issue={issues.find((issue) => issue.id === id)!}
      />
    </Suspense>
  )),
];


  type DataTypeWithKey = IIssue & { key: React.Key };

  return (
    <div className="relative">
      {isFetching || issues.length === 0 ? (
        <Table
          rowKey="key"
          pagination={false}
          bordered={true}
          scroll={{ y: 1000, x: 1000 }}
          dataSource={
            [...Array(8)].map((_, index) => ({
              key: `key${index}`,
            })) as DataTypeWithKey[]
          }
          rowSelection={{ ...rowSelection }}
          columns={tableColumns.map((column) => ({
            ...column,
            render: function renderPlaceholder() {
              return (
                <div className="flex items-center justify-center p-2">
                  <Skeleton active={true} title paragraph={false} />
                </div>
              );
            },
          }))}
        />
      ) : (
        <Table
          columns={tableColumns}
          dataSource={issues}
          bordered={true}
          rowSelection={{ ...rowSelection }}
          scroll={{ y: 1000, x: 1000 }}
          rowKey="id"
          pagination={{
            current: pagination?.current_page! + 1,
            pageSize: pagination?.limit,
            total: pagination?.total_items,
            showSizeChanger: false,
          }}
          onChange={(pagination) => {
            console.log("Pagination:", pagination);
            const url = new URL(window.location.href);
            url.searchParams.set("page", pagination.current?.toString() || "1");
            navigate(url.search);
          }}
        />
      )}
    </div>
  );
};

export default ListTable;
