import { memo } from "react";
import { useProjectIssues } from "@libs/hooks/useIssue";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import ColumnDropdown from "./columnDropdown";
import { IIssue } from "@libs/types/issue";

interface ParentDropdownProps {
  projectId: string;
  issue: IIssue;
  currentParentId?: string;
  currentIssueKey?: string;
  disabled?: boolean;
}

const ParentDropdown = ({
  projectId,
  issue,
  currentParentId,
}: ParentDropdownProps) => {
  const { issues: epicIssues } = useProjectIssues({
    project_id: projectId,
    types: ["epic"],
  });

  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const handleChangeIssueParent = (updatedParentId: string) => {
    updateIssueAsync({
      id: issue.id,
      data: {
        sprint_id: updatedParentId,
      },
    });
  };

  return (
    <ColumnDropdown
      items={epicIssues.map((issue: IIssue) => {
        return {
          value: issue.summary,
          key: issue.id,
          label: (
            <div className="rounded-sm border border-purple-100 bg-purple-200 px-1 py-0.5">
              <p className="truncate text-xs font-semibold text-purple-700">
                {issue.summary}
              </p>
            </div>
          ),
          onClick: () => {
            handleChangeIssueParent(issue.id);
          },
        };
      })}
      currentItem={currentParentId}
    >
      <div className="rounded-sm border border-purple-100 bg-purple-200 px-1 py-0.5">
        <p className="truncate text-xs font-semibold text-purple-700">
          {
            epicIssues.find((issue: IIssue) => issue.id === currentParentId)
              ?.summary
          }
        </p>
      </div>
    </ColumnDropdown>
  );
};

export default memo(ParentDropdown);
