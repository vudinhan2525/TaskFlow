import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard: React.FC = () => {
  // Mock data - replace with actual data from your API
  const metrics = {
    completedIssues: 45,
    newIssues: 12,
    updatedLastWeek: 28,
    dueNextWeek: 15,
  };

  const statusData = {
    labels: ["Todo", "In Progress", "Done"],
    datasets: [
      {
        data: [30, 25, 45],
        backgroundColor: ["#94a3b8", "#60a5fa", "#4ade80"],
        borderColor: ["#f8fafc", "#f8fafc", "#f8fafc"],
        borderWidth: 2,
      },
    ],
  };

  const priorityData = {
    labels: ["I", "II", "III"],
    datasets: [
      {
        label: "Issues by Priority",
        data: [8, 15, 10],
        backgroundColor: ["#ef4444", "#f97316", "#eab308"],
        borderColor: ["#fee2e2", "#ffedd5", "#fef9c3"],
        borderWidth: 1,
      },
    ],
  };

  const typeData = {
    labels: ["Bug", "Feature", "Task", "Epic"],
    datasets: [
      {
        label: "Issues by Type",
        data: [12, 19, 15, 5],
        backgroundColor: ["#f43f5e", "#8b5cf6", "#06b6d4", "#10b981"],
        borderColor: ["#ffe4e6", "#f3e8ff", "#cffafe", "#d1fae5"],
        borderWidth: 1,
      },
    ],
  };

  const recentActivity = [
    { id: 1, action: "Issue created", title: "Implement user authentication", time: "2 hours ago" },
    { id: 2, action: "Issue completed", title: "Fix navigation bug", time: "4 hours ago" },
    { id: 3, action: "Comment added", title: "Update dashboard design", time: "5 hours ago" },
    { id: 4, action: "Status updated", title: "Optimize database queries", time: "1 day ago" },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Completed Issues</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{metrics.completedIssues}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">New Issues</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{metrics.newIssues}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Updated Last 7 Days</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{metrics.updatedLastWeek}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Due Next 7 Days</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{metrics.dueNextWeek}</p>
        </div>
      </div>

      {/* Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Priority</h3>
          <div className="h-64">
            <Bar data={priorityData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Type</h3>
          <div className="h-64">
            <Bar data={typeData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
