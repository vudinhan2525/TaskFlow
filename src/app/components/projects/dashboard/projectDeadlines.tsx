import { FaRegCheckCircle } from "react-icons/fa";

export default function ProjectDeadlines() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FaRegCheckCircle className="mr-2 text-[#5CA987]" />
          Upcoming Deadlines
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center p-3 bg-[#DBEFDF]/50 rounded-lg">
          <div className="w-2 h-10 bg-[#5CA987] rounded-full mr-3"></div>
          <div>
            <p className="font-medium text-gray-800">E-commerce Platform</p>
            <p className="text-xs text-gray-500">Due in 2 days</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-amber-50 rounded-lg">
          <div className="w-2 h-10 bg-amber-500 rounded-full mr-3"></div>
          <div>
            <p className="font-medium text-gray-800">Mobile App Redesign</p>
            <p className="text-xs text-gray-500">Due in 5 days</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <div className="w-2 h-10 bg-blue-500 rounded-full mr-3"></div>
          <div>
            <p className="font-medium text-gray-800">Dashboard Analytics</p>
            <p className="text-xs text-gray-500">Due in 1 week</p>
          </div>
        </div>
      </div>

      <button className="w-full mt-4 py-2 text-sm text-center text-[#5CA987] bg-[#DBEFDF] hover:bg-[#CBEAD1] transition rounded-md">
        View All Deadlines
      </button>
    </div>
  );
}
