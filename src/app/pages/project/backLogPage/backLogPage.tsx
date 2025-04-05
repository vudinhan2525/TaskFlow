import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumPrint";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { Issue } from "@libs/types";
import Backlog from "@libs/app/components/projects/backlog/backlog";

const BacklogPage: React.FC = () => {
  const selectedIssueId = useSelector((state: RootState) => state.ui.selectedIssueId);
  const sprint1Issues: Issue[] = [
    { id: "SCRUM-4", title: "Build landing page", status: "Done", assignee: "KP" },
    { id: "SCRUM-3", title: "dasda", status: "To Do", assignee: "KP" },
  ];

  return (
    <div className="flex">
      <div
        className={`flex-1 p-4 bg-white min-h-screen transition-all duration-300 ${
          selectedIssueId ? "w-3/4" : "w-full"
        }`}
      >
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search backlog"
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <Button
              variant="secondary"
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
            >
              Version
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
            >
              Epic
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              📊
            </Button>
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              ⚙️
            </Button>
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              ...
            </Button>
          </div>
        </div>

        {/* Scrum Sprints */}
        <ScrumSprint
          sprintName="SCRUM SPRINT 1"
          startDate="22 Mar"
          endDate="19 Apr"
          issues={sprint1Issues}
          issueCount={2}
        />
        <ScrumSprint sprintName="SCRUM SPRINT 2" startDate="19 Apr" endDate="17 May" issues={[]} issueCount={0} />

        {/* Backlog */}
        <Backlog />
      </div>
      <IssueSideBar />
    </div>
  );
};

export default BacklogPage;
