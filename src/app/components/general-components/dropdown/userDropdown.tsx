import ColumnDropdown from "./columnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import UserAvatar from "../user/userAvatar";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { memo } from "react";

const UserDropdown = ({
  projectId,
  issueId,
  selectedUserId,
  columnField,
  isDisplayname = true,
}: {
  projectId: string;
  issueId: string;
  selectedUserId: string;
  columnField: string;
  isDisplayname?: boolean;
}) => {
  const { projectMembers } = useProjectMembers({ project_id: projectId });
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
            style: {
              padding: 0,
              background: "white",
              border: "none",
              boxShadow: "none",
            },
            label: (
              <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
                <UserAvatar userId={member.user_id} isDisplayName={true} />
              </div>
            ),
            onClick: () => {
              handleChangeUser(member.user_id);
            },
          }))
          .concat({
            value: "Unasigned",
            key: "Unasigned",
            style: {
              padding: 0,
              background: "white",
              border: "none",
              boxShadow: "none",
            },
            label: (
              <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
                <UserAvatar userId={""} isDisplayName={true} />
              </div>
            ),
            onClick: () => {
              handleChangeUser("");
            },
          })
      }
      children={
        <UserAvatar
          userId={selectedUserId || ""}
          isDisplayName={isDisplayname}
        />
      }
    />
  );
};

export default memo(UserDropdown);
