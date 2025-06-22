import ColumnDropdown from "./columnDropdown";

import { useUpdateIssue } from "@libs/hooks/useIssue";
import { LuBookmark, LuBug, LuClipboardCheck, LuStar } from "react-icons/lu";
import { IssueType } from "@libs/types/issue";

const typeOptions = [
  {
    id: "Bug",
    name: "Bug",
    icon: <LuBug className="h-4 w-4 text-red-500" />,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    id: "Task",
    name: "Task",
    icon: <LuClipboardCheck className="h-4 w-4 text-blue-500" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    id: "Story",
    name: "Story",
    icon: <LuBookmark className="h-4 w-4 text-green-500" />,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    id: "Epic",
    name: "Epic",
    icon: <LuStar className="h-4 w-4 text-purple-500" />,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];
const TypeDropdown = ({
  projectId,
  issueId,
  type,
}: {
  projectId: string;
  issueId: string;
  type: IssueType;
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const handleChangeType = (updatedType: IssueType) => {
    updateIssueAsync({
      id: issueId,
      data: {
        type: updatedType,
      },
    });
  };
  return (
    <ColumnDropdown
      items={typeOptions.map((option) => ({
        value: option.name,
        style: {
          padding: 0,
          background: "white",
        },
        label: (
          <div
            key={option.id}
            className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-200 ${
              option.name === type &&
              "border-l-2 border-emerald-500 bg-gray-300"
            }`}
          >
            <div
              className={`flex min-w-[100px] items-center justify-center gap-1 rounded-md py-1 ${option.bgColor}`}
            >
              {option.icon}
              <p className={`text-[13px] font-bold ${option.textColor}`}>
                {option.name}
              </p>
            </div>
          </div>
        ),
        key: option.id,
        onClick: () => handleChangeType(option.name as IssueType),
      }))}
      children={
        <div className="flex min-h-[50px] items-center justify-center px-[12px]">
          <div
            className={`flex h-fit min-w-[100px] items-center justify-center gap-1 rounded-md py-1 ${
              typeOptions.find((option) => option.name === type)?.bgColor
            }`}
          >
            {typeOptions.find((option) => option.name === type)?.icon}
            <p
              className={`text-[13px] font-bold ${
                typeOptions.find((option) => option.name === type)?.textColor
              }`}
            >
              {type ? type : "-"}
            </p>
          </div>
        </div>
      }
      currentItem={type}
    />
  );
};

export default TypeDropdown;
