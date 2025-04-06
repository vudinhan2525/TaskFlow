import { FaRegClock } from "react-icons/fa";
import { RiArrowRightUpLine } from "react-icons/ri";

// Example recent activity data
const recentActivities = [
  {
    project: "E-commerce Platform",
    action: "Updated",
    user: "Sarah Chen",
    time: "2 hours ago",
    userColor: "#8ED1B0",
  },
  {
    project: "Mobile App Redesign",
    action: "Created",
    user: "Alex Johnson",
    time: "Yesterday",
    userColor: "#5CA987",
  },
  {
    project: "Dashboard Analytics",
    action: "Completed",
    user: "Miguel R.",
    time: "2 days ago",
    userColor: "#7CAEE0",
  },
];
export default function ProjectActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mt-6 w-[60%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FaRegClock className="mr-2 text-[#5CA987]" />
          Recent Activity
        </h2>
        <button className="text-sm text-[#5CA987] hover:text-[#3B8B69] flex items-center">
          View all <RiArrowRightUpLine className="ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: activity.userColor }}
                >
                  {activity.user
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  <span className="font-semibold">{activity.project}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">{activity.action}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  by {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
