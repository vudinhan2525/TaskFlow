import React, { useState } from "react";
import ProjectTable from "@libs/app/components/admin/projects/ProjectTable";
import CreateProjectModal from "@libs/app/components/projects/modals/createProjectModal";
import SearchFilters from "@libs/app/components/admin/common/SearchFilters";
import { IProject } from "@libs/types/project";
import { IUser } from "@libs/types/user";

const mockUsers: IUser[] = []; // Replace with real data fetching
const mockProjects: IProject[] = []; // Replace with real data fetching

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectAccess, setProjectAccess] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | undefined>(
    undefined,
  );

  const handleDeleteProject = (projectId: string) => {
    console.log("Delete project:", projectId);
  };

  return (
    <div>
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setProjectModalOpen(true)}
        addButtonText="Add Project"
        showProjectFilters
        projectType={projectType}
        projectAccess={projectAccess}
        onProjectTypeChange={setProjectType}
        onProjectAccessChange={setProjectAccess}
      />

      <div className="rounded-lg bg-white shadow">
        <ProjectTable
          projects={mockProjects}
          users={mockUsers}
          onEdit={(project) => {
            setEditingProject(project);
            setProjectModalOpen(true);
          }}
          onDelete={handleDeleteProject}
        />
      </div>

      <CreateProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(undefined);
        }}
        isEditing={!!editingProject}
        iniProject={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;
