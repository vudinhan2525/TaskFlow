import { IoStatsChartOutline } from "react-icons/io5";
const projectStats = {
  totalProjects: 24,
  activeProjects: 12,
  completedProjects: 8,
  upcomingDeadlines: 3,
};
export default function ProjectStat() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <IoStatsChartOutline className="mr-2 text-[#5CA987]" />
        Project Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#DBEFDF] rounded-lg p-4">
          <p className="text-gray-600 text-sm">Total Projects</p>
          <p className="text-2xl font-semibold text-[#5CA987] mt-1">{projectStats.totalProjects}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{projectStats.activeProjects}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{projectStats.completedProjects}</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Upcoming</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{projectStats.upcomingDeadlines}</p>
        </div>
      </div>
    </div>
  );
}
