import React, { useState } from "react";
import { Issue } from "@libs/types";
import Button from "@libs/app/components/general-components/button";
import CreateIssueModalFromSprint from "@libs/app/components/projects/modals/createIssueModalFromSprint";

interface ScrumSprintProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  issues: Issue[];
  issueCount: number;
  projectId: string;
  sprintId: string;
}

const ScrumSprint: React.FC<ScrumSprintProps> = ({
  sprintName,
  startDate,
  endDate,
  issues,
  issueCount,
  projectId,
  sprintId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button className="text-gray-500">▼</button>
              <h3 className="font-semibold">{sprintName}</h3>
              <span className="text-sm text-gray-500">
                {startDate} - {endDate}
              </span>
              <span className="text-sm text-gray-500">{issueCount} issues</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                className="text-sm bg-green-600 text-white hover:bg-green-700"
                onClick={() => setIsModalOpen(true)}
              >
                Create Issue
              </Button>
              <Button variant="secondary" className="text-sm">
                Complete Sprint
              </Button>
              <Button variant="secondary" className="text-sm">
                Edit Sprint
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
            <div>To Do: {issues.filter((issue) => issue.status === "To Do").length}</div>
            <div>In Progress: {issues.filter((issue) => issue.status === "In Progress").length}</div>
            <div>Done: {issues.filter((issue) => issue.status === "Done").length}</div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-b-lg divide-y">
          {issues.map((issue) => (
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
      </div>

      {/* Create Issue Modal */}
      {isModalOpen && (
        <CreateIssueModalFromSprint
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            console.log("Creating issue in sprint:", data);
            setIsModalOpen(false);
          }}
          projectId={projectId}
          sprintId={sprintId}
        />
      )}
    </>
  );
};

export default ScrumSprint;
