import React, { useMemo } from "react";
import { TrendingDown, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ISprint } from "@libs/types/sprint";
import { IIssue } from "@libs/types/issue";

const SprintBurnDown = ({
  issues,
  selectedSprint,
  sprints,
}: {
  issues: IIssue[];
  selectedSprint: ISprint;
  sprints: ISprint[];
}) => {
  const progress = useMemo(() => {
    if (issues.length === 0)
      return {
        total: 0,
        done: 0,
        inProgress: 0,
        todo: 0,
        percentDone: 0,
      };
    const total = issues.length;
    const done = issues.filter((i) => !!i.completed_at).length;
    const inProgress = issues.filter(
      (i) => !i.completed_at && i.column?.name === "IN PROGRESS",
    ).length;
    const todo = issues.filter(
      (i) => !i.completed_at && i.column?.name === "TO DO",
    ).length;

    return {
      total,
      done,
      inProgress,
      todo,
      percentDone: Math.round((done / total) * 100),
    };
  }, [issues, selectedSprint, sprints]);

  const burndownData = useMemo(() => {
    if (!selectedSprint) return [];

    const start = new Date(selectedSprint.date_started);
    const end = new Date(selectedSprint.date_ended);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const totalPoints = issues.reduce(
      (sum, i) => sum + (i.story_point || 0),
      0,
    );

    const data: { day: string; remaining: number; guideline: number }[] = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      // Remaining work = tổng story_point các issue chưa hoàn thành tính đến ngày d
      const remaining = issues.reduce((sum, issue) => {
        if (!issue.story_point) return sum;
        if (!issue.completed_at) return sum + issue.story_point;

        const completed = new Date(issue.completed_at);
        // completed_at trong ngày => vẫn còn tính
        if (completed > d) return sum + issue.story_point;

        return sum;
      }, 0);

      // guideline: đường thẳng giảm đều
      const guideline = days - i - 1;

      data.push({
        day: `${d.getMonth() + 1}/${d.getDate()}`,
        remaining,
        guideline: Math.max(guideline, 0),
      });
    }

    return data;
  }, [selectedSprint, issues]);

  return (
    <div className="border-b border-gray-300 px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown size={14} className="text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">
            Sprint burndown
          </h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="mb-3 text-sm text-gray-700">
        {progress.done} points done, {progress.total - progress.done} points to
        go
      </div>

      <div
        className="border border-gray-300 bg-white p-3"
        style={{ borderRadius: "3px" }}
      >
        <div className="h-48 w-full">
          <ResponsiveContainer>
            <LineChart
              data={burndownData}
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                stroke="#d1d5db"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                stroke="#d1d5db"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "3px",
                  fontSize: "14px",
                  padding: "6px 8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="#2563eb"
                dot={false}
                activeDot={false}
                name="Remaining work"
                strokeWidth={3}
              />
              <Line
                type="linear"
                dataKey="guideline"
                stroke="#9ca3af"
                strokeWidth={3}
                dot={false}
                activeDot={false}
                name="Guideline"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SprintBurnDown;
