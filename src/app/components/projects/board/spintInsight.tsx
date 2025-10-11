import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X, AlertCircle, Calendar } from "lucide-react";

import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { useProjectSprints } from "@libs/hooks/apis/useSprint";
import { useParams } from "react-router-dom";
import { Select } from "antd";
import { ISprint } from "@libs/types/index";
import { motion } from "motion/react";
import SprintBurnDown from "./sprintBurnDown";

export default function SprintInsight({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("All");
  const currentDate = new Date();
  const { projectId } = useParams<{ projectId: string }>();
  const { sprints } = useProjectSprints(projectId || "");
  const [selectedSprint, setSelectedSprint] = useState<ISprint | null>(null);

  useEffect(() => {
    setSelectedSprint(sprints[0] ?? null);
  }, [sprints]);

  const { issues } = useProjectIssues({
    project_id: projectId || "",
    sprint_ids: selectedSprint?.id ? [selectedSprint.id] : [],
    is_fetch: selectedSprint?.id ? true : false,
  });

  const overdueIssues = useMemo(() => {
    if (issues.length === 0 || !selectedSprint) return [];
    return issues.filter((issue) => {
      if (!issue.due_date_to || issue.column.name === "DONE") return false;
      return new Date(issue.due_date_to) < currentDate;
    });
  }, [issues, selectedSprint]);

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
    const done = issues.filter((i) => i.column.name === "DONE").length;
    const inProgress = issues.filter(
      (i) => i.column.name === "IN PROGRESS",
    ).length;
    const todo = issues.filter((i) => i.column.name === "TO DO").length;

    return {
      total,
      done,
      inProgress,
      todo,
      percentDone: Math.round((done / total) * 100),
    };
  }, [issues, selectedSprint, sprints]);

  if (sprints.length === 0 || issues.length === 0 || !selectedSprint)
    return null;
  return (
    <div
      onClick={() => {
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/30"
    >
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.1 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex h-full w-[420px] flex-col overflow-auto bg-white shadow-lg"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 border-b border-gray-300 bg-white px-5 py-3">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Sprint insights
            </h2>
            <div className="flex items-center gap-1">
              <button
                title="Close Sprint Insight"
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            View your sprint health and progress towards your goals.
          </p>

          {/* Sprint Selector */}
          <div className="mt-3 flex items-center gap-2">
            <label className="block text-sm font-semibold text-gray-700">
              Sprint:
            </label>
            <Select
              value={selectedSprint?.id}
              onChange={(value) => {
                const sprint = sprints.find((s) => s.id === value);
                if (sprint) setSelectedSprint(sprint);
              }}
              style={{}} // giống Jira, dropdown vừa phải
              suffixIcon={
                <ChevronDown
                  style={{ fontSize: 12, color: "#888", paddingLeft: "16px" }}
                />
              }
              disabled={sprints.length === 0}
              dropdownStyle={{ borderRadius: 4 }}
              size="small"
            >
              {sprints.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
            {selectedSprint &&
              sprints.find((s) => s.id === selectedSprint.id) && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span className="text-gray-600">
                    {new Date(selectedSprint?.date_started).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                    {" - "}
                    {new Date(selectedSprint?.date_ended).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Work items for attention */}
          <div className="border-b border-gray-300 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-gray-700" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Work items for attention
                </h3>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-3 flex gap-3 border-b border-gray-300">
              {["All", "Due", "Stuck", "Blocked", "Flagged"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ marginBottom: "-1px" }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-3 text-sm text-gray-700">
              {overdueIssues.length} work items are overdue in the current
              sprint.
            </div>

            {overdueIssues.length === 0 ? (
              <div
                className="border border-gray-300 bg-gray-50 p-4 text-center"
                style={{ borderRadius: "3px" }}
              >
                <div className="mb-1 text-xl text-green-600">✓</div>
                <div className="text-sm font-medium text-gray-700">
                  No overdue work items
                </div>
                <div className="mt-0.5 text-sm text-gray-600">
                  All items are on track
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {overdueIssues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className="cursor-pointer border border-gray-300 bg-white p-2.5 hover:bg-gray-50"
                    style={{ borderRadius: "3px" }}
                  >
                    <div className="mb-1.5 flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        style={{ width: "14px", height: "14px" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span
                            className="inline-flex items-center border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-sm font-medium text-blue-700"
                            style={{ borderRadius: "2px" }}
                          >
                            IN PREVIEW
                          </span>
                        </div>
                        <div className="mb-1.5 text-sm text-gray-900">
                          {issue.summary}
                        </div>
                        {issue.due_date_to && (
                          <div
                            className="inline-flex items-center gap-1 border border-red-300 bg-red-50 px-1.5 py-0.5 text-sm text-red-700"
                            style={{ borderRadius: "2px" }}
                          >
                            <Calendar size={11} />
                            Due on{" "}
                            {new Date(issue.due_date_to).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {overdueIssues.length > 3 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Prev
                    </button>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sprint progress */}
          <div className="border-b border-gray-300 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Sprint progress
              </h3>
              <button className="text-gray-500 hover:text-gray-700">
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {progress.percentDone}% done
              </span>
            </div>

            <div
              className="mb-4 h-2 w-full bg-gray-200"
              style={{ borderRadius: "2px" }}
            >
              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${progress.percentDone}%`,
                  borderRadius: "2px",
                }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="font-semibold text-gray-900">Done</span>
                <div className="text-gray-700">{progress.done}%</div>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-900">In progress</span>
                <div className="text-gray-700">
                  {Math.round((progress.inProgress / progress.total) * 100)}%
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">Not started</span>
                <div className="text-gray-700">
                  {Math.round((progress.todo / progress.total) * 100)}%
                </div>
              </div>
            </div>
          </div>

          <SprintBurnDown
            issues={issues}
            selectedSprint={selectedSprint}
            sprints={sprints}
          />
        </div>
      </motion.div>
    </div>
  );
}
