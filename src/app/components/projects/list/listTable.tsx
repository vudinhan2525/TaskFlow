import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Table } from "antd";
import type { TableProps, TableColumnType } from "antd";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssuePriority } from "@libs/types/issue";
import { format } from "date-fns";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTable/ColumnInputFiled";
import ColumnDropdown from "./listTable/ColumnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import RenderStatusCell from "./common/RenderStatusCell";
import {
  columnsIcon,
  priorityOptions,
  typeOptions,
} from "../../../../constants/list";
import { ISprint } from "@libs/types";
import TableColumn from "./listTable/TableColumn";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { PaginationRes } from "@libs/apis/api";
import { useNavigate } from "react-router-dom";
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
  const { projectMembers } = useProjectMembers(projectId || "");
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
        <ColumnDropdown
          items={typeOptions.map((option) => ({
            value: option.name,
            style: {
              padding: 0,
              background: "white",
            },
            label: (
              <div
                key={option.id}
                className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-200 ${
                  option.name === type &&
                  "border-l-2 border-emerald-500 bg-gray-300"
                }`}
              >
                <div
                  className={`flex min-w-[100px] items-center justify-center gap-1 rounded-md py-1 ${option.bgColor}`}
                >
                  {option.icon}
                  <p className={`text-[13px] font-bold ${option.textColor}`}>
                    {option.name}
                  </p>
                </div>
              </div>
            ),
            key: option.id,
            onClick: () =>
              handleChangeCellValue(id, "type" as keyof IIssue, option.name),
          }))}
          children={
            <div className="flex min-h-[50px] items-center justify-center px-[12px]">
              <div
                className={`flex h-fit min-w-[100px] items-center justify-center gap-1 rounded-md py-1 ${
                  typeOptions.find((option) => option.name === type)?.bgColor
                }`}
              >
                {typeOptions.find((option) => option.name === type)?.icon}
                <p
                  className={`text-[13px] font-bold ${
                    typeOptions.find((option) => option.name === type)
                      ?.textColor
                  }`}
                >
                  {type ? type : "-"}
                </p>
              </div>
            </div>
          }
          currentItem={type}
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
            <p>
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
      },
    ),
    // Description
    TableColumn(
      "description",
      "Description",
      visibleColumns,
      handleVisible,
      handleSort,
      (_, { id }) => (
        <ColumnInputFiled
          issueId={id}
          field="description"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      {
        multiple: 9,
        sortOrder: sorterColumns.find((column) => column.key === "description")
          ?.sortOrder,
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
        <ColumnDropdown
          items={columns.map((column) => ({
            value: column.name,
            style: {
              padding: 0,
              background: "white",
            },
            label: (
              <div
                key={column.id}
                className={`flex items-center p-2 hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
              >
                <RenderStatusCell column={column} />
              </div>
            ),
            key: column.id,
            onClick: () =>
              handleChangeCellValue(id, "column_id" as keyof IIssue, column.id),
          }))}
          children={
            <div className="flex justify-start px-2">
              <RenderStatusCell column={column} />
            </div>
          }
          currentItem={column.name}
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
        <ColumnDropdown
          items={priorityOptions.map((option) => {
            return {
              value: option.name,
              key: option.name,
              style: {
                padding: 0,
                background: "white",
              },
              label: (
                <div
                  className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
                >
                  {option.icon}
                  <p className="text-xs font-bold">{option.name}</p>
                </div>
              ),
              onClick: () => {
                handleChangeCellValue(
                  id,
                  "priority" as keyof IIssue,
                  option.name as IssuePriority,
                );
              },
            };
          })}
          currentItem={priority}
          children={
            <div className="flex items-center justify-start gap-2 rounded-md p-2 hover:cursor-pointer">
              {priorityOptions.find((option) => option.name === priority)?.icon}
              <p className="text-xs font-bold">{priority}</p>
            </div>
          }
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
        <ColumnDropdown
          items={sprints.map((sprint: ISprint) => ({
            value: sprint.name,
            key: sprint.id,
            style: {
              padding: 0,
              background: "white",
            },
            label: (
              <div
                className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
              >
                <p className="font-bold">{sprint.name}</p>
              </div>
            ),
            onClick: () => {
              handleChangeCellValue(
                id,
                "sprint_id" as keyof IIssue,
                sprint.id as string,
              );
            },
          }))}
          currentItem={
            sprints.find((sprint: ISprint) => sprint.id === sprint_id)?.name
          }
          children={
            <div className="flex justify-start px-2">
              <div className="rounded-md bg-gray-200 px-2 py-1">
                <p className="text-xs font-bold text-gray-600">
                  {
                    sprints.find((sprint: ISprint) => sprint.id === sprint_id)
                      ?.name
                  }
                </p>
              </div>
            </div>
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
          <ColumnDropdown
            items={
              projectMembers &&
              projectMembers
                .map((member: IProjectMember) => ({
                  value: member.user?.first_name + " " + member.user?.last_name,
                  key: member.user_id,

                  label: (
                    <UserAvatar userId={member.user_id} isDisplayName={true} />
                  ),
                  onClick: () => {
                    handleChangeCellValue(
                      id,
                      "assignee_id" as keyof IIssue,
                      member.user_id as string,
                    );
                  },
                }))
                .concat({
                  value: "Unasigned",
                  key: "Unasigned",

                  label: <UserAvatar userId={""} isDisplayName={true} />,
                  onClick: () => {
                    handleChangeCellValue(
                      id,
                      "assignee_id" as keyof IIssue,
                      "" as string,
                    );
                  },
                })
            }
            // currentItem={
            //   projectMembers?.find((member) => member.user.id === assignee_id)?.user
            //     .first_name +
            //   " " +
            //   projectMembers?.find((member) => member.user.id === assignee_id)?.user
            //     .last_name}

            children={
              <UserAvatar userId={assignee_id || ""} isDisplayName={true} />
            }
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
        <ColumnDropdown
          items={
            projectMembers &&
            projectMembers
              .map((member: IProjectMember) => ({
                value: member.user?.first_name + " " + member.user?.last_name,
                key: member.user_id,
                label: (
                  <UserAvatar userId={member.user_id} isDisplayName={true} />
                ),
                onClick: () => {
                  handleChangeCellValue(
                    id,
                    "reporter_id" as keyof IIssue,
                    member.user_id as string,
                  );
                },
              }))
              .concat({
                value: "Unasigned",
                key: "Unasigned",

                label: <UserAvatar isDisplayName={true} />,
                onClick: () => {
                  handleChangeCellValue(
                    id,
                    "reporter_id" as keyof IIssue,
                    "" as string,
                  );
                },
              })
          }
          // currentItem={
          //   projectMembers?.find((member) => member.user.id === reporter_id)?.user
          //     .first_name +
          //   " " +
          //   projectMembers?.find((member) => member.user.id === reporter_id)?.user
          //     .last_name}

          children={
            <UserAvatar userId={reporter_id || ""} isDisplayName={true} />
          }
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
      (_, { created_at }) => renderDateCell(created_at),
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
      (_, { updated_at }) => renderDateCell(updated_at),
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
        rowSelection={{ ...rowSelection }}
        rowKey="id"
        loading={isLoading || isFetching}
        scroll={{ x: "max-content" }}
        style={{
          width: tableContainerRef.current?.offsetWidth,
          transition: "opacity 0.2s ease-in-out",
          opacity: isLoading || isFetching ? 0.6 : 1,
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pagination?.limit || 12,
          total: pagination?.total_items || 0,
          showSizeChanger: false,
        }}
        onChange={(pagination) => {
          navigate(`?page=${pagination.current}`);
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

const renderDateCell = (date: string) => {
  return (
    <div className="flex justify-center px-2">
      <span className="rounded-md bg-gray-300 px-2 py-1 text-center text-[15px] font-medium text-gray-700">
        {format(new Date(date), "MM/dd/yyyy")}
      </span>
    </div>
  );
};
