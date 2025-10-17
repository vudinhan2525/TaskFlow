import { memo, useEffect, useState, useMemo } from "react";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import ColumnDropdown from "./columnDropdown";
import { IIssue } from "@libs/types/issue";
import { useIssue } from "@libs/hooks/apis/useIssue";
import { useParams } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
interface ParentDropdownProps {
  projectId: string;
  issue: IIssue;
  currentParentId?: string;
  isShowIcon?: boolean;
  isShowNoParent?: boolean;
}

const ParentDropdown = ({
  projectId,
  issue,
  currentParentId,
  isShowIcon,
  isShowNoParent = true,
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
        parent_id: updatedParentId,
      },
    });
  };
  const currentParent = useMemo(() => {
    return epicIssues.find((iss: IIssue) => iss.id === currentParentId);
  }, [epicIssues, currentParentId]);

  return (
    <ColumnDropdown
      items={epicIssues
        .map((issue: IIssue) => {
          return {
            value: issue.summary,
            key: issue.id,
            label: <ParentBadge title={issue.summary} isShowIcon={true} />,
            onClick: () => {
              handleChangeIssueParent(issue.id);
            },
          };
        })
        .concat({
          value: "No Parent",
          key: "NULL",
          label: (
            <div
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200`}
            >
              <p className="truncate text-sm font-medium">No Parent</p>
            </div>
          ),
          onClick: () => {
            handleChangeIssueParent("NULL");
          },
        })}
      currentItem={currentParent?.summary}
    >
      <ParentBadge
        issueId={issue?.parent_id || currentParentId}
        title={currentParent?.summary}
        isShowIcon={isShowIcon}
        isShowNoParent={isShowNoParent}
      />
    </ColumnDropdown>
  );
};

export const ParentBadge = ({
  title,
  issueId,
  isShowIcon,
  isShowNoParent,
}: {
  title?: string;
  issueId?: string;
  isShowIcon?: boolean;
  isShowNoParent?: boolean;
}) => {
  const { projectId } = useParams();
  const { issue } = useIssue(projectId || "", issueId!);
  const [titleRender, setTitleRender] = useState(title);

  useEffect(() => {
    if (!title) {
      setTitleRender(issue?.summary);
    }
  }, [issue]);

  if (!titleRender) {
    if (isShowNoParent) {
      return (
        <div className="flex items-center gap-1">
          {isShowIcon && <AiOutlineThunderbolt className="text-purple-700" />}
          <div className="rounded-sm border border-gray-300 bg-gray-100 px-1 py-0.5">
            <p className="truncate text-xs font-medium text-gray-600">
              No Parent
            </p>
          </div>
        </div>
      );
    }
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      {isShowIcon && <AiOutlineThunderbolt className="text-purple-700" />}
      <div className="rounded-sm border border-purple-300 bg-purple-200 px-1 py-0.5">
        <p className="truncate text-xs font-medium text-purple-700">
          {titleRender}
        </p>
      </div>
    </div>
  );
};

export default memo(ParentDropdown);
