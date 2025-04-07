export interface IProject {
  id: string;
  name: string;
  access: string;
  type: "Kanban" | "Scrum";
  created_at: string;
  updated_at: string;
}
