import React, { useState } from "react";
import { Issue } from "@libs/types";
import Button from "@libs/app/components/general-components/button";
import CreateSprintModal from "../modals/createSprintModal";

const dummyIssues: Issue[] = [
  { id: "SCRUM-1", title: "Set up project structure", status: "To Do", assignee: "KP" },
  { id: "SCRUM-2", title: "Design database schema", status: "To Do", assignee: "KP" },
];

interface BacklogProps {
  projectId: string;
}

const Backlog: React.FC<BacklogProps> = ({ projectId }) => {
  console.log("projectId bl", projectId);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="bg-gray-100 p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "▼" : "▶"}
            </button>
            <h3 className="font-semibold">Backlog</h3>
            <span className="text-sm text-gray-500">{dummyIssues.length} issues</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="primary" className="text-sm" onClick={() => setIsCreateSprintModalOpen(true)}>
              Create Sprint
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border border-gray-200 rounded-b-lg divide-y">
          {dummyIssues.map((issue) => (
            <div key={issue.id} className="p-3 bg-white hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-gray-500">
                    {issue.id} • {issue.assignee}
                  </div>
                </div>
                <div className="text-sm">
                  <span
                    className={`px-2 py-1 rounded ${
                      issue.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : issue.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default Backlog;
