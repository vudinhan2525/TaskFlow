import { columnsIcon } from "@libs/constants/list";
import { IIssue } from "@libs/types/issue";
import { TableColumnType } from "antd";
import _ from "lodash";
import React from "react";
import { FaPlus, FaListUl } from "react-icons/fa";

const TableColumn = (
  key: string,
  title: string,
  render: (value: string, record: IIssue) => React.ReactNode,
  width ?: number,
): TableColumnType<IIssue> => {
  return {
    title: (
      <div
        id={key}
        className="group item flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <div className="hidden rounded-md p-1 group-hover:block">
            <FaListUl className="h-3 w-3 text-[#6c757d]" />
          </div>
          <div className="rounded-md p-1 group-hover:hidden">
            {key in columnsIcon ? (
              columnsIcon[key as keyof IIssue]
            ) : (
              <FaPlus className="h-3 w-3 text-[#6c757d]" />
            )}
          </div>
          <span className="text-xs font-bold text-[#6c757d]">{title}</span>
        </div>
      </div>
    ),
    dataIndex: key,
    key,
    render,
    width: width ? width : 150,
    sorter: {
      compare: (a: IIssue, b: IIssue) => {
        const aValue = _.get(a, key);
        const bValue = _.get(b, key);
        if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }
        return 0;
      },
    },
  };
};

export default TableColumn;
