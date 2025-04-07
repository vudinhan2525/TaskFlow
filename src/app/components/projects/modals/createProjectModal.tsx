import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import Modal from "@libs/app/components/general-components/modal";
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  access: z.string(),
  type: z.enum(["Kanban", "Scrum"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      access: "Private",
      type: "Scrum",
    },
  });

  const access = watch("access");

  const handleFormSubmit = (data: ProjectFormData) => {
    console.log(data);
    // reset();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create Project Modal"
      onClose={onClose}
      buttonContent="Create project"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
            Access Level
          </label>
          <DropdownAntd
            options={[
              { value: "Private", label: "Private" },
              { value: "Public", label: "Public" },
              { value: "Team", label: "Team" },
            ]}
            placement="bottom"
            rowClassName="w-full text-[15px]"
            menuClassName="w-[380px]"
            parent={<div className="w-full">{access}</div>}
            onClickItem={(value) => setValue("access", value.value)}
          />
          {errors.access && <p className="text-sm text-red-500 mt-1">{errors.access.message}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
          <div className="flex space-x-4">
            {["Kanban", "Scrum"].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  value={type}
                  {...register("type")}
                  className="form-radio text-green-600 focus:ring-green-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
          {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
