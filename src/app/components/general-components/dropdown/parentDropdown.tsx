import { memo, useEffect, useState } from "react";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import ColumnDropdown from "./columnDropdown";
import { IIssue } from "@libs/types/issue";
import { useIssue } from "@libs/hooks/apis/useIssue";
import { useParams } from "react-router-dom";
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
    types: ["Epic"],
    is_fetch: true,
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
          label: <ParentBadge title={issue.summary} />,
          onClick: () => {
            handleChangeIssueParent(issue.id);
          },
        };
      })}
      currentItem={currentParentId}
    >
      <ParentBadge
        title={
          epicIssues.find((issue: IIssue) => issue.id === currentParentId)
            ?.summary || ""
        }
      />
    </ColumnDropdown>
  );
};

export const ParentBadge = ({
  title,
  issueId,
}: {
  title?: string;
  issueId?: string;
}) => {
  const { projectId } = useParams();
  const [titleRender, setTitleRender] = useState(title);
  const { issue } = useIssue(projectId || "", issueId!);

  useEffect(() => {
    if (!title && issue) {
      setTitleRender(issue.summary);
    }
  }, [issue, title]);

  if (!title && (!issueId || issueId === "no-epic")) return null;

  return (
    <div className="rounded-sm border border-purple-300 bg-purple-200 px-1 py-0.5">
      <p className="truncate text-xs font-medium text-purple-700">
        {titleRender}
      </p>
    </div>
  );
};

export default memo(ParentDropdown);
