import { useState } from "react";
import {
  Calendar,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function SprintDetail() {
  const [selectedChart, setSelectedChart] = useState("progress");

  // Mock sprint data
  const sprintData = {
    name: "Sprint 12 - User Authentication",
    startDate: "2024-05-01",
    endDate: "2024-05-15",
    status: "completed",
    description:
      "Implementation of user authentication system including login, registration, password reset, and role-based access control. This sprint focuses on security enhancements and user experience improvements.",
    team: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
    goal: "Deliver a complete authentication system with 95% test coverage",
  };

  // Statistics data for charts
  const progressData = [
    { day: "Day 1", planned: 45, completed: 0, remaining: 45 },
    { day: "Day 3", planned: 45, completed: 8, remaining: 37 },
    { day: "Day 5", planned: 45, completed: 18, remaining: 27 },
    { day: "Day 7", planned: 45, completed: 25, remaining: 20 },
    { day: "Day 9", planned: 45, completed: 32, remaining: 13 },
    { day: "Day 11", planned: 45, completed: 38, remaining: 7 },
    { day: "Day 13", planned: 45, completed: 42, remaining: 3 },
    { day: "Day 15", planned: 45, completed: 45, remaining: 0 },
  ];

  const issueTypeData = [
    { type: "Story", count: 12, color: "#22c55e" },
    { type: "Bug", count: 8, color: "#ef4444" },
    { type: "Task", count: 15, color: "#3b82f6" },
    { type: "Epic", count: 3, color: "#8b5cf6" },
  ];

  // Issues data
  const issues = [
    {
      id: "AUTH-101",
      title: "User Login Implementation",
      type: "Story",
      status: "Done",
      assignee: "John Doe",
      storyPoints: 8,
      priority: "High",
    },
    {
      id: "AUTH-102",
      title: "Password Reset Functionality",
      type: "Story",
      status: "Done",
      assignee: "Jane Smith",
      storyPoints: 5,
      priority: "Medium",
    },
    {
      id: "AUTH-103",
      title: "Role-based Access Control",
      type: "Story",
      status: "Done",
      assignee: "Mike Johnson",
      storyPoints: 13,
      priority: "High",
    },
    {
      id: "AUTH-104",
      title: "Login Form Validation Bug",
      type: "Bug",
      status: "Done",
      assignee: "Sarah Wilson",
      storyPoints: 3,
      priority: "High",
    },
    {
      id: "AUTH-105",
      title: "User Registration Page",
      type: "Story",
      status: "Done",
      assignee: "John Doe",
      storyPoints: 8,
      priority: "Medium",
    },
    {
      id: "AUTH-106",
      title: "Session Management",
      type: "Task",
      status: "Done",
      assignee: "Jane Smith",
      storyPoints: 5,
      priority: "Medium",
    },
    {
      id: "AUTH-107",
      title: "Security Testing",
      type: "Task",
      status: "In Progress",
      assignee: "Mike Johnson",
      storyPoints: 8,
      priority: "High",
    },
    {
      id: "AUTH-108",
      title: "Documentation Update",
      type: "Task",
      status: "To Do",
      assignee: "Sarah Wilson",
      storyPoints: 2,
      priority: "Low",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "To Do":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Story":
        return "text-green-600 bg-green-50";
      case "Bug":
        return "text-red-600 bg-red-50";
      case "Task":
        return "text-blue-600 bg-blue-50";
      case "Epic":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const completedIssues = issues.filter(
    (issue) => issue.status === "Done",
  ).length;
  const totalStoryPoints = issues.reduce(
    (sum, issue) => sum + issue.storyPoints,
    0,
  );
  const completedStoryPoints = issues
    .filter((issue) => issue.status === "Done")
    .reduce((sum, issue) => sum + issue.storyPoints, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-sm">
          <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-100 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-sm font-bold text-white">
                      T
                    </div>
                    <span className="text-lg font-semibold text-slate-700">
                      TaskFlow
                    </span>
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-slate-900">
                    {sprintData.name}
                  </h1>
                  <p className="max-w-2xl text-slate-600">
                    {sprintData.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {sprintData.status.charAt(0).toUpperCase() +
                    sprintData.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Sprint Details */}
          <div className="p-8">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Start Date
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {new Date(sprintData.startDate).toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    End Date
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {new Date(sprintData.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Team Size
                  </span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {sprintData.team.length} members
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    Sprint Goal
                  </span>
                </div>
                <p className="text-sm font-semibold text-orange-900">
                  {sprintData.goal}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Issues Completed
                  </h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="mb-1 text-3xl font-bold text-slate-900">
                  {completedIssues}/{issues.length}
                </div>
                <div className="text-sm text-slate-600">
                  {Math.round((completedIssues / issues.length) * 100)}%
                  completion rate
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Story Points</h3>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="mb-1 text-3xl font-bold text-slate-900">
                  {completedStoryPoints}/{totalStoryPoints}
                </div>
                <div className="text-sm text-slate-600">
                  {Math.round((completedStoryPoints / totalStoryPoints) * 100)}%
                  points completed
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Team Members</h3>
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div className="space-y-2">
                  {sprintData.team.slice(0, 3).map((member, index) => (
                    <div key={index} className="text-sm text-slate-600">
                      {member}
                    </div>
                  ))}
                  {sprintData.team.length > 3 && (
                    <div className="text-sm text-slate-500">
                      +{sprintData.team.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Charts */}
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-sm">
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Sprint Statistics
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChart("progress")}
                  className={`rounded-xl px-4 py-2 font-medium transition-all ${
                    selectedChart === "progress"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Progress
                </button>
                <button
                  onClick={() => setSelectedChart("issues")}
                  className={`rounded-xl px-4 py-2 font-medium transition-all ${
                    selectedChart === "issues"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Issue Types
                </button>
              </div>
            </div>

            <div className="h-80">
              {selectedChart === "progress" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="remaining"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issueTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-sm">
          <div className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Sprint Issues
              </h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {issues.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-4 text-left font-semibold text-slate-700">
                      Issue
                    </th>
                    <th className="px-2 py-4 text-left font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="px-2 py-4 text-left font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-2 py-4 text-left font-semibold text-slate-700">
                      Assignee
                    </th>
                    <th className="px-2 py-4 text-left font-semibold text-slate-700">
                      Priority
                    </th>
                    <th className="px-2 py-4 text-right font-semibold text-slate-700">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-2 py-4">
                        <div>
                          <div className="font-medium text-slate-900">
                            {issue.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {issue.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(issue.type)}`}
                        >
                          {issue.type}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(issue.status)}
                          <span className="text-sm font-medium text-slate-700">
                            {issue.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-xs font-bold text-white">
                            {issue.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm text-slate-700">
                            {issue.assignee}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(issue.priority)}`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-right">
                        <span className="font-semibold text-slate-900">
                          {issue.storyPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
