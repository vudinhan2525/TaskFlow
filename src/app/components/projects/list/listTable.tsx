import { useEffect, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaListUl,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { CiAt } from "react-icons/ci";
import {
  MdOutlineBedroomParent,
  MdLabelImportantOutline,
  MdOutlineSubtitles,
  MdOutlineSummarize,
  MdOutlineDescription,
} from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { Table, Dropdown } from "antd";
import type { TableProps, TableColumnType, MenuProps } from "antd";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssuePriority, IssueStatus } from "@libs/types/issue";
import { format } from "date-fns";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTableColumns/ColumnInputFiled";
import ColumnDropdown from "./listTableColumns/ColumnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
<<<<<<< Updated upstream
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";

=======
import { ISprint } from "@libs/types";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
>>>>>>> Stashed changes
interface ListTableProps {
  isLoading: boolean;
  issues: IIssue[];
  rowSelection: TableProps<IIssue>["rowSelection"];
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
  issues,
  rowSelection,
  handleChangeCellValue,
  keyword,
  projectId,
}: ListTableProps) => {
  const { columns } = useProjectColumns(projectId || "");
  const { sprints } = useProjectSprints(projectId || "");

  const { projectMembers } = useProjectMembers(projectId || "");
  const [visibleColumns, setVisibleColumns] = useState<
    { key: keyof IIssue; visible: boolean }[]
  >([]);
  const statusOptions = columns.map((column) => ({
    ...column,
    bgColor:
      column.name == "TO DO"
        ? "bg-gray-100"
        : column.name == "DONE"
          ? "bg-green-100"
          : "bg-blue-100",
    textColor:
      column.name == "TO DO"
        ? "text-gray-700"
        : column.name == "DONE"
          ? "text-green-700"
          : "text-blue-700",
  }));
  const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const createColumn = (
    key: keyof IIssue,
    title: string,
    render: (value: string, record: IIssue) => React.ReactNode,
    options: {
      hidden?: boolean;
      sorter?: (a: IIssue, b: IIssue) => number;
      align?: "start" | "center" | "end";
      colSpan?: number;
    } = {},
  ): TableColumnType<IIssue> => {
    return {
      title: renderTableHeaderCell({
        title,
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === key
                ? { ...column, visible: !column.visible }
                : column,
            ),
          ),
      }),
      dataIndex: key,
      key,
      hidden: !visibleColumns.find((column) => column.key === key)?.visible,
      render,
      ...options,
    };
  };

  const tableColumns: TableColumnType<IIssue>[] = [
    // Type
    createColumn("type", "Type", (_, { id, type }) => (
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
          <div className="flex justify-center">
            <div
              className={`flex min-w-[100px] items-center justify-center gap-1 rounded-md py-1 ${
                typeOptions.find((option) => option.name === type)?.bgColor
              }`}
            >
              {typeOptions.find((option) => option.name === type)?.icon}
              <p
                className={`text-[13px] font-bold ${
                  typeOptions.find((option) => option.name === type)?.textColor
                }`}
              >
                {type ? type : "-"}
              </p>
            </div>
          </div>
        }
        currentItem={type}
      />
    )),
    // Title
    createColumn("title", "Title", (_, { title }) => (
      <p className="p-2">
        {keyword ? (
          <p>
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
      </p>
    )),
    // Summary
    createColumn(
      "summary",
      "Summary",
      (_, { id }) => (
        <ColumnInputFiled
          issueId={id}
          field="summary"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      { sorter: (a, b) => a.summary.localeCompare(b.summary) },
    ),
    // Description
    createColumn("description", "Description", (_, { id }) => (
      <ColumnInputFiled
        issueId={id}
        field="description"
        handleChangeCellValue={handleChangeCellValue}
      />
    )),
    // Status
    createColumn("column", "Status", (_, { id, column }) => (
      <ColumnDropdown
        items={statusOptions.map((option) => ({
          value: option.name,
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              key={option.id}
              className={`flex items-center p-2 hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300 ${option.name === status && "border-l-2 border-emerald-500 bg-emerald-100"}`}
            >
              <button
                className={`rounded-md p-1 text-xs hover:cursor-pointer ${option.bgColor} group-hover:bg-none`}
              >
                <p
                  className={`text-xs ${option.textColor} text-center font-bold`}
                >
                  {option.name}
                </p>
              </button>
            </div>
          ),
          key: option.id,
          onClick: () =>
            handleChangeCellValue(
              id,
              "status" as keyof IIssue,
              option.name as IssueStatus,
            ),
        }))}
        children={
          <div className="flex justify-center">
            <button
              className={`rounded-md p-1 text-xs hover:cursor-pointer ${
                statusOptions.find((option) => option.name === status)?.bgColor
              } group-hover:bg-none`}
            >
              <p
                className={`text-xs ${
                  statusOptions.find((option) => option.name === status)
                    ?.textColor
                } text-center font-bold`}
              >
                {column ? column.name.toUpperCase() : "-"}
              </p>
            </button>
          </div>
        }
        currentItem={column.name}
      />
    )),
    // Priority
    createColumn("priority", "Priority", (_, { id, priority }) => (
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
          <div className="flex items-center justify-center gap-2 rounded-md p-1 hover:cursor-pointer">
            {priorityOptions.find((option) => option.name === priority)?.icon}
            <p className="text-xs font-bold">{priority}</p>
          </div>
        }
      />
    )),
    // Sprint
    createColumn("sprint_id", "Sprint_id", (_, { id, sprint_id }) => (
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
        currentItem={sprints.find((sprint: ISprint) => sprint.id === sprint_id)?.name}
        children={
          <div className="flex justify-center">
            <div className="rounded-md bg-gray-200 p-2">
              <p className="font-bold">
                {sprints.find((sprint: ISprint) => sprint.id === sprint_id)?.name}
              </p>
            </div>
          </div>
        }
      />
    )),
    // Assignee
    createColumn("assignee_id", "Assignee_id", (_, { id, assignee_id }) => (
      <ColumnDropdown
        items={
          projectMembers &&
          projectMembers
            .map((member: IProjectMember) => ({
              value: member.user_id,
              key: member.user_id,
<<<<<<< Updated upstream
              label: <UserAvatar userId={member.user_id} />,
=======
              label: <UserAvatar userId={member.user_id} isDisplayName={true} />,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              label: <UserAvatar />,
=======
              label: <UserAvatar userId={""} isDisplayName={true} />,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        children={<UserAvatar userId={assignee_id || ""} />}
=======
        children={<UserAvatar userId={assignee_id || ""} isDisplayName={true} />}
>>>>>>> Stashed changes
      />
    )),
    // Reporter
    createColumn("reporter_id", "Reporter_id", (_, { id, reporter_id }) => (
      <ColumnDropdown
        items={
          projectMembers &&
          projectMembers
            .map((member: IProjectMember) => ({
              value: member.user_id,
              key: member.user_id,
<<<<<<< Updated upstream
              label: <UserAvatar userId={member.user_id} />,
=======
              label: <UserAvatar userId={member.user_id} isDisplayName={true} />,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              label: <UserAvatar />,
=======
              label: <UserAvatar userId={""} isDisplayName={true} />,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        children={<UserAvatar userId={reporter_id || ""} />}
=======
        children={<UserAvatar userId={reporter_id || ""} isDisplayName={true} />}
>>>>>>> Stashed changes
      />
    )),
    // Team
    createColumn("team_id", "Team", (_, { team_id }) => (
      <span className="inline-flex items-center gap-1">
        <RiTeamFill className="text-gray-500" />
        {team_id || "-"}
      </span>
    )),
    // Parent Issue
    createColumn("parent_id", "Parent Issue", (_, { parent_id }) => (
      <span className="text-sm text-gray-500">
        {parent_id ? parent_id.substring(0, 8) : "-"}
      </span>
    )),
    // Labels
    createColumn("labels", "Labels", (_, { labels }) => (
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
    // Attachments
    createColumn("attachments", "Attachments", (_, { attachments }) => (
      <span className="text-gray-500">
        {attachments.length > 0 ? `📎 ${attachments.length}` : "-"}
      </span>
    )),
    // Points
    createColumn(
      "story_point",
      "Story Point",
      (_, { id }) => (
        <ColumnInputFiled
          issueId={id}
          field="story_point"
          inputType="number"
          handleChangeCellValue={handleChangeCellValue}
        />
      ),
      { align: "end", colSpan: 1 },
    ),
    // Created
    createColumn(
      "created_at",
      "Created At",
      (_, { created_at }) => renderDateCell(created_at),
      {
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
    ),
    // Updated
    createColumn(
      "updated_at",
      "Updated At",
      (_, { updated_at }) => renderDateCell(updated_at),
      {
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
        loading={isLoading}
        scroll={{ x: "max-content" }}
        style={{ padding: 0, width: tableContainerRef.current?.offsetWidth }}
      />

      <div className="absolute top-0 right-0 z-50 bg-gray-100">
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
            <div className="cursor-pointer rounded-sm px-4 py-3 hover:bg-gray-100">
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

<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
const renderTableHeaderCell = ({
  title,
  handleClick,
}: {
  title: string;
  handleClick?: () => void;
}) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center gap-2">
          <FaArrowUp />
          <p>Sort {"A -> Z"}</p>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <FaArrowDown />
          <p>Sort {"Z -> A"}</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <LuX className="h-4 w-4 font-bold" />
          <p>Hide field</p>
        </div>
      ),
      key: "2",
      onClick: handleClick,
    },
  ];
  return (
    <div className="group item flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="hidden rounded-md p-1 group-hover:block">
          <FaListUl />
        </div>
        <div className="rounded-md p-1 group-hover:hidden">
          {title in columnsIcon ? (
            columnsIcon[title as keyof IIssue]
          ) : (
            <FaPlus />
          )}
        </div>
        {title}
      </div>

      <div className="z-10 cursor-pointer opacity-0 group-hover:opacity-100">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <FaArrowDown />
        </Dropdown>
      </div>
    </div>
  );
};

import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import {
  LuBookmark,
  LuBug,
  LuClipboardCheck,
  LuStar,
  LuX,
} from "react-icons/lu";

const priorityOptions = [
  { name: "High", icon: <FcHighPriority size={20} /> },
  { name: "Medium", icon: <FcMediumPriority size={20} /> },
  { name: "Low", icon: <FcLowPriority size={20} /> },
];

const columnsIcon: Record<keyof IIssue, React.ReactNode> = {
  id: <FaPlus />,
  project_id: <FaPlus />,
  title: <MdOutlineSubtitles />,
  summary: <MdOutlineSummarize />,
  description: <MdOutlineDescription />,
  column: <FaPlus />,
  priority: <FaPlus />,
  type: <FaPlus />,
  team_id: <RiTeamFill />,
  sprint_id: <IoIosPrint />,
  assignee_id: <CiAt />,
  reporter_id: <CiAt />,
  parent_id: <MdOutlineBedroomParent />,
  story_point: <FcHighPriority />,
  labels: <MdLabelImportantOutline />,
  attachments: <FaPlus />,
  created_at: <FaCalendarAlt />,
  updated_at: <FaCalendarAlt />,
};

const typeOptions = [
  {
    id: "Bug",
    name: "Bug",
    icon: <LuBug className="h-4 w-4 text-red-500" />,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    id: "Task",
    name: "Task",
    icon: <LuClipboardCheck className="h-4 w-4 text-blue-500" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    id: "Story",
    name: "Story",
    icon: <LuBookmark className="h-4 w-4 text-green-500" />,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    id: "Epic",
    name: "Epic",
    icon: <LuStar className="h-4 w-4 text-purple-500" />,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];
