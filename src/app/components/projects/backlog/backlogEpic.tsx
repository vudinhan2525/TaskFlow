import React from "react";
import { IIssue } from "@libs/types/issue";
import { getIssuesByEpic, getIssuesEpic } from "@libs/utils/issue";
import { IoClose } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import CustomDatePicker from "../../general-components/customDatePicker";

const BacklogEpic = ({ issues }: { issues: IIssue[] }) => {
  const epicIssues = React.useMemo(() => getIssuesEpic(issues), [issues]);
  const issuesByEpic = React.useMemo(() => getIssuesByEpic(issues), [issues]);

  return (
    <div className="flex w-full flex-col gap-4 bg-[#f8f8f8] p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-900">Epic</h1>
        <button aria-label="Close Epic Filters">
          <IoClose className="text-gray-500" size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {epicIssues.map((epicIssue) => {
          return (
            <EpicIssueCard
              key={epicIssue.id}
              epicIssue={epicIssue}
              issuesByEpic={issuesByEpic}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(BacklogEpic);

const EpicIssueCard = ({
  epicIssue,
  issuesByEpic,
}: {
  epicIssue: IIssue;
  issuesByEpic: { [epicId: string]: IIssue[] };
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const epicIssues = issuesByEpic[epicIssue.id] || [];

  const getIssueCountByColumn = () => {
    const columnCounts: { [columnName: string]: number } = {};
    epicIssues.forEach((issue) => {
      const columnName = issue.column?.name || "No Column";
      columnCounts[columnName] = (columnCounts[columnName] || 0) + 1;
    });
    return columnCounts;
  };

  const columnCounts = getIssueCountByColumn();
  const totalIssues = epicIssues.length;

  return (
    <div
      className={`flex cursor-pointer flex-col rounded border px-4 py-3 hover:bg-gray-200 hover:shadow ${isExpanded ? "border-gray-600" : "border-transparent"}`}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-1">
          <FaChevronRight
            size={12}
            className={`mr-4 inline-block text-gray-500 hover:cursor-pointer ${
              isExpanded ? "rotate-90" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          />
          <div className="rounded-sm bg-purple-500 p-2"></div>
          <span className="text-center text-sm font-normal text-gray-800">
            {epicIssue.summary}
          </span>
        </div>
        <IoIosMore className="text-gray-500" size={24} />
      </div>

      {/* Hiển thị số lượng issue theo cột */}
      {totalIssues > 0 && (
        <div className="mt-2">
          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div className="flex h-full overflow-hidden rounded-full">
              {Object.entries(columnCounts).map(([columnName, count]) => {
                const percentage = (count / totalIssues) * 100;
                return (
                  <div
                    key={columnName}
                    className={`h-full ${
                      getColorByColumnName(columnName) || "bg-gray-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                    title={`${columnName}: ${count} issues (${percentage.toFixed(1)}%)`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col items-start justify-start space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Start date
            </label>
            <CustomDatePicker
              field="due_date_from"
              issue={epicIssue}
              projectId="<PROJECT_ID>"
            />
          </div>

          <div className="flex flex-col items-start justify-start space-y-2">
            <label className="text-sm font-medium text-gray-800">
              End date
            </label>
            <CustomDatePicker
              field="due_date_to"
              issue={epicIssue}
              projectId="<PROJECT_ID>"
            />
          </div>

          <button className="w-full py-1 text-center">View Detail</button>
        </div>
      )}
    </div>
  );
};

function getColorByColumnName(columnName: string) {
  if (columnName == "TODO") {
    return "bg-gray-400";
  }
  if (columnName == "IN PROGRESS") {
    return "bg-blue-500";
  }
  if (columnName == "DONE") {
    return "bg-green-500";
  }

  // return "bg-orange-400";
}
