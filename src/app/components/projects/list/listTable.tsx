import { useRef } from "react";
import {
  FaCalendarAlt,
  FaListUl,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { CiAt } from "react-icons/ci";
import {
  // MdOutlineAssignmentInd,
  // MdReportGmailerrorred,
  MdOutlineBedroomParent,
  MdLabelImportantOutline,
  MdOutlineSubtitles,
  MdOutlineSummarize,
  MdOutlineDescription,
} from "react-icons/md";
import { IoIosPrint, IoIosClose } from "react-icons/io";
import { Table, Dropdown } from "antd";
import type { TableProps, TableColumnType, MenuProps } from "antd";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssuePriority, IssueStatus } from "@libs/types/issue";
import { format } from "date-fns";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectColumns } from "@libs/hooks/useProject";
import ColumnInputFiled from "./listTableColumns/ColumnInputFiled";
import ColumnDropdown from "./listTableColumns/ColumnDropdown";
import { useUser } from "@libs/hooks/useUser";
import { IProjectMember } from "@libs/types/projectMember";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
const ListTable = ({
  issues,
  visibleColumns,
  setVisibleColumns,
  rowSelection,
  handleChangeCellValue,
  keyword,
  projectId,
}: {
  issues: IIssue[];
  visibleColumns: { key: string; visible: boolean }[];
  setVisibleColumns: (columns: { key: string; visible: boolean }[]) => void;
  rowSelection: TableProps<IIssue>["rowSelection"];
  handleChangeCellValue: (
    id: string,
    field: keyof IIssue,
    value: string,
  ) => void;
  keyword: string;
  projectId: string;
}) => {
  const { columns } = useProjectColumns(projectId || "");
  const { sprints } = useProjectSprints(projectId || "");
  const { projectMembers } = useProjectMembers(projectId || "");

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
    createColumn("type", "type", (type) => (
      <div className="rounded-md bg-gray-300 p-1 text-center font-medium text-gray-700">
        {type}
      </div>
    )),
    // Title
    createColumn("title", "title", (_, { title }) => (
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
      "summary",
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
    createColumn("description", "description", (_, { id }) => (
      <ColumnInputFiled
        issueId={id}
        field="description"
        handleChangeCellValue={handleChangeCellValue}
      />
    )),
    // Status
    createColumn("status", "status", (_, { id, status }) => (
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
              className={`flex items-center p-2 pr-12 hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300 ${option.name === status && "border-l-2 border-emerald-500 bg-emerald-100"}`}
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
              {status ? status.toUpperCase() : "-"}
            </p>
          </button>
        }
        currentItem={status}
      />
    )),
    // Priority
    createColumn("priority", "priority", (_, { id, priority }) => (
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
              <div className="flex items-center gap-2 rounded-md p-1 text-center text-xs font-bold">
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
          <button className="flex items-center gap-2 rounded-md p-1 hover:cursor-pointer">
            {priorityOptions.find((option) => option.name === priority)?.icon}
            <p className="text-xs font-bold">{priority}</p>
          </button>
        }
      />
    )),
    // Sprint
    createColumn("sprint_id", "sprint_id", (_, { id, sprint_id }) => (
      <ColumnDropdown
        items={sprints.map((sprint) => ({
          value: sprint.name,
          key: sprint.id,
          label: (
            <span className="rounded-sm bg-gray-100 p-2 text-center font-medium text-gray-700">
              {sprint.name}
            </span>
          ),
          onClick: () => {
            handleChangeCellValue(
              id,
              "sprint_id" as keyof IIssue,
              sprint.id as string,
            );
          },
        }))}
        currentItem={sprints.find((sprint) => sprint.id === sprint_id)?.name}
        children={
          <div className="rounded-md bg-gray-300 text-center font-medium text-gray-700">
            <p>{sprints.find((sprint) => sprint.id === sprint_id)?.name}</p>
          </div>
        }
      />
    )),
    // Assignee
    createColumn("assignee_id", "assignee_id", (_, { id, assignee_id }) => (
      <ColumnDropdown
        items={
          projectMembers &&
          projectMembers
            .map((member: IProjectMember) => ({
              value: member.user_id,
              key: member.user_id,
              label: <RenderUserCell userId={member.user_id} />,
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
              label: <RenderUserCell />,
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
        children={<RenderUserCell userId={assignee_id || ""} />}
      />
    )),
    // Reporter
    createColumn("reporter_id", "reporter_id", (_, { id, reporter_id }) => (
      <ColumnDropdown
        items={
          projectMembers &&
          projectMembers
            .map((member: IProjectMember) => ({
              value: member.user_id,
              key: member.user_id,  
              label: <RenderUserCell userId={member.user_id} />,
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
              label: <RenderUserCell />,
              onClick: () => {
                handleChangeCellValue(
                  id,
                  "reporter_id" as keyof IIssue,
                    "" as string
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
        children={<RenderUserCell userId={reporter_id || ""} />}
      />
    )),
    // Team
    createColumn("team_id", "team_id", (_, { team_id }) => (
      <span className="inline-flex items-center gap-1">
        <RiTeamFill className="text-gray-500" />
        {team_id || "-"}
      </span>
    )),
    // Parent Issue
    createColumn("parent_id", "parent_id", (_, { parent_id }) => (
      <span className="text-sm text-gray-500">
        {parent_id ? parent_id.substring(0, 8) : "-"}
      </span>
    )),
    // Labels
    createColumn("labels", "labels", (_, { labels }) => (
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
    createColumn("attachments", "attachments", (_, { attachments }) => (
      <span className="text-gray-500">
        {attachments.length > 0 ? `📎 ${attachments.length}` : "-"}
      </span>
    )),
    // Points
    createColumn(
      "story_point",
      "story_point",
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
      "created_at",
      (_, { created_at }) => renderDateCell(created_at),
      {
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
    ),
    // Updated
    createColumn(
      "updated_at",
      "updated_at",
      (_, { updated_at }) => renderDateCell(updated_at),
      {
        sorter: (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      },
    ),
  ];
  const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={tableContainerRef} className="relative">
      <Table
        columns={tableColumns}
        dataSource={issues}
        bordered={true}
        rowSelection={{ ...rowSelection }}
        rowKey="id"
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
            <div className="cursor-pointer rounded-sm px-2 py-4 hover:bg-gray-100">
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
    <div className="px-2">
      <span className="rounded-md bg-gray-300 px-2 py-1 text-center font-medium text-gray-700">
        {format(new Date(date), "MM/dd/yyyy")}
      </span>
    </div>
  );
};

const RenderUserCell = ({ userId }: { userId?: string }) => {
  const { user } = useUser(userId || "");
  return (
    <div className={``}>
      {userId ? (
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || "")}+${encodeURIComponent(user?.last_name || "")}&background=random&color=fff&size=32`}
            alt={`${user?.first_name} ${user?.last_name}`}
            className="h-7 w-7 rounded-full"
          />
          <span className="text-gray-600">
            {user?.first_name + " " + user?.last_name}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=U&background=e2e8f0&color=94a3b8&size=32"
            alt="Unknown user"
            className="h-7 w-7 rounded-full"
          />
          <span className="text-gray-400">Unassigned</span>
        </div>
      )}
    </div>
  );
};

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
          <p>Sort A {"A->"} Z</p>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <FaArrowDown />
          <p>Sort Z {"Z->"} A</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <IoIosClose />
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

      <div className="z-50 cursor-pointer opacity-0 group-hover:opacity-100">
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
  status: <FaPlus />,
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
