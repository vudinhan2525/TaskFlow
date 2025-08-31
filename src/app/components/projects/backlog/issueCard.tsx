import { IIssue } from "@libs/types/issue";
import { FaCheck } from "react-icons/fa";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useState, useRef, useEffect, memo } from "react";
import { FaEdit } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import CustomInput from "./customInput";
import {
  StatusDropdown,
  TypeDropdown,
  UserDropdown,
} from "../../general-components/dropdown/index";
import CustomDatePicker from "../../general-components/customDatePicker";

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
    const [issueSummary, setIssueSummary] = useState(issue?.summary);
    const [isEditingSummary, setIsEditingSummary] = useState(false);

    const summaryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (selectedIssueParams && selectedIssueParams === issue.id) {
        setSelectedIssue(issue);
      } else if (!selectedIssueParams) {
        setSelectedIssue(null);
      }
    }, [selectedIssueParams, setSelectedIssue, issue]);

    useEffect(() => {
      if (summaryInputRef.current) {
        summaryInputRef.current.focus();
      }
    }, [summaryInputRef, isEditingSummary]);

    const handleClickEditDescription = () => {
      setIsEditingSummary(true);
      summaryInputRef.current?.focus();
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
      if (!moved.current && duration < 1000) {
        handleIssueCardClick();
      }
    };

    const handleIssueCardClick = () => {
      setSelectedIssue(issue);
      navigate(`/projects/${projectId}/backlog?selectedIssue=${issue.id}`);
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onPointerDown={handlePointerDown}
        className={`group bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-100`}
      >
        <div className="flex items-center">
          {/* IssueCardLeft */}
          <div className="grid grid-cols-12 w-full cursor-pointer items-center justify-start gap-4">
            {/* ISSUE TITLE AND CHECKBOX */}
            <div className="flex flex-row items-center gap-2 col-span-3">
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
                className={`block truncate text-sm font-light text-gray-500 ${issue?.column?.name === "DONE" ? "line-through" : "underline"}`}
              >
                {issue?.title}
              </div>
            </div>
            {/* ISSUE SUMMARY */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="group relative flex items-center gap-2 text-clip max-w-40 col-span-9"
            >
              {isEditingSummary ? (
                <input
                  type="text"
                  ref={summaryInputRef}
                  value={issueSummary}
                  onBlur={() => {
                    handleChangeIssueValue("summary", issueSummary);
                    setIsEditingSummary(false);
                  }}
                  onChange={(e) => setIssueSummary(e.target.value)}
                  className={`w-full truncate rounded-sm border-2 border-emerald-500 px-2 py-1 outline-none`}
                />
              ) : (
                <span className="truncate text-sm font-thin text-gray-800">
                  {issueSummary}
                </span>
              )}

              {!isEditingSummary && (
                <div
                  onPointerDown={stopPropagation}
                  onClick={handleClickEditDescription}
                  className="absolute right-[-20px] hidden group-hover:block"
                >
                  <FaEdit size={16} className="text-gray-700" />
                </div>
              )}
            </div>
          </div>
          {/* IssueCardRight */}
          <div
            className="grid w-[35%] min-w-[400px] max-w-[45%] grid-cols-12 gap-1"
            onPointerDown={stopPropagation}
            onClick={(e) => e.stopPropagation()}
          >
            {/* status dropdown */}
            <div className="col-span-3 flex items-center">
              <StatusDropdown
                projectId={projectId}
                issueId={issue.id}
                column={
                  columns.find((col) => col.id === issue.column.id) ||
                  columns[0]
                }
              />
            </div>
            {/* type dropdown */}
            <div className="col-span-3 flex items-center hover:cursor-pointer">
              <TypeDropdown
                projectId={projectId}
                issueId={issue.id}
                type={issue?.type}
              />
            </div>

            {/* due date to */}
            <div className="col-span-3 flex items-center">
              <CustomDatePicker
                issue={issue}
                field="due_date_to"
                projectId={projectId}
              />
            </div>

            {/* {/* story point */}
            <div className="col-span-2 flex items-center">
              <div className="flex w-full items-center justify-center">
                <CustomInput
                  field="story_point"
                  className="flex items-center justify-center"
                  // label="-"
                  value={issue.story_point || "-"}
                  handleUpdateIssue={handleChangeIssueValue}
                />
              </div>
            </div>

            {/* assignee */}
            <div className="col-span-1 flex items-center">
              <UserDropdown
                projectId={projectId}
                issueId={issue.id}
                selectedUserId={issue?.assignee_id || ""}
                columnField="assignee_id"
                isDisplayname={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default IssueCard;
