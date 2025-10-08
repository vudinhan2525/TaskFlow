import { FaRegCheckCircle } from "react-icons/fa";

export default function ProjectDeadlines() {
  return (
    <div className="mt-6 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-lg font-medium">
          <FaRegCheckCircle className="mr-2 text-[#5CA987]" />
          Upcoming Deadlines
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center rounded-lg bg-[#DBEFDF]/50 p-3">
          <div className="mr-3 h-10 w-2 rounded-full bg-[#5CA987]"></div>
          <div>
            <p className="font-medium text-gray-800">E-commerce Platform</p>
            <p className="text-xs text-gray-500">Due in 2 days</p>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-amber-50 p-3">
          <div className="mr-3 h-10 w-2 rounded-full bg-amber-500"></div>
          <div>
            <p className="font-medium text-gray-800">Mobile App Redesign</p>
            <p className="text-xs text-gray-500">Due in 5 days</p>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-blue-50 p-3">
          <div className="mr-3 h-10 w-2 rounded-full bg-blue-500"></div>
          <div>
            <p className="font-medium text-gray-800">Dashboard Analytics</p>
            <p className="text-xs text-gray-500">Due in 1 week</p>
          </div>
        </div>
      </div>

      <button className="mt-4 w-full rounded-md bg-[#DBEFDF] py-2 text-center text-sm text-[#5CA987] transition hover:bg-[#CBEAD1]">
        View All Deadlines
      </button>
    </div>
  );
}
