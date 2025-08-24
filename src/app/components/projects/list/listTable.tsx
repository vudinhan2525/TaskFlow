import { useRef } from "react";
import { Table } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTable/ColumnInputFiled";
import TableColumn from "./listTable/TableColumn";
import { PaginationRes } from "@libs/apis/api";
import { useNavigate } from "react-router-dom";

import {
  TypeDropdown,
  StatusDropdown,
  PriorityDropdown,
  SprintDropdown,
} from "../../general-components/dropdown/index";
import UserDropdown from "../../general-components/dropdown/userDropdown";
import CustomDatePicker from "../../general-components/customDatePicker";
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

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableColumns: TableColumnType<IIssue>[] = [
    // Type
    TableColumn("type", "Type", (_, { id, type }) => (
      <div className="px-4">
        <TypeDropdown
          projectId={projectId}
          issueId={id}
          type={type as IssueType}
        />
      </div>
    )),
    // Title
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
    TableColumn(
      "summary",
      "Summary",
      (_, { id }) => (
        <ColumnInputFiled
          issue={issues.find((issue) => issue.id === id)}
          field="summary"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      250,
    ),
    // Status
    TableColumn("column.name", "Status", (_, { id, column }) => (
      <div className="px-4">
        <StatusDropdown
          projectId={projectId}
          issueId={id}
          column={columns.find((col) => col.id === column.id) || columns[0]}
        />
      </div>
    )),

    // Sprint
    TableColumn("sprint_id", "Sprint", (_, { id, sprint_id }) => (
      <div className="px-4">
        <SprintDropdown
          projectId={projectId}
          issueId={id}
          currentSprint={
            sprints.find((sprint) => sprint.id === sprint_id) || sprints[0]
          }
        />
      </div>
    )),
    // Assignee
    TableColumn("assignee_id", "Assignee", (_, { id, assignee_id }) => (
      <div className="px-4">
        <UserDropdown
          projectId={projectId}
          issueId={id}
          selectedUserId={assignee_id || ""}
          columnField="assignee_id"
        />
      </div>
    )),
    // Reporter
    TableColumn("reporter_id", "Reporter", (_, { id, reporter_id }) => (
      <div className="px-4">
        <UserDropdown
          projectId={projectId}
          issueId={id}
          selectedUserId={reporter_id || ""}
          columnField="reporter_id"
        />
      </div>
    )),
    // Priority
    TableColumn(
      "priority",
      "Priority",
      (_, { id, priority }) => (
        <div className="px-4 py-1">
          <PriorityDropdown
            projectId={projectId}
            issueId={id}
            priority={priority as IssuePriority}
          />
        </div>
      ),
      100,
    ),
    // Team
    // TableColumn("team_id", "Team", (_, { team_id }) => (
    //   <span className="inline-flex items-center gap-1">
    //     <RiTeamFill className="text-gray-500" />
    //     {team_id || "-"}
    //   </span>
    // )),
    // Parent Issue
    TableColumn("parent_id", "Parent Issue", (_, { parent_id }) => (
      <span className="px-4 text-sm text-gray-500">
        {parent_id ? parent_id.substring(0, 8) : ""}
      </span>
    )),
    // Labels
    // TableColumn("labels", "Labels", (_, { label }) => (
    //   <div className="flex flex-wrap gap-1">
    //     {labels?.map((label) => (
    //       <span
    //         key={label}
    //         className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
    //       >
    //         {label}
    //       </span>
    //     )) || "-"}
    //   </div>
    // )),

    // Points
    TableColumn(
      "story_point",
      "Story Point",
      (_, { id }) => (
        <ColumnInputFiled
          issue={issues.find((issue) => issue.id === id)}
          field="story_point"
          inputType="number"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      120,
    ),

    // Due Date From
    TableColumn("due_date_from", "Due Date From", (_, { id }) => (
      <CustomDatePicker
        field="due_date_from"
        projectId={projectId}
        className="px-2"
        issue={issues.find((issue) => issue.id === id)!}
      />
    )),

    // Due Date To
    TableColumn("due_date_to", "Due Date To", (_, { id }) => (
      <CustomDatePicker
        field="due_date_to"
        projectId={projectId}
        className="px-2"
        issue={issues.find((issue) => issue.id === id)!}
      />
    )),

    // Created
    TableColumn("created_at", "Created At", (_, { id }) => (
      <CustomDatePicker
        field="created_at"
        projectId={projectId}
        className="px-2"
        isEditable={false}
        issue={issues.find((issue) => issue.id === id)!}
      />
    )),
  ];

  return (
    <div ref={tableContainerRef} className="relative">
      <Table
        columns={tableColumns}
        dataSource={issues}
        bordered={true}
        rowSelection={{ ...rowSelection }}
        scroll={{ y: 1000, x: 1000 }} // y = chiều cao cố định, x = tổng chiều rộng table
        rowKey="id"
        loading={isLoading || isFetching}
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
    </div>
  );
};

export default ListTable;
