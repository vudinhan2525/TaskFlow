import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import StatusDropdown from "../backlog/StatusDropdown";
import { useProject, useProjectColumns, useUserProjects } from "@libs/hooks/useProject";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { RootState } from "@libs/store";
import { IssueStatus, IssuePriority } from "@libs/types/issue";
import { CreateIssueParams } from "@libs/apis/issue";

interface UnifiedIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  sprintId?: string;
  isEditing?: boolean;
  initialIssue?: {
    id: string;
    title: string;
    summary?: string;
    description?: string;
    status: string;
    priority: string;
    type: "Bug" | "Task" | "Story" | "Epic";
    sprint_id?: string;
    assignee_id?: string;
  };
}

const ISSUE_TYPES = ["Bug", "Task", "Story", "Epic"] as const;
type IssueType = (typeof ISSUE_TYPES)[number];

interface IssueFormInputs {
  title: string;
  summary: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  sprint_id?: string;
  assignee_id?: string;
  attachments: File[];
}

const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  status: z.enum(["TO DO", "IN PROGRESS", "DONE"] as const),
  priority: z.enum(["Low", "Medium", "High"] as const),
  type: z.enum(ISSUE_TYPES),
  sprint_id: z.string().optional(),
  assignee_id: z.string().optional(),
  attachments: z.array(z.instanceof(File)).min(0),
});

