import React, { lazy, Suspense, useMemo } from "react";
import { Table, Skeleton } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import TableColumn from "./listTable/tableColumn";
import { PaginationRes } from "@libs/apis/api";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "@libs/app/context/permission.context";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeams } from "@libs/hooks/useTeam";
import { usePermission } from "@libs/hooks/usePermission";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import { getIssuesByEpic, getIssuesEpic } from "@libs/utils/issue";

const ColumnInputFiled = lazy(() => import("./listTable/ColumnInputFiled"));
const TypeDropdown = lazy(() =>
  import("../../general-components/dropdown/typeDropdown").then((m) => m),
);
const StatusDropdown = lazy(() =>
  import("../../general-components/dropdown/statusDropdown").then((m) => m),
);
const PriorityDropdown = lazy(() =>
  import("../../general-components/dropdown/priorityDropdown").then((m) => m),
);
const SprintDropdown = lazy(() =>
  import("../../general-components/dropdown/sprintDropdown").then((m) => m),
);

const UserDropdown = lazy(
  () => import("../../general-components/dropdown/userDropdown"),
);
const CustomDatePicker = lazy(
  () => import("../../general-components/customDatePicker"),
);

const TeamDropdown = lazy(
  () => import("../../general-components/dropdown/teamDropdown"),
);
const ParentDropdown = lazy(
  () => import("../../general-components/dropdown/parentDropdown"),
);

interface ListTableProps {
  isFetching: boolean;
  issues: IIssue[];
  rowSelection: TableProps<IIssue>["rowSelection"];
  pagination?: PaginationRes;
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
  // keyword,
  projectId,
  pagination,
}: ListTableProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userTeams } = useUserTeams(projectId, user?.id || "");

  const tableColumns: TableColumnType<IIssue>[] = useMemo(
    () => [
      // Type
      TableColumn(
        "type",
        "Type",
        (_, { id, type }) => (
          <Suspense fallback={<FallBack />}>
            <div className="px-4">
              <TypeDropdown
                projectId={projectId}
                issueId={id}
                type={type as IssueType}
              />
            </div>
          </Suspense>
        ),
        120,
      ),

      // key (không lazy)
      TableColumn(
        "key",
        "Key",
        (_, { key }) => (
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-700">{key}</p>
          </div>
        ),
        100,
      ),

      // Summary
      TableColumn(
        "summary",
        "Summary",
        (_, { id }) => (
          <Suspense fallback={<FallBack />}>
            <ColumnInputFiled
              issue={issues.find((issue) => issue.id === id)}
              field="summary"
            />
          </Suspense>
        ),
        250,
      ),

      // Status
      TableColumn("column.name", "Status", (_, { id, column }) => (
        <Suspense fallback={<FallBack />}>
          <div className="px-4">
            <StatusDropdown
              projectId={projectId}
              issueId={id}
              column={column}
            />
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
      TableColumn(
        "priority",
        "Priority",
        (_, { id, priority }) => (
          <Suspense fallback={<FallBack />}>
            <div className="px-4 py-1">
              <PriorityDropdown
                projectId={projectId}
                issueId={id}
                priority={priority as IssuePriority}
              />
            </div>
          </Suspense>
        ),
        100,
      ),

      // Parent Issue
      TableColumn("parent_id", "Parent Issue", (_, { id, parent_id, key }) => (
        <Suspense fallback={<FallBack />}>
          <div className="px-4">
            <ParentDropdown
              projectId={projectId}
              issue={issues.find((issue) => issue.id === id)!}
              currentParentId={parent_id}
              currentIssueKey={key}
            />
          </div>
        </Suspense>
      )),

      // Team
      TableColumn("team_id", "Team", (_, { id, team_id }) => (
        <Suspense fallback={<FallBack />}>
          <div className="px-4">
            <TeamDropdown
              projectId={projectId}
              issueId={id}
              selectedTeamId={team_id || ""}
              columnField="team_id"
            />
          </div>
        </Suspense>
      )),

      // Story Point
      TableColumn(
        "story_point",
        "Story Point",
        (_, { id }) => (
          <Suspense fallback={<FallBack />}>
            <ColumnInputFiled
              issue={issues.find((issue) => issue.id === id)}
              field="story_point"
              inputType="number"
            />
          </Suspense>
        ),
        120,
      ),

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
    ],
    [issues, projectId],
  );
  type DataTypeWithKey = IIssue & { key: React.Key };

  const dataSource = useMemo(() => {
    const issuesByEpic = getIssuesByEpic(issues);
    const epicIssues = getIssuesEpic(issues);

    return epicIssues
      .map((issue) => {
        return {
          ...issue,
          children: issuesByEpic[issue.id]?.map((issue) => ({
            ...issue,
          })),
        };
      })
      .concat(
        issues
          .filter(
            (issue) =>
              issue.parent_id === "no-epic" ||
              (issue.parent_id === "" && issue.type !== "Epic"),
          )
          .map((issue) => ({
            ...issue,
            children: [],
          })),
      );
  }, [issues]);

  return (
    <div className="relative">
      {isFetching ||
      issues.length === 0 ||
      !user ||
      !userTeams ||
      !userTeams.length ? (
        //  TABLE SKELETON
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
        //  TABLE SKELETON
        <Table
          columns={tableColumns}
          dataSource={dataSource}
          bordered={true}
          rowSelection={{ ...rowSelection }}
          scroll={{ y: 1000, x: 1000 }}
          rowKey="id"
          pagination={{
            current: pagination?.current_page!,
            pageSize: pagination?.limit,
            total: pagination?.total_items,
            showSizeChanger: false,
          }}
          onChange={(pagination) => {
            const url = new URL(window.location.href);
            url.searchParams.set("page", pagination.current?.toString() || "1");
            navigate(url.pathname + url.search);
          }}
          components={{
            body: {
              row: (props: any) => {
                const issue = issues.find(
                  (i) => i.id === props["data-row-key"],
                );
                const permissionResult = usePermission({
                  user: user,
                  action: PERMISSIONS_CONFIG.issue.update,
                  resource: {
                    issue: {
                      issue: issue!,
                      teams: userTeams!,
                    },
                  },
                });
                const { children, ...rest } = props;
                return (
                  <PermissionContext.Provider value={permissionResult}>
                    <tr
                      {...rest}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={`hover:bg-gray-100 ${permissionResult.isAllow ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      {children}
                    </tr>
                  </PermissionContext.Provider>
                );
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ListTable;
