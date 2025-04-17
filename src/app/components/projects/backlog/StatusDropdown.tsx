import React from "react";
import { IssueStatus } from "@libs/types/issue";

interface StatusDropdownProps {
  status: IssueStatus;
  onChange: (newStatus: IssueStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onChange }) => {
  const statusMap: Record<IssueStatus, string> = {
    ToDo: "To Do",
    InProgress: "In Progress",
    Done: "Done",
  };

  const statusColors: Record<IssueStatus, string> = {
    ToDo: "bg-gray-100 text-gray-800",
    InProgress: "bg-blue-100 text-blue-800",
    Done: "bg-green-100 text-green-800",
  };

  const displayToStatus: Record<string, IssueStatus> = {
    "To Do": "ToDo",
    "In Progress": "InProgress",
    Done: "Done",
  };

  return (
    <select
      value={statusMap[status]}
      onChange={(e) => {
        const newStatus = displayToStatus[e.target.value];
        if (newStatus) {
          onChange(newStatus);
        }
      }}
      className={`px-2 py-1 rounded border-0 ${statusColors[status]} cursor-pointer`}
    >
      {Object.entries(statusMap).map(([value, display]) => (
        <option key={value} value={display}>
          {display}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
