import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { IProject } from "@libs/types/project";
import { IUser } from "@libs/types/user";

interface ProjectTableProps {
  projects: IProject[];
  users: IUser[];
  onEdit: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Access
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Created Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {project.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{project.key}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    project.type === "Scrum"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {project.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    project.access === "Public"
                      ? "bg-green-100 text-green-800"
                      : project.access === "Private"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.access}
                </span>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                {users.find((u) => u.id === project.owner_id)?.first_name ||
                  "Unknown"}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <button
                  onClick={() => onEdit(project)}
                  className="mr-3 text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
