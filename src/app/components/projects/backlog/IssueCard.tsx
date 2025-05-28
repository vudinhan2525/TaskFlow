import { IIssue } from "@libs/types/issue";
import { FaCheck, FaPlus } from "react-icons/fa";
import RenderStatusCell from "../list/common/RenderStatusCell";
import ColumnDropdown from "../list/listTable/ColumnDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useState, useRef, useEffect, memo } from "react";
import { typeOptions, priorityOptions } from "../../../../constants/list";
import UserAvatar from "../../general-components/user/UserAvatar";
import { FaEdit } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { BsThreeDots } from "react-icons/bs";

const IssueCard = memo(
  ({
    issue,
    projectId,
    setIsSprintIssuesChecked,
  }: {
    issue: IIssue;
    projectId: string;
    setIsSprintIssuesChecked: (isSprintIssuesChecked: boolean) => void;
  }) => {
    const navigate = useNavigate();
    const { selectedIssues, setSelectedIssue, setSelectIssues } =
      useIssueSelection();
    const [searchParams] = useSearchParams();
    const selectedIssueParams = searchParams.get("selectedIssue");
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

    const { updateIssueAsync } = useUpdateIssue({ projectId });

    const { columns } = useProjectColumns(projectId);
    const [issueDescription, setIssueDescription] = useState(
      issue?.description,
    );
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const descriptionInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (selectedIssueParams) {
        setSelectedIssue(issue);
      }else{
        setSelectedIssue(null)
      }
    }, [selectedIssueParams, setSelectedIssue, issue]);

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

    const handleClickEditDescription = () => {
      setIsEditingDescription(true);
      descriptionInputRef.current?.focus();
    };
    const stopPropagation = (e: React.PointerEvent) => {
      e.stopPropagation();
    };

    const handleChangeIssueValue = (field: string, value: string) => {
      updateIssueAsync({
        id: issue.id,
        data: {
          [field]: value,
        },
      });
    };

    const pointerDownTime = useRef(0);
    const startX = useRef(0);
    const startY = useRef(0);
    const moved = useRef(false);

    const handlePointerDown = (e: React.PointerEvent) => {
      pointerDownTime.current = Date.now();
      startX.current = e.clientX;
      startY.current = e.clientY;
      moved.current = false;

      window.addEventListener(
        "pointermove",
        handlePointerMove as unknown as EventListener,
      );
      window.addEventListener(
        "pointerup",
        handlePointerUp as unknown as EventListener,
      );

      // Call DnD listeners
      if (listeners?.onPointerDown) {
        listeners.onPointerDown(e);
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      const dx = Math.abs(e.clientX - startX.current);
      const dy = Math.abs(e.clientY - startY.current);
      if (dx > 5 || dy > 5) {
        moved.current = true;
      }
    };
    const handlePointerUp = () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove as unknown as EventListener,
      );
      window.removeEventListener(
        "pointerup",
        handlePointerUp as unknown as EventListener,
      );

      const duration = Date.now() - pointerDownTime.current;
      if (!moved.current && duration < 250) {
        handleIssueCardClick();
      }
    };

    const handleIssueCardClick = () => {
      navigate(`/projects/${projectId}/backlog?selectedIssue=${issue.id}`);
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onPointerDown={handlePointerDown}
        className={`group border-y-1 border-gray-200 bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-100`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center justify-start gap-x-2">
            <div className="flex w-full cursor-pointer flex-row items-center gap-2">
              <input
                type="checkbox"
                style={{
                  opacity:
                    selectedIssues &&
                    selectedIssues[issue.sprint_id || ""] &&
                    selectedIssues[issue.sprint_id || ""].find(
                      (i) => i.id === issue.id,
                    )
                      ? "100"
                      : "",
                }}
                onPointerDown={stopPropagation}
                checked={
                  selectedIssues &&
                  selectedIssues[issue.sprint_id || ""] &&
                  selectedIssues[issue.sprint_id || ""].find(
                    (i) => i.id === issue.id,
                  )
                    ? true
                    : false
                }
                onChange={() => {
                  if (
                    selectedIssues &&
                    selectedIssues[issue.sprint_id || ""] &&
                    selectedIssues[issue.sprint_id || ""].includes(issue)
                  ) {
                    let temp: IIssue[] = selectedIssues[issue.sprint_id || ""];
                    temp = temp.filter((i: IIssue) => i.id !== issue.id);
                    setSelectIssues({ [issue.sprint_id || ""]: temp });
                    if (temp.length === 0) {
                      setIsSprintIssuesChecked(false);
                    }
                  } else {
                    const existingIssues =
                      selectedIssues[issue.sprint_id || ""] || [];
                    const newIssues = [...existingIssues, issue];
                    setSelectIssues({ [issue.sprint_id || ""]: newIssues });
                    setIsSprintIssuesChecked(true);
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 opacity-0 group-hover:opacity-100 focus:ring-blue-500"
              />

              <div className="rounded-sm border-1 border-emerald-500 p-0.5">
                <FaCheck className="font-normal text-emerald-500" size={12} />
              </div>

              <div
                className={`block text-sm font-light text-gray-500 ${issue?.column?.name === "DONE" ? "line-through" : "underline"}`}
              >
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
                    className={`w-full rounded-sm border-2 border-emerald-500 px-2 py-1 outline-none`}
                  />
                ) : (
                  <span className="text-sm">{issueDescription}</span>
                )}

                {!isEditingDescription && (
                  <div
                    onPointerDown={stopPropagation}
                    onClick={handleClickEditDescription}
                    className="hidden group-hover:block"
                  >
                    <FaEdit size={16} />
                  </div>
                )}
              </div>

              {/* epic dropdown */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`${isEditingDescription ? "block" : "hidden"} group-hover:block`}
              >
                <div className="flex items-center gap-2 rounded-sm border-1 border-gray-300 px-3 py-0.5">
                  <FaPlus className="text-gray-500" size={12} />
                  <span className="text-sm text-gray-500">Epic</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex w-[35%] min-w-[310px] items-center justify-between"
            onPointerDown={stopPropagation}
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

            <div className="flex flex-row items-center gap-x-2">
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
                  onClick: () =>
                    handleChangeIssueValue("priority", option.name),
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
              <div className="cursor-pointer rounded-sm p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-300">
                <BsThreeDots />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default IssueCard;
