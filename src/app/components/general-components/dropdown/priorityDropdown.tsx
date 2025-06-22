import ColumnDropdown from "./columnDropdown";
import { IssuePriority } from "@libs/types/issue";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import {
  FcHighPriority,
  FcMediumPriority,
  FcLowPriority,
} from "react-icons/fc";

const priorityOptions = [
  { name: "High", icon: <FcHighPriority size={20} /> },
  { name: "Medium", icon: <FcMediumPriority size={20} /> },
  { name: "Low", icon: <FcLowPriority size={20} /> },
];
const PriorityDropdown = ({
  projectId,
  issueId,
  priority
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

  return (
    <ColumnDropdown
      items={priorityOptions.map((option) => {
        return {
          value: option.name,
          key: option.name,
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
            >
              {option.icon}
              <p className="text-sm font-medium text-gray-800">{option.name}</p>
            </div>
          ),
          onClick: () => {
            handleChangePriority(option.name as IssuePriority);
          },
        };
      })}
      currentItem={undefined}
      children={
        <div className="flex items-center justify-start gap-2 rounded-md p-2 hover:cursor-pointer">
          {priorityOptions.find((option) => option.name === priority)?.icon}
        </div>
      }
    />
  );
};

export default PriorityDropdown;
