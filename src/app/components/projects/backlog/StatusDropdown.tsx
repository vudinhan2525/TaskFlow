import React from "react";
import { IssueStatus } from "@libs/types";

interface StatusDropdownProps {
  status: IssueStatus;
  onChange: (newStatus: IssueStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onChange }) => {
  const statusColors = {
    "To Do": "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Done: "bg-green-100 text-green-800",
  };

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as IssueStatus)}
      className={`px-2 py-1 rounded border-0 ${statusColors[status]} cursor-pointer`}
    >
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  );
};

export default StatusDropdown;
