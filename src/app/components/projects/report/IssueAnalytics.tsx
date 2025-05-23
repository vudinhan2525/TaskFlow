import { UserStats } from "@libs/types/project";

interface IssueCount {
  label: string;
  value: number;
  color: string;
}

const IssueAnalytics = ({ data }: { data: UserStats }) => {
  // Color mappings for each category
  const priorityColors: { [key: string]: string } = {
    High: "#ef4444", // Red
    Medium: "#f97316", // Orange
    Low: "#eab308", // Yellow
  };

  const typeColors: { [key: string]: string } = {
    Bug: "#ef4444", // Red
    Task: "#60a5fa", // Blue
    Feature: "#8b5cf6", // Purple
    Documentation: "#10b981", // Green
  };

  const priorityData: IssueCount[] = data.by_priority.map((item) => ({
    label: item.priority,
    value: item.count,
    color: priorityColors[item.priority] || "#6b7280", // Fallback color
  }));

  const typeData: IssueCount[] = data.by_type.map((item) => ({
    label: item.type,
    value: item.count,
    color: typeColors[item.type] || "#6b7280", // Fallback color
  }));

  const maxPriorityValue = Math.max(...priorityData.map((d) => d.value), 1);
  const maxTypeValue = Math.max(...typeData.map((d) => d.value), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Priority Distribution */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Priority Distribution
        </h3>
        <div className="space-y-4">
          {priorityData.map((item, index) => (
            <div key={index}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
              </div>
              <div className="h-4 w-full rounded bg-gray-100">
                <div
                  className="h-4 rounded transition-all duration-500"
                  style={{
                    width: `${(item.value / maxPriorityValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Distribution */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Work Type Breakdown
        </h3>
        <div className="space-y-4">
          {typeData.map((item, index) => (
            <div key={index}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
              </div>
              <div className="h-4 w-full rounded bg-gray-100">
                <div
                  className="h-4 rounded transition-all duration-500"
                  style={{
                    width: `${(item.value / maxTypeValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueAnalytics;
