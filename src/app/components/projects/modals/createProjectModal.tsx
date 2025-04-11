import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import Modal from "@libs/app/components/general-components/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { toast } from "react-toastify";
import { RootState } from "@libs/store";
import { useCreateProject } from "@libs/hooks/useProject";
import { useEffect } from "react";

interface CreateProjectForm {
  name: string;
  key: string;
  type: "Kanban" | "Scrum";
  access: string;
}

interface CreateProjectRequest extends CreateProjectForm {
  owner_id: string;
}

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  key: z.string().min(1, "Project key is required").max(10),
  type: z.enum(["Kanban", "Scrum"] as const),
  access: z.string().min(1, "Access type is required"),
});

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { createProject, isLoading, isSuccess } = useCreateProject();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      type: "Kanban",
      access: "Private",
    },
  });

  const type = watch("type");
  const access = watch("access");

  const onSubmit = async (formData: CreateProjectForm) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }
    const request: CreateProjectRequest = {
      ...formData,
      owner_id: user.id,
    };
    createProject(request);
  };

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  if (!isOpen) return null;
  return (
    <Modal
      title="Create Project"
      onClose={onClose}
      buttonContent={isLoading ? "Creating..." : "Create Project"}
      onSubmit={handleSubmit(onSubmit)}
      className="w-[500px]"
      isLoadingButton={isLoading}
    >
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter project name"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
            Project Key <span className="text-red-500">*</span>
          </label>
          <input
            id="key"
            {...register("key")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g. PRJ, TASK (max 10 chars)"
          />
          {errors.key && <p className="text-sm text-red-500 mt-1">{errors.key.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={[
                { value: "Kanban", label: "Kanban" },
                { value: "Scrum", label: "Scrum" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">{type}</div>}
              onClickItem={(option) => setValue("type", option.value as "Kanban" | "Scrum")}
            />
            {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
              Access <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={[
                { value: "Private", label: "Private" },
                { value: "Public", label: "Public" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">{access}</div>}
              onClickItem={(option) => setValue("access", option.value)}
            />
            {errors.access && <p className="text-sm text-red-500 mt-1">{errors.access.message}</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
