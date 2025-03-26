import { User, Project, Team } from "../../../../types";

export const mockUser: User = {
  id: "1",
  email: "john.doe@taskflow.com",
  name: "John Doe",
  avatar: "https://ui-avatars.com/api/?name=John+Doe",
  role: "admin",
  teams: [], // Will be populated below
};

export const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Frontend Team",
    description: "Web application development team",
    members: [],
    projects: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "t2",
    name: "Backend Team",
    description: "API and server development team",
    members: [],
    projects: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "t3",
    name: "Design Team",
    description: "UI/UX design team",
    members: [],
    projects: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    key: "TASK",
    name: "TaskFlow",
    description: "Project management application",
    team: mockTeams[0],
    leads: [mockUser],
    members: [mockUser],
    boards: [],
    epics: [],
    sprints: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "p2",
    key: "CRM",
    name: "Customer Portal",
    description: "Customer relationship management system",
    team: mockTeams[1],
    leads: [mockUser],
    members: [mockUser],
    boards: [],
    epics: [],
    sprints: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "p3",
    key: "DASH",
    name: "Analytics Dashboard",
    description: "Real-time analytics dashboard",
    team: mockTeams[2],
    leads: [mockUser],
    members: [mockUser],
    boards: [],
    epics: [],
    sprints: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Update circular references
mockUser.teams = mockTeams;
mockTeams.forEach((team) => {
  team.members = [mockUser];
  team.projects = mockProjects.filter((p) => p.team.id === team.id);
});
