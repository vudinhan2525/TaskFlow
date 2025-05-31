import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ActivitySection from "@libs/app/components/issues/activitySection";
import { UserStats } from "@libs/types/project";

interface StatusData {
  label: string;
  value: number;
  color: string;
}

const COLOR_PALETTE = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
];

const StatusOverview = (props: { data: UserStats }) => {
  const { by_status } = props.data;
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const statusData: StatusData[] = by_status.map((status, idx) => ({
    label: status.name,
    value: status.count,
    color: COLOR_PALETTE[idx] || "#94a3b8",
  }));

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) =>
    total === 0 ? "0.0" : ((value / total) * 100).toFixed(1);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">
            {data.payload.label || label}
          </p>
          <p className="text-sm text-gray-600">
            Issues:{" "}
            <span className="font-semibold text-gray-900">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage:{" "}
            <span className="font-semibold text-gray-900">
              {getPercentage(data.value)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Hide labels for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Status Distribution Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Status Distribution
          </h3>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setChartType("pie")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                chartType === "pie"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pie
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                chartType === "bar"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bar
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="mb-6" style={{ height: "280px" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart
                data={statusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            {statusData.map((status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {status.label}
                </span>
                <span className="text-sm text-gray-500">{status.value}</span>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="border-t border-gray-300 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-sm text-gray-500">Total Issues</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {statusData.length}
                </p>
                <p className="text-sm text-gray-500">Status Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        {statusData.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                <span className="font-medium">Most Common:</span>{" "}
                {
                  statusData.reduce((prev, current) =>
                    prev.value > current.value ? prev : current,
                  ).label
                }{" "}
                (
                {getPercentage(
                  statusData.reduce((prev, current) =>
                    prev.value > current.value ? prev : current,
                  ).value,
                )}
                %)
              </p>
              {statusData.length > 1 && (
                <p>
                  <span className="font-medium">Completion Rate:</span>{" "}
                  {(() => {
                    const completedStatuses = statusData.filter(
                      (s) =>
                        s.label.toLowerCase().includes("done") ||
                        s.label.toLowerCase().includes("complete") ||
                        s.label.toLowerCase().includes("closed"),
                    );
                    const completedCount = completedStatuses.reduce(
                      (sum, s) => sum + s.value,
                      0,
                    );
                    return getPercentage(completedCount);
                  })()}
                  %
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ActivitySection showOnlyActivity={true} />
      </div>
    </div>
  );
};

export default StatusOverview;
