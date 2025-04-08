import React from "react";

interface StatusData {
  label: string;
  value: number;
  color: string;
}

interface ActivityItem {
  timestamp: string;
  user: string;
  action: string;
  issueTitle: string;
  modifiedFields: string[];
  type: "create" | "update" | "complete";
}

const StatusOverview: React.FC = () => {
  const statusData: StatusData[] = [
    { label: "To Do", value: 30, color: "#94a3b8" },
    { label: "In Progress", value: 45, color: "#60a5fa" },
    { label: "Done", value: 25, color: "#4ade80" },
  ];

  const activities: ActivityItem[] = [
    {
      timestamp: "2 min ago",
      user: "John Doe",
      action: "updated",
      issueTitle: "Implement login page",
      modifiedFields: ["Status", "Priority"],
      type: "update",
    },
    {
      timestamp: "1 hour ago",
      user: "Jane Smith",
      action: "completed",
      issueTitle: "Fix navigation bug",
      modifiedFields: ["Status"],
      type: "complete",
    },
    {
      timestamp: "2 hours ago",
      user: "Mike Johnson",
      action: "created",
      issueTitle: "Add user settings page",
      modifiedFields: [],
      type: "create",
    },
  ];

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
        <div className="flex flex-col space-y-4">
          {statusData.map((status, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{status.label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {status.value} ({getPercentage(status.value)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(status.value / total) * 100}%`,
                    backgroundColor: status.color,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <p className="text-center text-sm text-gray-500">
              Total Issues: <span className="font-semibold text-gray-900">{total}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className={`
                w-2 h-2 mt-2 rounded-full
                ${
                  activity.type === "create"
                    ? "bg-green-500"
                    : activity.type === "update"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }
              `}
              />
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.issueTitle}</span>
                </p>
                {activity.modifiedFields.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Modified: {activity.modifiedFields.join(", ")}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;
