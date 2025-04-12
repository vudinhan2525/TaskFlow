import React, { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import Modal from "@libs/app/components/general-components/modal/modal";
import { IIssue } from "@libs/types/issue";
import { IssueStatus, IssuePriority } from "@libs/types/issue";
import { RootState } from "@libs/store";
interface CreateIssueModalFromSprintProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IIssue>) => Promise<void>;
  projectId: string;
  sprintId: string;
}

const FileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Must be a file",
});

const issueSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  sprintId: z.string().min(1, "Sprint is required"),
  type: z.enum(["Bug", "Task", "Story", "Epic"]),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  status: z.enum(["ToDo", "InProgress", "Done"] as const),
  assignee_id: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"] as const),
  attachments: z.array(FileSchema),
});

type IssueFormData = z.infer<typeof issueSchema>;

const CreateIssueModalFromSprint: React.FC<CreateIssueModalFromSprintProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  sprintId,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      projectId,
      sprintId,
      type: "Task",
      status: "ToDo",
      priority: "Medium",
      attachments: [],
    },
  });

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

  const handleFormSubmit: SubmitHandler<IssueFormData> = (formData) => {
    if (!user?.id) {
      console.error("No user found");
      return;
    }

    onSubmit({
      ...formData,
      project_id: projectId,
      sprint_id: sprintId,
      reporter_id: user.id,
      status: formData.status || "ToDo",
      summary: formData.summary,
      description: formData.description || "",
      attachments: [],
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create Issue"
      onClose={onClose}
      buttonContent="Create issue"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
        <form className="space-y-4">
          <div className="gap-4 mb-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <DropdownAntd
                options={[
                  { value: "Bug", label: "Bug" },
                  { value: "Task", label: "Task" },
                  { value: "Story", label: "Story" },
                  { value: "Epic", label: "Epic" },
                ]}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[380px]"
                parent={<div className="w-full">{type}</div>}
                onClickItem={(option) => setValue("type", option.value as "Bug" | "Task" | "Story" | "Epic")}
              />
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <input
              id="summary"
              {...register("summary")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <DropdownAntd
              options={[
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Done", label: "Done" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[380px]"
              parent={<div className="w-full">{status}</div>}
              onClickItem={(option) => setValue("status", option.value as IssueStatus)}
            />
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <DropdownAntd
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[380px]"
              parent={<div className="w-full">{priority}</div>}
              onClickItem={(option) => setValue("priority", option.value as IssuePriority)}
            />
            {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>}
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee (Optional)
            </label>
            <DropdownAntd
              options={[
                { value: "user1", label: "User 1" },
                { value: "user2", label: "User 2" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[380px]"
              parent={<div className="w-full">Select Assignee (Optional)</div>}
              onClickItem={(option) => setValue("assignee_id", option.value)}
            />
            {errors.assignee_id && <p className="text-sm text-red-500 mt-1">{errors.assignee_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors 
                ${files?.length ? "border-green-500 bg-green-50" : "hover:border-green-500 hover:bg-green-50"}`}
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
                {files?.length
                  ? "Drop files here or click to replace"
                  : "Drag & drop files here, or click to select files"}
              </p>
            </div>
            {files?.length > 0 && (
              <div className="mt-2">
                <ul className="list-disc pl-5">
                  {files.map((file: File, index: number) => (
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

export default CreateIssueModalFromSprint;
