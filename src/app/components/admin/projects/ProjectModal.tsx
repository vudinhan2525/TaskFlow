import React from "react";
import { IProject } from "@libs/types/project";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  editingProject: IProject | null;
}

export interface ProjectFormData {
  name: string;
  key: string;
  access: "Public" | "Private" | "Teams";
  type: "Scrum" | "Kanban";
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProject,
}) => {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    name: "",
    key: "",
    access: "Private",
    type: "Scrum",
  });

  React.useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        key: editingProject.key,
        access: editingProject.access as "Public" | "Private" | "Teams",
        type: editingProject.type,
      });
    } else {
      setFormData({
        name: "",
        key: "",
        access: "Private",
        type: "Scrum",
      });
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="border-b p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProject ? "Edit Project" : "Create Project"}
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Project Key
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        key: e.target.value.toUpperCase(),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Access Level
                    </label>
                    <select
                      value={formData.access}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          access: e.target.value as
                            | "Public"
                            | "Private"
                            | "Teams",
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="Teams">Teams</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Project Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as "Scrum" | "Kanban",
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Scrum">Scrum</option>
                      <option value="Kanban">Kanban</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  {editingProject ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
