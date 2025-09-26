import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { Popover } from "antd";
import ProjectMemberInvitations from "./modals/projectMemberInvitations";
import { useUserMemberships } from "@libs/hooks/useProjectMember";

interface ProjectInvitationsPopoverProps {
  userId: string;
} 

const ProjectInvitationsPopover: React.FC<ProjectInvitationsPopoverProps> = ({ userId }) => {
  const { memberships } = useUserMemberships(userId);
  const pendingInvitations = memberships.filter((member) => member.is_pending);

  const content = <ProjectMemberInvitations userId={userId} />;

  return (
    <Popover content={content} trigger="click" placement="bottom">
      <div className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
        <FaUserPlus />
        {pendingInvitations.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{pendingInvitations.length}</span>
          </span>
        )}
      </div>
    </Popover>
  );
};

export default ProjectInvitationsPopover; 