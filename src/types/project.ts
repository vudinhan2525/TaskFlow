export interface IProject {
  id: string;
  name: string;
  key: string;
  access: string;
  type: "Kanban" | "Scrum";
  owner_id: string;
  created_at: string;
  updated_at: string;
}
