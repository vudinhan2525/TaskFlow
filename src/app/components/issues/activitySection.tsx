import { useActivities } from "@libs/hooks/useIssue";
import { useState } from "react";

export default function ActivitySection(props: { issueId: string }) {
  const [activeTab, setActiveTab] = useState<string>("Comments");

  const { activities } = useActivities({
    issue_id: props.issueId,
    page: 1,
    limit: 10,
  });
  if (!activities) return;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-md text-left font-bold text-gray-800">Activity</h2>
        <button className="text-gray-500 hover:text-gray-700">⤓</button>
      </div>
      <div className="mb-4 flex space-x-2 border-b border-gray-200">
        {["All", "Comments", "History", "Work log"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "All" && (
        <ul className="space-y-4">
          {activities?.map((activity) => (
            <li
              key={activity.id}
              className="border-b pb-2 text-sm text-gray-700"
            >
              <p className="font-medium text-gray-800">
                {activity.action_type === "ISSUE_UPDATED" && "Updated Issue"}
              </p>
              <ul className="mt-1 ml-4 space-y-1">
                {activity.changes.map((change, index) => {
                  let fieldLabel = change.field;
                  switch (change.field) {
                    case "Description":
                      fieldLabel = "Description changed";
                      break;
                    case "Status":
                      fieldLabel = "Status changed";
                      break;
                    case "Reporter":
                      fieldLabel = "Reporter changed";
                      break;
                    default:
                      fieldLabel = `${change.field} changed`;
                      break;
                  }

                  return (
                    <li key={index}>
                      <span className="text-gray-600">
                        {fieldLabel}:&nbsp;
                        <span className="text-red-500 line-through">
                          {change.old_value}
                        </span>{" "}
                        →{" "}
                        <span className="text-green-600">
                          {change.new_value}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
