import { IIssue } from "@libs/types/issue";
import {
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaRegHandPaper,
} from "react-icons/fa";
import RenderStatusCell from "../list/common/RenderStatusCell";
import ColumnDropdown from "../list/listTable/ColumnDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useState, useRef, useEffect } from "react";
import { typeOptions, priorityOptions } from "../../../../constants/list";
import UserAvatar from "../../general-components/user/UserAvatar";
import { FaEdit } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateIssue } from "@libs/hooks/useIssue";

const IssueCard = ({
  issue,
  isChild = false,
  selectedIssues,
  onIssueSelect,
  projectId,
  issueMap,
}: {
  issue: IIssue;
  isChild?: boolean;
  selectedIssues: { [key: string]: boolean };
  onIssueSelect: (issueId: string, selected: boolean, issue?: IIssue) => void;
  projectId: string;
  issueMap: { [key: string]: IIssue[] };
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: issue.id,
      data: {
        type: "Issue",
        issue,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [expandedIssues, setExpandedIssues] = useState<{
    [key: string]: boolean;
  }>({});
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const { columns } = useProjectColumns(projectId);
  const [issueDescription, setIssueDescription] = useState(issue?.description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [descriptionInputRef, isEditingDescription]);

  const getPriorityIcon = (priority: string) => {
    const issuePriority = priorityOptions.find(
      (option) => option.name === priority,
    );
    return issuePriority?.icon;
  };
  const getIssueTypeIcon = (type: string) => {
    const issueType = typeOptions.find((option) => option.name === type);
    return issueType?.icon;
  };

  const toggleIssueExpansion = (issueId: string) => {
    setExpandedIssues((prev) => ({ ...prev, [issueId]: !prev[issueId] }));
  };

  const handleClickEditDescription = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsEditingDescription(true);
    descriptionInputRef.current?.focus();
  };

  const handleChangeIssueValue = (field: string, value: string) => {
    updateIssueAsync({
      id: issue.id,
      data: {
        [field]: value,
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // {...attributes}
      // {...listeners}
      onClick={() =>
        onIssueSelect(issue?.id, !selectedIssues[issue?.id], issue)
      }
      className={`border-y-1 border-gray-200 bg-white px-2 shadow-sm transition-all duration-200 hover:bg-gray-100 ${
        isChild ? "ml-6 border-l-2 border-gray-200" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-9/12 items-center justify-start space-x-2">
          <input
            type="checkbox"
            checked={selectedIssues[issue?.id] || false}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onIssueSelect(issue?.id, e.target.checked, issue)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          {!isChild && issueMap[issue?.id]?.length > 0 && (
            <button
              className="min-w-[20px] text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                toggleIssueExpansion(issue?.id);
              }}
            >
              {expandedIssues[issue?.id] ? (
                <FaChevronDown size={14} />
              ) : (
                <FaChevronRight size={14} />
              )}
            </button>
          )}
        

          <div className="flex w-full cursor-pointer flex-row items-center gap-2">
            <div className={`block text-sm font-light text-gray-500`}>
              {issue?.title}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="group flex flex-1 items-center gap-2"
            >
              {isEditingDescription ? (
                <input
                  type="text"
                  ref={descriptionInputRef}
                  value={issueDescription}
                  onBlur={() => {
                    handleChangeIssueValue("description", issueDescription);
                    setIsEditingDescription(false);
                  }}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className={`text-underline w-full rounded-sm border-2 border-emerald-500 px-2 py-1 outline-none`}
                />
              ) : (
                <span className="group-hover:underline">
                  {issueDescription}
                </span>
              )}

              {!isEditingDescription && (
                <div
                  onClick={handleClickEditDescription}
                  className="hidden group-hover:block"
                >
                  <FaEdit size={16} />
                </div>
              )}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`${isEditingDescription ? "block" : "hidden"} group-hover:block`}
            >
              <div className="flex items-center gap-2 rounded-md border-1 border-gray-300 bg-gray-200 px-3">
                <FaPlus className="text-gray-500" size={12} />
                <span className="text-gray-500">Epic</span>
              </div>
            </div>

            <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="flex cursor-grab flex-col items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <FaRegHandPaper />
            <span className="text-sm">Drag here</span>
          </div>
          </div>
        </div>

        <div
          className="flex w-3/12 items-center justify-between px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* status dropdown */}
          <ColumnDropdown
            items={columns.map((column) => ({
              value: column.name,
              style: {
                padding: 0,
                background: "white",
              },
              label: (
                <div
                  key={column.id}
                  className={`flex items-center p-2 hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
                >
                  <RenderStatusCell column={column} />
                </div>
              ),
              key: column.id,
              onClick: () => handleChangeIssueValue("column_id", column.id),
            }))}
            children={
              <div className="flex justify-start px-2">
                <RenderStatusCell column={issue?.column} />
              </div>
            }
            currentItem={issue?.column?.name}
          />

          <div className="flex flex-row items-center space-x-2">
            {/* type dropdown */}
            <ColumnDropdown
              items={typeOptions.map((option) => ({
                value: option.name,
                style: {
                  padding: 0,
                  background: "white",
                },
                label: (
                  <div className="flex items-center space-x-2 p-2 pr-4 hover:cursor-pointer hover:bg-gray-300">
                    {getIssueTypeIcon(option.name)}
                    <span className="text-sm font-light">{option.name}</span>
                  </div>
                ),
                key: option.name,
                onClick: () => handleChangeIssueValue("type", option.name),
              }))}
              currentItem={issue?.type}
              children={
                <div className="flex items-center rounded-md p-2 hover:cursor-pointer hover:bg-gray-300">
                  {getIssueTypeIcon(issue?.type)}
                </div>
              }
            />

            {/* priority dropdown */}
            <ColumnDropdown
              items={priorityOptions.map((option) => ({
                value: option.name,
                style: {
                  padding: 0,
                  background: "white",
                },
                label: (
                  <div className="flex items-center space-x-2 p-1 hover:cursor-pointer hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300">
                    {getPriorityIcon(option.name)}
                    <span className=" ">{option.name}</span>
                  </div>
                ),
                key: option.name,
                onClick: () => handleChangeIssueValue("priority", option.name),
              }))}
              currentItem={issue?.priority}
              children={
                <div className="flex items-center rounded-md p-2 hover:cursor-pointer hover:bg-gray-300">
                  {getPriorityIcon(issue?.priority)}
                </div>
              }
            />

            <div>{issue.story_point}</div>

            <UserAvatar
              userId={issue?.assignee_id}
              size={24}
              isDisplayName={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
