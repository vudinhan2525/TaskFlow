import React, { useState } from "react";
import { Activity, CheckCircle, TrendingUp, Users } from "lucide-react";
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

interface Issue {
  id: string;
  title: string;
  type: "Story" | "Bug" | "Task" | "Epic";
  status: "Done" | "In Progress" | "To Do";
  assignee: string;
  storyPoints: number;
  priority: "High" | "Medium" | "Low";
}

interface ProgressData {
  day: string;
  planned: number;
  completed: number;
  remaining: number;
}

interface IssueTypeData {
  type: string;
  count: number;
  color: string;
}

interface SprintStatisticProps {
  issues: Issue[];
  team: string[];
}

export default function SprintStatistic({
  issues,
  team,
}: SprintStatisticProps) {
  const [selectedChart, setSelectedChart] = useState("progress");

  // Statistics data for charts
  const progressData: ProgressData[] = [
    { day: "Day 1", planned: 45, completed: 0, remaining: 45 },
    { day: "Day 3", planned: 45, completed: 8, remaining: 37 },
    { day: "Day 5", planned: 45, completed: 18, remaining: 27 },
    { day: "Day 7", planned: 45, completed: 25, remaining: 20 },
    { day: "Day 9", planned: 45, completed: 32, remaining: 13 },
    { day: "Day 11", planned: 45, completed: 38, remaining: 7 },
    { day: "Day 13", planned: 45, completed: 42, remaining: 3 },
    { day: "Day 15", planned: 45, completed: 45, remaining: 0 },
  ];

  const issueTypeData: IssueTypeData[] = [
    { type: "Story", count: 12, color: "#22c55e" },
    { type: "Bug", count: 8, color: "#ef4444" },
    { type: "Task", count: 15, color: "#3b82f6" },
    { type: "Epic", count: 3, color: "#8b5cf6" },
  ];

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
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Issues Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="mb-1 text-3xl font-bold text-slate-900">
            {completedIssues}/{issues.length}
          </div>
          <div className="text-sm text-slate-600">
            {Math.round((completedIssues / issues.length) * 100)}% completion
            rate
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
            {team.slice(0, 3).map((member, index) => (
              <div key={index} className="text-sm text-slate-600">
                {member}
              </div>
            ))}
            {team.length > 3 && (
              <div className="text-sm text-slate-500">
                +{team.length - 3} more
              </div>
            )}
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
    </div>
  );
}
