import { useRef } from "react";
import { Table } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import { format } from "date-fns";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTable/ColumnInputFiled";
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

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableColumns: TableColumnType<IIssue>[] = [
    // Type
    TableColumn("type", "Type", (_, { id, type }) => (
      <TypeDropdown
        projectId={projectId}
        issueId={id}
        type={type as IssueType}
      />
    )),
    // Title
    TableColumn("title", "Title", (_, { title }) => (
      <div className="p-2">
        {keyword ? (
          <p className="line-clamp-1">
            {title.slice(0, title.toLowerCase().indexOf(keyword.toLowerCase()))}
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
    )),
    // Summary
    TableColumn("summary", "Summary", (_, { id }) => (
      <ColumnInputFiled
        issue={issues.find((issue) => issue.id === id)}
        field="summary"
        handleChangeCellValue={handleChangeCellValue}
      />
    )),
    // Status
    TableColumn("column.name", "Status", (_, { id, column }) => (
      <StatusDropdown
        projectId={projectId}
        issueId={id}
        column={columns.find((col) => col.id === column.id) || columns[0]}
      />
    )),
    // Priority
    TableColumn("priority", "Priority", (_, { id, priority }) => (
      <PriorityDropdown
        projectId={projectId}
        issueId={id}
        priority={priority as IssuePriority}
      />
    )),
    // Sprint
    TableColumn("sprint_id", "Sprint", (_, { id, sprint_id }) => (
      <SprintDropdown
        projectId={projectId}
        issueId={id}
        currentSprint={
          sprints.find((sprint) => sprint.id === sprint_id) || sprints[0]
        }
      />
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
      <UserDropdown
        projectId={projectId}
        issueId={id}
        selectedUserId={reporter_id || ""}
        columnField="reporter_id"
      />
    )),
    // Team
    TableColumn("team_id", "Team", (_, { team_id }) => (
      <span className="inline-flex items-center gap-1">
        <RiTeamFill className="text-gray-500" />
        {team_id || "-"}
      </span>
    )),
    // Parent Issue
    TableColumn("parent_id", "Parent Issue", (_, { parent_id }) => (
      <span className="px-4 text-sm text-gray-500">
        {parent_id ? parent_id.substring(0, 8) : ""}
      </span>
    )),
    // Labels
    TableColumn("labels", "Labels", (_, { labels }) => (
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
    )),
    // Points
    TableColumn("story_point", "Story Point", (_, { id }) => (
      <ColumnInputFiled
        issue={issues.find((issue) => issue.id === id)}
        field="story_point"
        inputType="number"
        handleChangeCellValue={handleChangeCellValue}
      />
    )),
    // Created
    TableColumn("created_at", "Created At", (_, { created_at }) => (
      <RenderTextCell
        text={format(new Date(created_at), "MM/dd/yyyy")}
        className="p-1 text-sm font-medium"
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
