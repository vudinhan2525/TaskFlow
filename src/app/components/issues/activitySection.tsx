import { useActivities } from "@libs/hooks/useIssue";
import { useState } from "react";

export default function ActivitySection(props: {
  issueId?: string;
  showOnlyActivity: boolean;
}) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const { activities } = useActivities({
    issue_id: props.issueId || "",
    page: 1,
    limit: 10,
  });

  if (!activities) return null;

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case "ISSUE_UPDATED":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        );
      case "COMMENT_ADDED":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-4.772 1.18a1 1 0 01-1.24-1.24l1.18-4.772A8 8 0 1121 12z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-4 w-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field.toLowerCase()) {
      case "status":
        return "🔄";
      case "assignee":
        return "👤";
      case "reporter":
        return "📝";
      case "priority":
        return "🔺";
      case "description":
        return "📄";
      case "labels":
        return "🏷️";
      case "component":
        return "🧩";
      default:
        return "✏️";
    }
  };

  const formatFieldLabel = (field: string) => {
    switch (field) {
      case "Description":
        return "updated the description";
      case "Status":
        return "changed status";
      case "Reporter":
        return "changed reporter";
      case "Assignee":
        return "changed assignee";
      case "Priority":
        return "changed priority";
      default:
        return `changed ${field.toLowerCase()}`;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="flex items-center space-x-2">
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {!props.showOnlyActivity && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["All", "Comments", "History", "Work log"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      )}

      {activeTab === "All" && (
        <div className="max-h-[600px] min-h-[400px] space-y-4 overflow-auto">
          {activities?.map((activity, activityIndex) => (
            <div
              key={activity.id}
              className={`relative flex space-x-3 ${
                activityIndex !== activities.length - 1 ? "pb-4" : ""
              }`}
            >
              {/* Timeline line */}
              {activityIndex !== activities.length - 1 && (
                <div className="absolute top-8 left-4 h-full w-0.5 bg-gray-200" />
              )}

              {/* Activity icon */}
              <div className="relative flex-shrink-0">
                {getActivityIcon(activity.action_type)}
              </div>

              {/* Activity content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  {/* User avatar */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700">
                    {getUserInitials(activity.user_name)}
                  </div>

                  {/* User name and action */}
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="font-medium text-gray-900">
                      {activity.user_name}
                    </span>
                    <span className="text-gray-500">
                      {activity.action_type === "ISSUE_UPDATED"
                        ? "made changes"
                        : "performed an action"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                  </div>
                </div>

                {/* Changes */}
                {activity.changes && activity.changes.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {activity.changes.map((change, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-base">
                            {getFieldIcon(change.field)}
                          </span>
                          <span className="font-medium text-gray-700">
                            {formatFieldLabel(change.field)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center space-x-2 text-sm">
                          {change.old_value && (
                            <>
                              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 line-through">
                                {change.old_value}
                              </span>
                              <svg
                                className="h-3 w-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </>
                          )}
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
                            {change.new_value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Comments" && (
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-4.772 1.18a1 1 0 01-1.24-1.24l1.18-4.772A8 8 0 1121 12z"
            />
          </svg>
          <p className="mt-2">No comments yet</p>
        </div>
      )}

      {activeTab === "History" && (
        <div className="space-y-4">
          {activities
            ?.filter((activity) => activity.action_type === "ISSUE_UPDATED")
            .map((activity, activityIndex, filteredActivities) => (
              <div
                key={activity.id}
                className={`relative flex space-x-3 ${
                  activityIndex !== filteredActivities.length - 1 ? "pb-4" : ""
                }`}
              >
                {activityIndex !== filteredActivities.length - 1 && (
                  <div className="absolute top-8 left-4 h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex-shrink-0">
                  {getActivityIcon(activity.action_type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700">
                      {getUserInitials(activity.user_name)}
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="font-medium text-gray-900">
                        {activity.user_name}
                      </span>
                      <span className="text-gray-500">made changes</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {formatRelativeTime(activity.created_at)}
                      </span>
                    </div>
                  </div>
                  {activity.changes && activity.changes.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {activity.changes.map((change, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-base">
                              {getFieldIcon(change.field)}
                            </span>
                            <span className="font-medium text-gray-700">
                              {formatFieldLabel(change.field)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-2 text-sm">
                            {change.old_value && (
                              <>
                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 line-through">
                                  {change.old_value}
                                </span>
                                <svg
                                  className="h-3 w-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </>
                            )}
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
                              {change.new_value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === "Work log" && (
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2">No work logged</p>
        </div>
      )}
    </div>
  );
}
