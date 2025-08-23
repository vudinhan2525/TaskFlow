import ColumnDropdown from "./columnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import UserAvatar from "../user/userAvatar";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { useUpdateIssue } from "@libs/hooks/useIssue";

const UserDropdown = ({
  projectId,
  issueId,
  selectedUserId,
  columnField,
}: {
  projectId: string;
  issueId: string;
  selectedUserId: string;
  columnField: string;
}) => {
  const { projectMembers } = useProjectMembers(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeUser = (userId: string) => {
    updateIssueAsync({ id: issueId, data: { [columnField]: userId } });
  };
  return (
    <ColumnDropdown
      items={
        projectMembers &&
        projectMembers
          .map((member: IProjectMember) => ({
            value: member.user?.first_name + " " + member.user?.last_name,
            key: member.user_id,

            label: <UserAvatar userId={member.user_id} isDisplayName={true} />,
            onClick: () => {
              handleChangeUser(member.user_id);
            },
          }))
          .concat({
            value: "Unasigned",
            key: "Unasigned",

            label: <UserAvatar userId={""} isDisplayName={true} />,
            onClick: () => {
              handleChangeUser("");
            },
          })
      }
      children={
        <UserAvatar userId={selectedUserId || ""} isDisplayName={true} />
      }
    />
  );
};

export default UserDropdown;
