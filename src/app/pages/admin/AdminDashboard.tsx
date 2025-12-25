import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FolderKanban,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Mock data - bạn sẽ thay thế bằng API calls thực
const generateMockData = () => {
  const userGrowthData = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    users: Math.floor(Math.random() * 50) + 20 + i * 10,
    projects: Math.floor(Math.random() * 30) + 10 + i * 5,
  }));

  const projectTypeData = [
    { name: "Agile", value: 45, color: "#3b82f6" },
    { name: "Waterfall", value: 25, color: "#10b981" },
    { name: "Hybrid", value: 20, color: "#f59e0b" },
    { name: "Other", value: 10, color: "#6366f1" },
  ];

  const issueStatusData = [
    { status: "Open", count: 34, color: "#ef4444" },
    { status: "In Progress", count: 58, color: "#f59e0b" },
    { status: "Review", count: 23, color: "#3b82f6" },
    { status: "Done", count: 89, color: "#10b981" },
  ];

  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    activities: Math.floor(Math.random() * 100) + 50,
  }));

  return { userGrowthData, projectTypeData, issueStatusData, activityData };
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="font-medium text-green-600">{trend}%</span>
            <span className="ml-1 text-gray-500">vs last month</span>
          </div>
        )}
      </div>
      <div className={`rounded-full p-4 bg-${color}-50`}>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    // Simulate API call
    setData(generateMockData());
  }, [timeRange]);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { userGrowthData, projectTypeData, issueStatusData, activityData } =
    data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Welcome back! Here's what's happening.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value="1,248"
            icon={Users}
            trend={12.5}
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value="156"
            icon={FolderKanban}
            trend={8.3}
            color="green"
          />
          <StatCard
            title="Total Issues"
            value="204"
            icon={AlertCircle}
            trend={-3.2}
            color="orange"
          />
          <StatCard
            title="Activities Today"
            value="892"
            icon={Activity}
            trend={15.7}
            color="purple"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User & Project Growth */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Growth Overview
              </h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Users</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-600"></div>
                  <span className="text-gray-600">Projects</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Project Types Distribution */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Project Types
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Issue Status */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Issue Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={issueStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {issueStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Activity */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Weekly Activity
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="activities"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Recent Activities
          </h2>
          <div className="space-y-3">
            {[
              {
                user: "John Doe",
                action: "created a new project",
                project: "Website Redesign",
                time: "5 minutes ago",
                type: "success",
              },
              {
                user: "Jane Smith",
                action: "completed issue",
                project: "Mobile App",
                time: "15 minutes ago",
                type: "success",
              },
              {
                user: "Mike Johnson",
                action: "commented on",
                project: "API Integration",
                time: "1 hour ago",
                type: "info",
              },
              {
                user: "Sarah Williams",
                action: "moved issue to",
                project: "Dashboard Update",
                time: "2 hours ago",
                type: "info",
              },
              {
                user: "Tom Brown",
                action: "assigned issue to",
                project: "Bug Fixes",
                time: "3 hours ago",
                type: "warning",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-semibold">{activity.project}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
