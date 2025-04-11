import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useUserProjects } from "@libs/hooks/useProject";
import { useNavigate } from "react-router-dom";
import { IProject } from "@libs/types/project";

const columns: TableColumnsType<IProject> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "40%",
    sorter: (a, b) => a.name.length - b.name.length,
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

const ProjectTable: React.FC = () => {
  const { projects, isLoading } = useUserProjects();
  const navigate = useNavigate();

  return (
    <Table<IProject>
      columns={columns}
      dataSource={projects}
      loading={isLoading}
      onRow={(record) => {
        return {
          style: { cursor: "pointer" },
          onClick: () => {
            navigate(`/projects/${record.id}`);
          },
        };
      }}
    />
  );
};

export default ProjectTable;
