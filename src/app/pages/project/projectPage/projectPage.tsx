import Button from "@libs/app/components/general-components/button";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ProjectStat from "@libs/app/components/projects/dashboard/projectStat";
import ProjectTable from "@libs/app/components/projects/dashboard/projectTable";
import ProjectDeadlines from "@libs/app/components/projects/dashboard/projectDeadlines";
import CreateProjectModal from "@libs/app/components/projects/modals/createProjectModal";
import HistorySection from "@libs/app/components/issues/historySection";

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [option, setOption] = useState(filterOptions[0]);

  return (
    <div className="mt-8 px-8 flex gap-8">
      {/* Main content area (70%) */}
      <div className="basis-[70%]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Button onClick={() => setShowCreateProjectModal(true)}>Create Project</Button>
        </div>

        <div className="flex mt-6 items-center gap-3">
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Search for project..."
              className="px-4 py-2 border border-gray-300 outline-[#1447e6] rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <DropdownAntd
            options={filterOptions}
            placement="bottom"
            onClickItem={(value) => setOption(value)}
            menuClassName={"min-w-[140px]"}
            rowClassName="text-base text-gray-700 py-[8px]"
            className={"!py-2 min-w-[120px]"}
            parent={option.label}
          />
        </div>

        <div className="mt-6">
          <ProjectTable />
        </div>
        {/* Recent Activity Card */}
        <div className="border-[1px] p-6 rounded-md border-gray-200 mt-5"
        >
          <p className="mb-6 text-xl font-semibold">Recent Activity</p>
        <HistorySection/>

        </div>
      </div>

      {/* Right sidebar (30%) */}
      <div className="basis-[30%]">
        {/* Project Stats Card */}
        <ProjectStat />

        {/* Deadlines Card */}
        <ProjectDeadlines />
      </div>
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => {
          setShowCreateProjectModal(false);
        }}
      />
    </div>
  );
}
