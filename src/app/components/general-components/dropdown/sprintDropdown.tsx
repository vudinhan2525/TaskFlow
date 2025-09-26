import ColumnDropdown from "./columnDropdown";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { ISprint } from "@libs/types/sprint";
import { useMemo } from "react";

const SprintDropdown = ({
  projectId,
  issueId,
  sprintId,
}: {
  projectId: string;
  issueId: string;
  sprintId: string;
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const { sprints } = useProjectSprints(projectId);
  const handleChangeSprint = (updatedSprintId: string) => {
    updateIssueAsync({
      id: issueId,
      data: {
        sprint_id: updatedSprintId,
      },
    });
  };

  const currentSprint = useMemo(() => {
    return sprints.find((sprint) => sprint.id === sprintId);
  }, [sprintId, sprints]);

  return (
    <ColumnDropdown
      items={sprints
        .map((sprint: ISprint) => ({
          value: sprint.name,
          key: sprint.id,
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
            >
              <p className="text-sm font-medium">{sprint.name}</p>
            </div>
          ),
          onClick: () => {
            handleChangeSprint(sprint.id);
          },
        }))
        .concat({
          value: "",
          key: "unassigned",
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              className={`flex items-center gap-1 p-2 transition-all hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
            >
              <p className="text-sm font-medium">Unassigned</p>
            </div>
          ),
          onClick: () => {
            handleChangeSprint("");
          },
        })}
      currentItem={
        currentSprint
          ? sprints.find((sprint: ISprint) => sprint.id === currentSprint.id)
              ?.name
          : "Unassigned"
      }
      children={
        <div className="">
          <div className="flex justify-start rounded-sm border-1 border-gray-200 px-1 py-0.5">
            <p className={`text-sm font-normal text-gray-800`}>
              {currentSprint?.name || "Unassigned"}
            </p>
          </div>
        </div>
      }
    />
  );
};

export default SprintDropdown;
