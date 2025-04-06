import React from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
const data = [
  {
    key: "1",
    name: "John Brown",
    access: "Private",
    type: "Scrum",
  },
  {
    key: "2",
    name: "Jim Green",
    access: "Private",
    type: "Scrum",
  },
  {
    key: "3",
    name: "Joe Black",
    access: "Public",
    type: "Kanban",
  },
  {
    key: "4",
    name: "Jim Red",
    access: "Private",
    type: "Scrum",
  },
];
interface DataType {
  key: string;
  name: string;
  type: string;
  access: string;
}
const columns: TableColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "40%",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Key",
    dataIndex: "key",
    width: "25%",
    sorter: (a, b) => a.key.length - b.key.length,
  },
  {
    title: "Access Type",
    dataIndex: "access",
    width: "25%",
    sorter: (a, b) => a.access.length - b.access.length,
  },
  {
    title: "Type",
    dataIndex: "type",
    width: "10%",
    sorter: (a, b) => a.type.length - b.type.length,
  },
];

const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const ProjectTable: React.FC = () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    onChange={onChange}
    onRow={(record, rowIndex) => {
      return {
        style: { cursor: "pointer" },
        onClick: () => {
          console.log("Row clicked:", record, rowIndex);
        },
      };
    }}
  />
);

export default ProjectTable;
