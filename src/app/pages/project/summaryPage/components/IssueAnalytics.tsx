import React from "react";

interface IssueCount {
  label: string;
  value: number;
  color: string;
}

const IssueAnalytics: React.FC = () => {
  const priorityData: IssueCount[] = [
    { label: "High", value: 12, color: "#ef4444" },
    { label: "Medium", value: 25, color: "#f97316" },
    { label: "Low", value: 18, color: "#eab308" },
  ];

  const typeData: IssueCount[] = [
    { label: "Bug", value: 15, color: "#ef4444" },
    { label: "Feature", value: 20, color: "#8b5cf6" },
    { label: "Task", value: 28, color: "#60a5fa" },
    { label: "Documentation", value: 8, color: "#10b981" },
  ];

  const maxPriorityValue = Math.max(...priorityData.map((d) => d.value));
  const maxTypeValue = Math.max(...typeData.map((d) => d.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
        <div className="space-y-4">
          {priorityData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded">
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Work Type Breakdown</h3>
        <div className="space-y-4">
          {typeData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded">
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