const UnifiedIssueModal: React.FC<UnifiedIssueModalProps> = ({
  isOpen,
  onClose,
  projectId,
  sprintId,
  isEditing,
  initialIssue,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || "");
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects } = useUserProjects();
  const { project } = useProject(projectId || "");
  const { columns } = useProjectColumns(selectedProjectId);
  const { sprints } = useProjectSprints(selectedProjectId);

  const { createIssue, isLoading: isCreating } = useCreateIssue({
    projectId: selectedProjectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const { updateIssue, isLoading: isUpdating } = useUpdateIssue({
    projectId: selectedProjectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const isLoading = isCreating || isUpdating;

  const defaultValues: IssueFormInputs = {
    title: "",
    summary: "",
    description: "",
    status: "TO DO",
    priority: "Medium",
    type: "Task",
    sprint_id: sprintId || "",
    attachments: [],
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormInputs>({
    resolver: zodResolver(issueSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isEditing && initialIssue) {
      reset({
        ...defaultValues,
        title: initialIssue.title,
        summary: initialIssue.summary || "",
        description: initialIssue.description || "",
        status: initialIssue.status as IssueStatus,
        priority: initialIssue.priority as IssuePriority,
        type: initialIssue.type,
        sprint_id: initialIssue.sprint_id,
        assignee_id: initialIssue.assignee_id,
      });
    }
  }, [isEditing, initialIssue, reset]);

  const type = watch("type");
  const status = watch("status");
  const priority = watch("priority");
  const files = watch("attachments");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setValue("attachments", droppedFiles);
    },
    [setValue]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      setValue("attachments", selectedFiles);
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data: IssueFormInputs) => {
    if (!user?.id) {
      console.error("No user found");
      return;
    }

    // Convert File objects to string paths (in real app, you'd upload files first)
    const attachmentPaths = data.attachments.map((file: File) => URL.createObjectURL(file));

    if (!selectedProjectId) {
      console.error("No project selected");
      return;
    }

    const issueData: CreateIssueParams = {
      project_id: selectedProjectId,
      title: data.title,
      summary: data.summary,
      description: data.description,
      status: data.status,
      priority: data.priority,
      type: data.type,
      sprint_id: data.sprint_id || "",
      reporter_id: user.id,
      assignee_id: data.assignee_id,
      attachments: attachmentPaths,
    };

    if (isEditing && initialIssue) {
      try {
        await updateIssue({ id: initialIssue.id, data: issueData });
        toast.success("Issue updated successfully!");
      } catch (error) {
        toast.error(`Failed to update issue: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } else {
      try {
        await createIssue(issueData);
        toast.success("Issue created successfully!");
      } catch (error) {
        toast.error(`Failed to create issue: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  });

  if (!isOpen) return null;

  return (
    <Modal
      title={isEditing ? "Update Issue" : "Create Issue"}
      onClose={onClose}
      buttonContent={isLoading ? "Loading..." : isEditing ? "Update Issue" : "Create Issue"}
      onSubmit={onSubmit}
      isLoadingButton={isLoading}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
        <form className="space-y-4">
          <div className="mb-6 space-y-4">
            {/* Project Selection/Display */}
            {projectId ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <div className="px-3 py-2 rounded-md bg-gray-50">
                  <span className="text-gray-900">
                    {project?.name || projects?.find((p) => p.id === projectId)?.name}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {projects?.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project <span className="text-red-500">*</span>
                    </label>
                    <DropdownAntd
                      options={
                        projects?.map((project) => ({
                          value: project.id,
                          label: project.name,
                        })) || []
                      }
                      placement="bottom"
                      rowClassName="font-semibold text-gray-700"
                      menuClassName="min-w-[180px]"
                      parent={
                        <div className="flex items-center space-x-2 px-3 rounded-md">
                          {projects?.find((p) => p.id === selectedProjectId)?.name || "Select Project"}
                        </div>
                      }
                      onClickItem={(option) => {
                        setSelectedProjectId(option.value);
                        setValue("sprint_id", "");
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">No projects available. Please create a project first.</p>
                  </div>
                )}
              </>
            )}

            {/* Sprint Selection/Display */}
            {selectedProjectId && (
              <div>
                {sprintId ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
                    <div className="px-3 py-2  rounded-md bg-gray-50">
                      <span className="text-gray-900">{sprints?.find((s) => s.id === sprintId)?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sprint (Optional)</label>
                    <DropdownAntd
                      options={
                        sprints?.map((sprint) => ({
                          value: sprint.id,
                          label: sprint.name,
                        })) || []
                      }
                      placement="bottom"
                      rowClassName="font-semibold text-gray-700"
                      menuClassName="min-w-[180px]"
                      parent={
                        <div className="flex items-center space-x-2 px-3 rounded-md">
                          {sprints?.find((s) => s.id === watch("sprint_id"))?.name || "Select Sprint"}
                        </div>
                      }
                      onClickItem={(option) => setValue("sprint_id", option.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <DropdownAntd
                options={ISSUE_TYPES.map((value) => ({ value, label: value }))}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[180px]"
                parent={<div className="w-full font-medium">{type}</div>}
                onClickItem={(option) => setValue("type", option.value as IssueType)}
              />
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <DropdownAntd
                options={[
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" },
                ]}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[180px]"
                parent={<div className="w-full font-medium">{priority}</div>}
                onClickItem={(option) => setValue("priority", option.value as IssuePriority)}
              />
              {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter issue title"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <input
              id="summary"
              type="text"
              {...register("summary")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief summary of the issue"
            />
            {errors.summary && <p className="text-sm text-red-500 mt-1">{errors.summary.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Detailed description of the issue"
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            {columns ? (
              <StatusDropdown
                status={status}
                columns={columns}
                onChange={(newStatus) => setValue("status", newStatus as IssueStatus)}
              />
            ) : (
              <DropdownAntd
                options={[
                  { value: "TO DO", label: "To Do" },
                  { value: "IN PROGRESS", label: "In Progress" },
                  { value: "DONE", label: "Done" },
                ]}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[180px]"
                parent={<div className="w-full font-medium">{status}</div>}
                onClickItem={(option) => setValue("status", option.value as IssueStatus)}
              />
            )}
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee (Optional)
            </label>
            <DropdownAntd
              options={[]} // Populate with project members
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">Select Assignee</div>}
              onClickItem={(option) => setValue("assignee_id", option.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors 
                ${files.length ? "border-green-500 bg-green-50" : "hover:border-green-500 hover:bg-green-50"}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <p>
                {files.length
                  ? "Drop files here or click to replace"
                  : "Drag & drop files here, or click to select files"}
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UnifiedIssueModal;
