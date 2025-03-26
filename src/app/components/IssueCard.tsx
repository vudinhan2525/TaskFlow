import { type Issue, type Priority, type Status } from "../../types";

interface IssueCardProps {
  issue: Issue;
  onStatusChange?: (newStatus: Status) => void;
  onPriorityChange?: (newPriority: Priority) => void;
}

const priorityColors: Record<Priority, string> = {
  Highest: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
  Lowest: "bg-gray-500",
};

const statusColors: Record<Status, string> = {
  "To Do": "bg-gray-500",
  "In Progress": "bg-blue-500",
  "In Review": "bg-yellow-500",
  Done: "bg-green-500",
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onStatusChange, onPriorityChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{issue.key}</span>
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${priorityColors[issue.priority]}`}
            title={`Priority: ${issue.priority}`}
          />
          <span className={`px-2 py-1 text-xs text-white rounded ${statusColors[issue.status]}`}>{issue.status}</span>
        </div>
      </div>

      <h3 className="font-medium mb-2">{issue.title}</h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {issue.assignee && (
            <img
              src={issue.assignee.avatar}
              alt={issue.assignee.name}
              className="w-6 h-6 rounded-full"
              title={`Assigned to: ${issue.assignee.name}`}
            />
          )}
          {issue.labels.length > 0 && (
            <div className="flex space-x-1">
              {issue.labels.map((label) => (
                <span key={label.id} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: label.color }}>
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {issue.estimate && <span className="text-sm text-gray-500">{issue.estimate} points</span>}
      </div>

      {issue.epic && <div className="mt-2 text-sm text-purple-600">{issue.epic.title}</div>}
    </div>
  );
};

export default IssueCard;
