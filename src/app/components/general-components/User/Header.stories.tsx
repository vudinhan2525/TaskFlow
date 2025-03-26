// import type { Meta, StoryObj } from "@storybook/react";
// import { Header } from "./Header";
// import { mockUser, mockProjects, mockTeams } from "./mockData";

// const meta = {
//   title: "Components/Header",
//   component: Header,
//   parameters: {
//     layout: "fullscreen",
//   },
// } satisfies Meta<typeof Header>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   args: {
//     currentUser: mockUser,
//     projects: mockProjects,
//     teams: mockTeams,
//     onCreateIssue: () => console.log("Create Issue clicked"),
//     onProjectChange: (project) => console.log("Project selected:", project),
//     onTeamChange: (team) => console.log("Team selected:", team),
//   },
// };

// export const WithLongLists: Story = {
//   args: {
//     currentUser: mockUser,
//     projects: [...mockProjects, ...mockProjects.map((p) => ({ ...p, id: p.id + "-copy", name: p.name + " (Copy)" }))],
//     teams: [...mockTeams, ...mockTeams.map((t) => ({ ...t, id: t.id + "-copy", name: t.name + " (Copy)" }))],
//     onCreateIssue: () => console.log("Create Issue clicked"),
//     onProjectChange: (project) => console.log("Project selected:", project),
//     onTeamChange: (team) => console.log("Team selected:", team),
//   },
// };
