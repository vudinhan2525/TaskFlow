import React, { useRef } from "react";
import { FaCalendarAlt, FaListUl, FaPlus } from "react-icons/fa";
import { Table, Dropdown } from "antd";
import type { TableProps, TableColumnType, MenuProps } from "antd";
import {
  MdOutlineSubtitles,
  MdOutlineSummarize,
  MdOutlineDescription,
} from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { IIssue, IssueStatus } from "@libs/types/issue";
import { format } from "date-fns";
import { Sprint } from "@libs/types/index";
import { useProjectColumns } from "@libs/hooks/useProject";
import { IoIosPrint } from "react-icons/io";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FcHighPriority } from "react-icons/fc";
import { MdLabelImportantOutline } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
const ListTable = ({
  issues,
  visibleColumns,
  setVisibleColumns,
  rowSelection,
  handleFieldChange,
  handleFieldBlur,
  handleStatusChange,
  keyword,
  projectId,
  initTypeValues,
  sprints,
}: {
  issues: IIssue[];
  visibleColumns: { key: string; visible: boolean }[];
  setVisibleColumns: (columns: { key: string; visible: boolean }[]) => void;
  rowSelection: TableProps<IIssue>["rowSelection"];
  handleFieldChange: (id: string, field: string, value: string) => void;
  handleFieldBlur: (id: string, field: string, value: string) => void;
  handleStatusChange: (id: string, status: IssueStatus) => void;
  keyword: string;
  projectId: string;
  initTypeValues: IIssue[];
  sprints: Sprint[];
}) => {
  const { columns } = useProjectColumns(projectId || "");
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
  const tableColumns: TableColumnType<IIssue>[] = [
    // Type
    {
      title: renderTableHeaderCell({
        title: "type",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "type" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "type",
      render: (type) => (
        <div className="bg-gray-300 text-gray-700 rounded-md p-1 font-medium text-center">
          {type}
        </div>
      ),
    },
    // Title
    {
      title: renderTableHeaderCell({
        title: "title",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "title" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "title",
      key: "title",
      hidden: !visibleColumns.find((column) => column.key === "title")?.visible,
      render: (_, { title }) => {
        return (
          <p className=" p-2">
            {keyword ? (
              <p>
                {title.slice(
                  0,
                  title.toLowerCase().indexOf(keyword.toLowerCase())
                )}
                <span className="text-emerald-500">{keyword}</span>
                {title.slice(
                  title.toLowerCase().indexOf(keyword.toLowerCase()) +
                    keyword.length
                )}
              </p>
            ) : (
              title
            )}
          </p>
        );
      },
    },
    // Summary
    {
      title: renderTableHeaderCell({
        title: "summary",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "summary" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "summary",
      key: "summary",
      sorter: (a, b) => a.summary.localeCompare(b.summary),
      render: (_, { id }) => {
        return (
          <input
            onChange={(e) => handleFieldChange(id, "summary", e.target.value)}
            onBlur={(e) => handleFieldBlur(id, "summary", e.target.value)}
            value={
              initTypeValues.find((issue) => issue.id === id)?.summary || ""
            }
            className="flex items-center gap-2 hover:bg-gray-100 rounded outline-none
                p-2  border-transparent border-2 focus:border-emerald-500  
                "
          />
        );
      },
    },
    // Description
    {
      title: renderTableHeaderCell({
        title: "description",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "description" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "description",
      key: "description",
      hidden: !visibleColumns.find((column) => column.key === "description")
        ?.visible,
      render: (_, { id }) => {
        return (
          <input
            onChange={(e) =>
              handleFieldChange(id, "description", e.target.value)
            }
            onBlur={(e) => handleFieldBlur(id, "description", e.target.value)}
            value={
              initTypeValues.find((issue) => issue.id === id)?.description || ""
            }
            className="flex items-center gap-2 hover:bg-gray-100 rounded outline-none
                p-2 border-transparent border-2 focus:border-emerald-500"
          />
        );
      },
    },
    // Status
    {
      title: renderTableHeaderCell({
        title: "status",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "status" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        const aOrder =
          statusOptions.find((option) => option.id === a.status)?.order || 0;
        const bOrder =
          statusOptions.find((option) => option.id === b.status)?.order || 0;
        return aOrder - bOrder;
      },
      render: (_, { id, status }) => {
        return (
          <Dropdown
            menu={{
              style: {
                padding: 0,
                background: "",
                border: "none",
                borderRadius: "0px",
              },
              items: statusOptions.map((option) => ({
                style: {
                  padding: 0,
                  background: "white",
                  border: "none",
                },
                label: (
                  <div
                    key={option.id}
                    className="flex items-center hover:bg-gray-300 p-2 pr-12"
                  >
                    <button
                      className={`text-xs rounded-md  p-1 hover:cursor-pointer ${option.bgColor} group-hover:bg-none`}
                    >
                      <p
                        className={`text-xs 
    ${option.textColor} text-center font-bold
    `}
                      >
                        {option.name}
                      </p>
                    </button>
                  </div>
                ),

                key: option.id,
                onClick: () =>
                  handleStatusChange(id, option.name as IssueStatus),
              })),
            }}
            trigger={["click"]}
            className="cursor-pointer group"
          >
            <button
              className={`text-xs rounded-md  p-1 hover:cursor-pointer ${
                statusOptions.find((option) => option.name === status)?.bgColor
              } group-hover:bg-none`}
            >
              <p
                className={`text-xs 
    ${
      statusOptions.find((option) => option.name === status)?.textColor
    } text-center font-bold
    `}
              >
                {status ? status.toUpperCase() : "-"}
              </p>
            </button>
          </Dropdown>
        );
      },
    },
    // Priority
    {
      title: renderTableHeaderCell({
        title: "priority",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "priority" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "priority",
      key: "priority",
      render: (_, { priority }) => {
        return (
          <div
            className={`text-xs rounded-md p-1 text-center font-bold ${
              priority === "High"
                ? "bg-red-100 text-red-700"
                : priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {priority}
          </div>
        );
      },
    },
    // Sprint
    {
      title: renderTableHeaderCell({
        title: "sprint_id",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "sprint_id" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "sprint_id",
      key: "sprint_id",
      render: (_, { sprint_id }) => {
        return (
          <span>{sprints.find((sprint) => sprint.id === sprint_id)?.name}</span>
        );
      },
    },
    // // Assignee
    // {
    //   title: renderTableHeaderCell("assignee_id", <FaPlus />),
    //   dataIndex: "assignee_id",
    //   key: "assignee_id",
    //   hidden: !visibleColumns.find((column) => column.key === "assignee_id")
    //     ?.visible,
    //   render: (_, { assignee_id }) => {
    //     return (
    //       <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
    //         {assignee_id.substring(0, 2).toUpperCase()}
    //       </span>
    //     );
    //   },
    // },
    // // Reporter
    // {
    //   title: renderTableHeaderCell("reporter_id", <FaPlus />),
    //   dataIndex: "reporter_id",
    //   key: "reporter_id",
    //   hidden: !visibleColumns.find((column) => column.key === "reporter_id")
    //     ?.visible,
    //   render: (_, { reporter_id }) => {
    //     return (
    //       <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">
    //         {reporter_id?.substring(0, 2).toUpperCase() || "-"}
    //       </span>
    //     );
    //   },
    // },
    // // Team
    // {
    //   title: renderTableHeaderCell("team_id", <FaPlus />),
    //   dataIndex: "team_id",
    //   key: "team_id",
    //   hidden: !visibleColumns.find((column) => column.key === "team_id")
    //     ?.visible,
    //   render: (_, { team_id }) => {
    //     return (
    //       <span className="inline-flex items-center gap-1">
    //         <RiTeamFill className="text-gray-500" />
    //         {team_id || "-"}
    //       </span>
    //     );
    //   },
    // },
    // // Parent Issue
    // {
    //   title: renderTableHeaderCell("parent_id", <FaPlus />),
    //   dataIndex: "parent_id",
    //   key: "parent_id",
    //   hidden: !visibleColumns.find((column) => column.key === "parent_id")
    //     ?.visible,
    //   render: (_, { parent_id }) => {
    //     return (
    //       <span className="text-gray-500 text-sm">
    //         {parent_id ? parent_id.substring(0, 8) : "-"}
    //       </span>
    //     );
    //   },
    // },
    // // Labels
    // {
    //   title: renderTableHeaderCell("labels", <FaPlus />),
    //   dataIndex: "labels",
    //   key: "labels",
    //   hidden: !visibleColumns.find((column) => column.key === "labels")
    //     ?.visible,
    //   render: (_, { labels }) => {
    //     return (
    //       <div className="flex flex-wrap gap-1">
    //         {labels?.map((label) => (
    //           <span
    //             key={label}
    //             className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
    //           >
    //             {label}
    //           </span>
    //         )) || "-"}
    //       </div>
    //     );
    //   },
    // },
    // // Attachments
    // {
    //   title: renderTableHeaderCell("attachments", <FaPlus />),
    //   dataIndex: "attachments",
    //   key: "attachments",
    //   hidden: !visibleColumns.find((column) => column.key === "attachments")
    //     ?.visible,
    //   render: (_, { attachments }) => {
    //     return (
    //       <span className="text-gray-500">
    //         {attachments.length > 0 ? `📎 ${attachments.length}` : "-"}
    //       </span>
    //     );
    //   },
    // },
    // // Points
    // {
    //   title: renderTableHeaderCell("story_point", <FaPlus />),
    //   dataIndex: "story_point",
    //   key: "story_point",
    //   hidden: !visibleColumns.find((column) => column.key === "story_point")
    //     ?.visible,
    //   align: "end",
    //   colSpan: 1,
    //   render: (_, { story_point }) => {
    //     return (
    //       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
    //         {story_point || 0} {story_point === 1 ? "point" : "points"}
    //       </span>
    //     );
    //   },
    // },
    // Created
    {
      title: renderTableHeaderCell({
        title: "created_at",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "created_at" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "created_at",
      key: "created_at",
      hidden: !visibleColumns.find((column) => column.key === "created_at")
        ?.visible,
      sorter: (a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      },
      render: (_, { created_at }) => renderDateCell(created_at),
    },
    // Updated
    {
      title: renderTableHeaderCell({
        title: "updated_at",
        handleClick: () =>
          setVisibleColumns(
            visibleColumns.map((column) =>
              column.key === "updated_at" ? { ...column, visible: !column.visible } : column
            )
          ),
      }),
      dataIndex: "updated_at",
      key: "updated_at",
      colSpan: 1,
      sorter: (a, b) => {
        return (
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
      },
      render: (_, { updated_at }) => renderDateCell(updated_at),
    },
  ];
  const issueProperties = Object.keys(issues?.[0] || {}) as Array<keyof IIssue>;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={tableContainerRef} className=" relative">
      <Table
        columns={tableColumns}
        dataSource={issues}
        bordered={true}
        rowSelection={{ ...rowSelection }}
        rowKey="id"
        scroll={{ x: "max-content" }}
        style={{ padding: 0, width: tableContainerRef.current?.offsetWidth }}
      />

      <div className="absolute top-0 z-50 right-0 bg-gray-100">
        <Dropdown
          menu={{
            items: [
              ...issueProperties
                .filter(
                  (property) =>
                    !visibleColumns.find((column) => column.key === property)
                      ?.visible
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
                        c.key === property ? { ...c, visible: !c.visible } : c
                      )
                    ),
                })),
            ],
          }}
          trigger={["click"]}
        >
          <div className="py-5 px-2 hover:bg-gray-100 rounded-sm cursor-pointer">
            <FaPlus />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default ListTable;

const renderDateCell = (date: string) => {
  return (
    <div className="px-2">
      <span className="bg-gray-300 text-gray-700 rounded-md py-1 px-2 font-medium text-center">
        {format(new Date(date), "MM/dd/yyyy")}
      </span>
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
    <div className="flex items-center gap-2 group justify-between item">
      <div className="flex items-center gap-2">
        <div className=" group-hover:block hidden rounded-md p-1">
          <FaListUl />
        </div>
        <div className="group-hover:hidden rounded-md p-1">
          {title in columnsIcon ? columnsIcon[title as keyof IIssue] : <FaPlus />}
        </div>
        {title}
      </div>

      <div className="group-hover:opacity-100 opacity-0 cursor-pointer z-50">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <FaArrowDown />
        </Dropdown>
      </div>
    </div>
  );
};
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
  assignee_id: <MdOutlineAssignmentInd />,
  reporter_id: <MdReportGmailerrorred />,
  parent_id: <MdOutlineBedroomParent />,
  story_point: <FcHighPriority />,
  labels: <MdLabelImportantOutline />,
  attachments: <FaPlus />,
  created_at: <FaCalendarAlt />,
  updated_at: <FaCalendarAlt />,
};
