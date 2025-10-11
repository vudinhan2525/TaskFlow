import { useMemo } from "react";
import { IUser } from "@libs/types/user";
import { IIssue } from "@libs/types/issue";
import { ITeam } from "@libs/types/team";
import { ISprint } from "@libs/types/sprint";

export interface PermissionResult {
  isAllow: boolean;
  message?: string;
}
export interface PermissionResource {
  issue?: {
    issue: IIssue;
    teams: ITeam[];
  };
  sprint?: ISprint;
}

// Permission constants for better maintainability
const PERMISSION_MESSAGES = {
  TEAM_NOT_ALLOWED:
    "Your team is not allowed to perform this action on this issue",
  ISSUE_NOT_ASSIGNED_TO_TEAM: "This issue is not assigned to any team",
  VIEWER_NOT_ALLOWED: "Viewer is not allowed to perform any actions",
  NO_PERMISSION: "You do not have permission to perform this action",
} as const;

const checkIssuePermissions = (
  user: IUser,
  issue: { issue: IIssue; teams: ITeam[] },
  action: string,
): PermissionResult => {
  if (!issue.teams) {
    return {
      isAllow: false,
      message: PERMISSION_MESSAGES.NO_PERMISSION,
    };
  }

  if (!issue.issue) {
    return { isAllow: false, message: PERMISSION_MESSAGES.NO_PERMISSION };
  }
  if (issue.issue.assignee_id === user.id) {
    return { isAllow: true };
  }
  if (!issue.teams.some((team) => team.id === issue.issue.team_id)) {
    return {
      isAllow: false,
      message: PERMISSION_MESSAGES.ISSUE_NOT_ASSIGNED_TO_TEAM,
    };
  }
  if (user.projectPermission?.includes(action)) {
    return { isAllow: true };
  } else {
    return {
      isAllow: false,
      message: PERMISSION_MESSAGES.TEAM_NOT_ALLOWED,
    };
  }
};

const checkTeamMemberPermissions = (
  user: IUser,
  action: string,
  resource?: PermissionResource,
): PermissionResult => {
  const resourceType = resource?.issue
    ? "issue"
    : resource?.sprint
      ? "sprint"
      : "team";

  switch (resourceType) {
    case "issue":
      return checkIssuePermissions(user, resource?.issue!, action);
  }
  const hasPermission = user.projectPermission?.includes(action);
  return {
    isAllow: hasPermission!,
    message: hasPermission ? undefined : PERMISSION_MESSAGES.NO_PERMISSION,
  };
};

const getRoleBasedPermission = (
  user: IUser,
  action: string,
  resource?: PermissionResource,
): PermissionResult => {
  const role = user.projectRole;
  if (role === "ADMIN" || role === "OWNER") {
    return { isAllow: true };
  }

  if (role === "VIEWER") {
    return {
      isAllow: false,
      message: PERMISSION_MESSAGES.VIEWER_NOT_ALLOWED,
    };
  }

  if (role === "MEMBER") {
    return checkTeamMemberPermissions(user, action, resource);
  }
  return checkTeamMemberPermissions(user, action, resource);

  return {
    isAllow: false,
    message: PERMISSION_MESSAGES.NO_PERMISSION,
  };
};

interface UsePermissionParams {
  user: IUser;
  action: string;
  resource?: PermissionResource;
}
export function usePermission({
  user,
  resource,
  action,
}: UsePermissionParams): PermissionResult {
  return useMemo(() => {
    return getRoleBasedPermission(user, action, resource);
  }, [user, resource, action]);
}
