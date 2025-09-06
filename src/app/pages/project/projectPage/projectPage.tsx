import Button from "@libs/app/components/general-components/button";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ProjectStat from "@libs/app/components/projects/dashboard/projectStat";
import ProjectTable from "@libs/app/components/projects/dashboard/projectTable";
import ProjectDeadlines from "@libs/app/components/projects/dashboard/projectDeadlines";
import CreateProjectModal from "@libs/app/components/projects/modals/createProjectModal";
import { Helmet} from "react-helmet-async";

const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [option, setOption] = useState(filterOptions[0]);

  return (
    <div className="mt-8 flex gap-8 px-8">
      <Helmet>
        <title>Projects - Task Flow</title>
      </Helmet>
      {/* Main content area (70%) */}
      <div className="basis-[70%]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Button onClick={() => setShowCreateProjectModal(true)}>
            Create Project
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Search for project..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-[#1447e6]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
          </div>
          <DropdownAntd
            options={filterOptions}
            placement="bottom"
            onClickItem={(value) => setOption(value)}
            menuClassName={"min-w-[140px]"}
            rowClassName="text-base text-gray-700 py-[8px]"
            className={"min-w-[120px] !py-2"}
            parent={option.label}
          />
        </div>

        <div className="mt-6">
          <ProjectTable />
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
