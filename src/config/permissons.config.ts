export const PERMISSIONS_CONFIG = {
  role: {
    view: "role:view",
    create: "role:create",
    update: "role:update",
    delete: "role:delete",
  },
  team: {
    view: "team:view",
    create: "team:create",
    update: "team:update",
    delete: "team:delete",
    addMember: "team:addMember",
    removeMember: "team:removeMember",
    assignRole: "team:assignRole",
  },
  issue: {
    view: "issue:view",
    create: "issue:create",
    update: "issue:update",
    delete: "issue:delete",
    assign: "issue:assign",
    changePriority: "issue:changePriority",
    changeSprint: "issue:changeSprint",
  },
  sprint: {
    view: "sprint:view",
    create: "sprint:create",
    update: "sprint:update",
    delete: "sprint:delete",
    start: "sprint:start",
    complete: "sprint:complete",
  },
  file: {
    view: "file:view",
    upload: "file:upload",
    delete: "file:delete",
  },
  permission: {
    view: "permission:view",
    update: "permission:update",
  },
  project: {
    view: "project:view",
    create: "project:create",
    update: "project:update",
    delete: "project:delete",
  },
  user: {
    view: "user:view",
    update: "user:update",
  },
  projectMember: {
    add: "project_member:add_member",
    create: "project_member:add_member",
    update: "project_member:add_member",
    delete: "project_member:add_member",
  },
} as const;
