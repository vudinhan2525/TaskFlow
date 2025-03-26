import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sprint } from "../../../types";
import { useProject } from "../../../hooks/useProject";
import { useIssues } from "../../../hooks/useIssue";

const Backlog = () => {
  const { projectKey } = useParams<{ projectKey: string }>();
  const { project, isLoading: projectLoading } = useProject(projectKey || "");
  const { issues: backlogIssues, isLoading: issuesLoading } = useIssues(project?.id || "");
  const [currentSprint] = useState<Sprint | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  if (projectLoading || issuesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex-1 h-screen overflow-hidden">
      {/* Backlog Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold">Backlog</h1>
          <div className="text-sm text-gray-500 mt-1">Plan and prioritize your team's work</div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Board</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create issue</button>
        </div>
      </div>

      {/* Sprint Section */}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {currentSprint && (
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <div className="flex items-center">
                <span className="material-icons text-gray-500 mr-2">bolt</span>
                <div>
                  <h3 className="font-medium">{currentSprint.name}</h3>
                  <div className="text-sm text-gray-500">
                    {currentSprint.startDate?.toLocaleDateString()} - {currentSprint.endDate?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">Start Sprint</button>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-4">No issues in sprint</div>
            </div>
          </div>
        )}

        {/* Backlog Issues */}
        <div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <h3 className="font-medium">Backlog</h3>
              <span className="ml-2 text-sm text-gray-500">{backlogIssues?.length || 0} issues</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                <span className="material-icons">filter_list</span>
              </button>
            </div>
          </div>

          {/* Issue List */}
          <div className="divide-y divide-gray-200">
            {!backlogIssues?.length ? (
              <div className="p-8 text-center">
                <div className="text-gray-500">No issues found</div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create issue
                </button>
              </div>
            ) : (
              backlogIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedIssues.includes(issue.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    const newSelected = selectedIssues.includes(issue.id)
                      ? selectedIssues.filter((id) => id !== issue.id)
                      : [...selectedIssues, issue.id];
                    setSelectedIssues(newSelected);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue.id)}
                    onChange={() => {}}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 mr-2">
                        {issue.type === "bug" ? "bug_report" : "check_box"}
                      </span>
                      <span className="text-sm font-medium">{issue.title}</span>
                      <span className="ml-2 text-xs text-gray-500">{issue.key}</span>
                    </div>
                    {issue.description && <div className="mt-1 text-sm text-gray-500">{issue.description}</div>}
                  </div>
                  <div className="flex items-center space-x-4">
                    {issue.assignee && (
                      <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-6 h-6 rounded-full" />
                    )}
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        issue.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backlog;
