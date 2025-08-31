import CommentSection from "@libs/app/components/issues/commentSection";
import HistorySection from "@libs/app/components/issues/historySection";
import { RootState } from "@libs/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ActivityIssue(props: { issueId: string }) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const { user } = useSelector((state: RootState) => state.auth);
  const { projectId } = useParams<{ projectId: string }>();

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

      {activeTab === "All" && projectId && (
        <>
          <HistorySection issueId={props.issueId} projectId={projectId} />
        </>
      )}
      {activeTab === "Comments" && (
        <div className="">
          {user && (
            <CommentSection
              issueId={props.issueId}
              currentUserId={user.id}
              currentUserName={user.first_name + " " + user.last_name}
            />
          )}
        </div>
      )}
      {activeTab === "History" && projectId && (
        <HistorySection issueId={props.issueId} projectId={projectId} />
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
