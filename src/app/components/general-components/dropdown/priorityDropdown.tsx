import ColumnDropdown from "./columnDropdown";
import { IssuePriority } from "@libs/types/issue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import PriorityBadge, { priorityOptions } from "../badge/priorityBadge";
import { memo } from "react";

const PriorityDropdown = ({
  projectId,
  issueId,
  priority,
}: {
  projectId: string;
  issueId: string;
  priority: IssuePriority;
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangePriority = (updatedPriority: IssuePriority) => {
    updateIssueAsync({
      id: issueId,
      data: {
        priority: updatedPriority,
      },
    });
  };

  const currentPriority = priorityOptions.find(
    (option) => option.name === priority,
  );

  return (
    <ColumnDropdown
      items={priorityOptions.map((option) => {
        return {
          value: option.name,
          key: option.name,
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: (
            <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
              <PriorityBadge
                priority={option.name as IssuePriority}
                isShowLabel={true}
                className="hover:bg-transparent!"
              />
            </div>
          ),
          onClick: () => {
            handleChangePriority(option.name as IssuePriority);
          },
        };
      })}
      currentItem={undefined}
      children={
        <PriorityBadge priority={currentPriority?.name as IssuePriority} />
      }
    />
  );
};

export default memo(PriorityDropdown);
