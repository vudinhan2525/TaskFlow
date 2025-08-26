import ColumnDropdown from "./columnDropdown";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { ISprint } from "@libs/types/sprint";
import RenderTextCell from "../../projects/list/common/RenderTextCell";

const SprintDropdown = ({
  projectId,
  issueId,
  currentSprint,
}: {
  projectId: string;
  issueId: string;
  currentSprint: ISprint;
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
  if (!currentSprint) return <></>;
  return (
    <ColumnDropdown
      items={sprints.map((sprint: ISprint) => ({
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
      }))}
      currentItem={
        sprints.find((sprint: ISprint) => sprint.id === currentSprint.id)?.name
      }
      children={<RenderTextCell text={currentSprint.name} />}
    />
  );
};

export default SprintDropdown;
