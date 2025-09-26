import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Edit } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useNavigate } from "react-router-dom";
import CustomInput from "./customInput";
import StatusDropdown from "../../general-components/dropdown/statusDropdown";
import TypeDropdown from "../../general-components/dropdown/typeDropdown";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserDropdown from "../../general-components/dropdown/userDropdown";
import CustomDatePicker from "../../general-components/customDatePicker";
import { useIssueStore } from "@libs/store/useIssueStore";
import { toggleIssue, isIssueSelected } from "@libs/utils/issue";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import { usePermission } from "@libs/hooks/usePermission";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeams } from "@libs/hooks/useTeam";
import { PermissionContext } from "@libs/app/context/permission.context";

const IssueCard = memo(
  ({ issue, projectId }: { issue: IIssue; projectId: string }) => {
    const navigate = useNavigate();
    const { openIssueDetail } = useIssueStore();
    const { user } = useAuthStore();
    const { userTeams } = useUserTeams(projectId, user?.id || "");
    const permissionResult = usePermission({
      user: user!,
      action: PERMISSIONS_CONFIG.issue.update,
      resource: {
        issue: { issue: issue, teams: userTeams! },
      },
    });
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
    const { columns } = useProjectColumns({ project_id: projectId });
    const [issueSummary, setIssueSummary] = useState(issue?.summary);
    const [isEditingSummary, setIsEditingSummary] = useState(false);

    const summaryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (summaryInputRef.current) {
        summaryInputRef.current.focus();
      }
    }, [summaryInputRef, isEditingSummary]);

    const handleClickEditDescription = useCallback(() => {
      setIsEditingSummary(true);
      summaryInputRef.current?.focus();
    }, []);
    const stopPropagation = useCallback((e: React.PointerEvent) => {
      e.stopPropagation();
    }, []);

    const handleChangeIssueValue = useCallback(
      (field: string, value: string) => {
        updateIssueAsync({
          id: issue.id,
          data: {
            [field]: value,
          },
        });
      },
      [issue.id, updateIssueAsync],
    );

    const handleIssueCardClick = useCallback(() => {
      openIssueDetail(issue.id);
      navigate(`/projects/${projectId}/backlog?selectedIssue=${issue.id}`);
    }, [issue.id, openIssueDetail, navigate, projectId]);

    useEffect(() => {
      setIssueSummary(issue.summary);
    }, [issue.summary]);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-100`}
      >
        <PermissionContext.Provider value={permissionResult}>
          <div
            onClick={() => {
              handleIssueCardClick();
            }}
            className="flex items-center"
          >
            {/* IssueCardLeft */}
            <div className="flex w-full cursor-pointer flex-row items-center justify-start gap-4">
              {/* ISSUE TITLE AND CHECKBOX */}
              <div className="flex flex-row items-center gap-2">
                <input
                  aria-label="Select Issue"
                  type="checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{
                    opacity: isIssueSelected(issue) ? "100" : "",
                  }}
                  onPointerDown={stopPropagation}
                  checked={isIssueSelected(issue)}
                  onChange={() =>
                    toggleIssue(issue.id, issue.sprint_id || "backlog")
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 opacity-0 group-hover:opacity-100 focus:ring-blue-500"
                />

                <TypeBadge type={issue.type} isShowLabel={false} />

                <div
                  className={`block text-sm font-light text-gray-500 ${issue?.column?.name === "DONE" ? "line-through" : "underline"}`}
                >
                  {issue?.key}
                </div>
              </div>
              {/* ISSUE SUMMARY */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="group relative flex max-w-40 items-center gap-2 text-clip"
              >
                {isEditingSummary ? (
                  <input
                    aria-label="Issue Summary"
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
                    <Edit size={16} className="text-gray-700" />
                  </div>
                )}
              </div>
            </div>
            {/* IssueCardRight */}
            <div
              className="grid w-[35%] max-w-[45%] min-w-[400px] grid-cols-12 gap-1"
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
        </PermissionContext.Provider>
      </div>
    );
  },
);

export default IssueCard;
