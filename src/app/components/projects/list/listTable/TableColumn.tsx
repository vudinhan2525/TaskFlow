import { IIssue } from "@libs/types/issue";
import { Dropdown, MenuProps, TableColumnType } from "antd";
import React from "react";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import { FaArrowDown, FaListUl } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { columnsIcon } from "../../../../../constants/list";
import { SortOrder } from "antd/es/table/interface";
const TableColumn = (
  key: keyof IIssue,
  title: string,
  visibleColumns: { key: keyof IIssue; visible: boolean }[],
  handleVisible: (key: keyof IIssue) => void,
  handleSort: (
    key: keyof IIssue,
    sortOrder: "ascend" | "descend" | null,
  ) => void,
  render: (value: string, record: IIssue) => React.ReactNode,
  options: {
    multiple?: number;
    sortOrder?: "ascend" | "descend" | null;
    sorter?: (a: IIssue, b: IIssue) => number;
    align?: "start" | "center" | "end";
    colSpan?: number;
  } = {},
): TableColumnType<IIssue> => {
  const items: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center gap-2">
          <FaArrowUp />
          <p>Sort {"A -> Z"}</p>
        </div>
      ),
      key: "sort-asc",
      onClick: () => handleSort(key, "ascend"),
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <FaArrowDown />
          <p>Sort {"Z -> A"}</p>
        </div>
      ),
      key: "sort-desc",
      onClick: () => handleSort(key, "descend"),
    },
    {
      label: (
        <div className={`flex items-center gap-2`}>
          <LuX className="h-4 w-4 font-bold" />
          <p>Clear Sort</p>
        </div>
      ),
      disabled: options.sortOrder === null,
      key: "clear-sort",
      onClick: () => handleSort(key, null),
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <LuX className="h-4 w-4 font-bold" />
          <p>Hide field</p>
        </div>
      ),
      key: "hide-field",
      onClick: () => handleVisible(key),
    },
  ].filter((item) => item.disabled !== true);

  return {
    title: (
      <div className="group item flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="hidden rounded-md p-1 group-hover:block">
            <FaListUl />
          </div>
          <div className="rounded-md p-1 group-hover:hidden">
            {key in columnsIcon ? (
              columnsIcon[key as keyof IIssue]
            ) : (
              <FaPlus className="h-3 w-3" />
            )}
          </div>
          <span className="text-xs font-bold text-[#626f86]">{title}</span>
        </div>

        <div className="z-10 cursor-pointer opacity-0 group-hover:opacity-100">
          <Dropdown menu={{ items }} trigger={["click"]}>
            <FaAngleDown />
          </Dropdown>
        </div>
      </div>
    ),
    dataIndex: key,
    key,
    sortOrder: options.sortOrder,
    hidden: !visibleColumns.find((column) => column.key === key)?.visible,
    render,
    sortIcon: (props: { sortOrder: SortOrder }) => {
      console.log(props);
      if (options.sortOrder === null) return <div></div>;
      if (options.sortOrder === "ascend") return <FaArrowUp />;
      if (options.sortOrder === "descend") return <FaArrowDown />;
    },
    sorter: {
      multiple: options.multiple,
      compare: (a: IIssue, b: IIssue) => {
        if (options.sortOrder === null) {
          return 0;
        }
        if (options.sortOrder === "ascend" && key in a && key in b) {
          const aValue = a[key as keyof IIssue];
          const bValue = b[key as keyof IIssue];
          if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
          } else if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          return 0;
        }
        return 1;
      },
    },
  };
};

export default TableColumn;
