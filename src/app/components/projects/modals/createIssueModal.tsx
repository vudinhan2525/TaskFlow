import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { CreateIssueParams, IIssue } from "@libs/types/issue";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  isEditing?: boolean;
  initialIssue?: {
    id: string;
    title: string;
    summary?: string;
    description?: string;
    column: {
      id: string;
      name: string;
    };
    priority: string;
    type: "Bug" | "Task" | "Story" | "Epic";
    sprint_id?: string;
    assignee_id?: string;
  };
}

const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  column_id: z.string().min(1, "Column is required"),
  priority: z.string().min(1, "Priority is required"),
  type: z.enum(["Bug", "Task", "Story", "Epic"]),
  sprint_id: z.string().optional(),
  assignee_id: z.string().optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  projectId,
  isEditing,
  initialIssue,
}) => {
  const { columns = [] } = useProjectColumns(projectId);

  const { createIssue, isLoading: isCreating } = useCreateIssue({
    projectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const { updateIssue, isLoading: isUpdating } = useUpdateIssue({
    projectId,
    onClose: () => {
      onClose();
      reset();
    },
  });


  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      summary: "",
      description: "",
      column_id: columns?.[0]?.id || "", // Set default to first column if available
      priority: "Medium",
      type: "Task",
    },
  });

  React.useEffect(() => {
    if (isEditing && initialIssue) {
      reset({
        title: initialIssue.title,
        summary: initialIssue.summary || "",
        description: initialIssue.description || "",
        column_id: initialIssue.column?.id || "",
        priority: initialIssue.priority,
        type: initialIssue.type,
        sprint_id: initialIssue.sprint_id,
        assignee_id: initialIssue.assignee_id,
      });
    }
  }, [isEditing, initialIssue, reset]);

  const handleFormSubmit: SubmitHandler<IssueFormData> = async (data) => {
    
    // Ensure column_id is set
    if (!data.column_id && columns.length > 0) {
      // Default to first column if none selected
      data.column_id = columns[0].id;
    }

    const issueData = {
      ...data,
      project_id: projectId,
    };

    

    if (isEditing && initialIssue) {
      updateIssue({ id: initialIssue.id, data: issueData as Partial<IIssue> });
    } else {
      createIssue(issueData as CreateIssueParams);
    }
  };

  const type = watch("type");
  const priority = watch("priority");
  const column_id = watch("column_id");

  // Fetch project columns

  if (!isOpen) return null;

  return (
    <Modal
      title={isEditing ? "Update Issue" : "Create Issue"}
      onClose={onClose}
      buttonContent={
        isLoading ? "Loading..." : isEditing ? "Update Issue" : "Create Issue"
      }
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoadingButton={isLoading}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter issue title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Summary
            </label>
            <input
              id="summary"
              type="text"
              {...register("summary")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Detailed description of the issue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Issue Type <span className="text-red-500">*</span>
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
                menuClassName="w-[180px]"
                parent={<div className="w-full font-medium">{type}</div>}
                onClickItem={(option) =>
                  setValue(
                    "type",
                    option.value as "Bug" | "Task" | "Story" | "Epic"
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority <span className="text-red-500">*</span>
              </label>
              <DropdownAntd
                options={[
                  { value: "Highest", label: "Highest" },
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" },
                  { value: "Lowest", label: "Lowest" },
                ]}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[180px]"
                parent={<div className="w-full font-medium">{priority}</div>}
                onClickItem={(option) => setValue("priority", option.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="column"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={columns.map(column => ({
                value: column.id,
                label: column.name
              }))}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={
                <div className="w-full font-medium">
                  {columns.find(c => c.id === column_id)?.name || 'Select Status'}
                </div>
              }
              onClickItem={(option) => setValue("column_id", option.value)}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateIssueModal;
