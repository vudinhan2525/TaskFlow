import React from "react";
import { Column } from "@libs/apis/project";

interface StatusDropdownProps {
  status: string;
  columns: Column[];
  onChange: (newStatus: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, columns, onChange }) => {
  const getStatusColor = (columnName: string) => {
    switch (columnName.toUpperCase()) {
      case "TO DO":
        return "bg-gray-100 text-gray-800";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-1 rounded border-0 ${getStatusColor(status)} cursor-pointer`}
    >
      {columns.map((column) => (
        <option key={column.id} value={column.name}>
          {column.name}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
