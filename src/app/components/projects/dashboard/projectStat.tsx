import { IoStatsChartOutline } from "react-icons/io5";
const projectStats = {
  totalProjects: 24,
  activeProjects: 12,
  completedProjects: 8,
  upcomingDeadlines: 3,
};
export default function ProjectStat() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center text-lg font-medium">
        <IoStatsChartOutline className="mr-2 text-[#5CA987]" />
        Project Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-[#DBEFDF] p-4">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="mt-1 text-2xl font-semibold text-[#5CA987]">
            {projectStats.totalProjects}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="mt-1 text-2xl font-semibold text-blue-600">
            {projectStats.activeProjects}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {projectStats.completedProjects}
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">
            {projectStats.upcomingDeadlines}
          </p>
        </div>
      </div>
    </div>
  );
}
