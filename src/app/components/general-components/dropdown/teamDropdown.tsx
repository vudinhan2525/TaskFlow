import ColumnDropdown from "./columnDropdown";
import { ITeam } from "@libs/types/team";
import { useProjectTeams } from "@libs/hooks/apis/useTeam";
import TeamBadge from "../badge/teamBade";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { memo, useMemo } from "react";
import { useAuthStore } from "@libs/store/useAuthStore";

const TeamDropdown = ({
  projectId,
  issueId,
  selectedTeamId,
  columnField = "team_id",
  isDisplayName = true,
}: {
  projectId: string;
  issueId: string;
  selectedTeamId: string;
  columnField?: string;
  isDisplayName?: boolean;
}) => {
  const { teams } = useProjectTeams(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeTeam = (teamId: string) => {
    updateIssueAsync({
      id: issueId,
      data: { [columnField]: teamId },
    });
  };
  const selectedTeam = useMemo(
    () => teams?.find((team: ITeam) => team.id === selectedTeamId),
    [teams, selectedTeamId],
  );

  const { user } = useAuthStore();
  return (
    <ColumnDropdown
      disabled={user?.projectRole !== "OWNER" && user?.projectRole !== "ADMIN"}
      items={
        teams &&
        teams
          .map((team: ITeam) => ({
            value: team.name,
            key: team.id,
            label: <TeamBadge team={team} isShowLabel={true} className="p-2" />,
            onClick: () => {
              handleChangeTeam(team.id);
            },
          }))
          .concat({
            value: "Unassigned",
            key: "Unassigned",
            label: (
              <div className="flex items-center gap-2 p-2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-600">Unassigned</span>
              </div>
            ),
            onClick: () => {
              handleChangeTeam("");
            },
          })
      }
      children={
        selectedTeam ? (
          <TeamBadge team={selectedTeam} isShowLabel={isDisplayName} />
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
            {isDisplayName && (
              <span className="text-sm text-gray-600">Unassigned</span>
            )}
          </div>
        )
      }
    />
  );
};

export default memo(TeamDropdown);
