import { UserStats } from "@libs/types/project";

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

const COLOR_PALLETTE = ["#94a3b8", "#60a5fa", "#4ade80"];
const StatusOverview = (props: { data: UserStats }) => {
  const { by_status } = props.data;

  const statusData: StatusData[] = by_status.map((status, idx) => ({
    label: status.name,
    value: status.count,
    color: COLOR_PALLETTE[idx] || "#cbd5e1", // default color if not matched
  }));

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) =>
    total === 0 ? "0.0" : ((value / total) * 100).toFixed(1);

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Status Distribution */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Status Distribution
        </h3>
        <div className="flex flex-col space-y-4">
          {statusData.map((status, index) => (
            <div key={index}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {status.label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {status.value} ({getPercentage(status.value)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${getPercentage(status.value)}%`,
                    backgroundColor: status.color,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <p className="text-center text-sm text-gray-500">
              Total Issues:{" "}
              <span className="font-semibold text-gray-900">{total}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className={`mt-2 h-2 w-2 rounded-full ${
                  activity.type === "create"
                    ? "bg-green-500"
                    : activity.type === "update"
                      ? "bg-blue-500"
                      : "bg-purple-500"
                }`}
              />
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.issueTitle}</span>
                </p>
                {activity.modifiedFields.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Modified: {activity.modifiedFields.join(", ")}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;
