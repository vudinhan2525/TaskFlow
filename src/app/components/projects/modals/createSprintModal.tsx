import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal";

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SprintFormData) => Promise<void>;
  projectId: string;
}

const sprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateStarted: z.string().min(1, "Start date is required"),
  dateEnded: z.string().min(1, "End date is required"),
});

type SprintFormData = z.infer<typeof sprintSchema>;

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ isOpen, onClose, onSubmit, projectId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
  });

  const handleFormSubmit: SubmitHandler<SprintFormData> = async (data) => {
    console.log("Form submitted with data:", data);
    await onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create Sprint"
      onClose={onClose}
      buttonContent="Create sprint"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Sprint Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Sprint 1"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="dateStarted" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dateStarted"
              type="date"
              {...register("dateStarted")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.dateStarted && <p className="text-sm text-red-500 mt-1">{errors.dateStarted.message}</p>}
          </div>

          <div>
            <label htmlFor="dateEnded" className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dateEnded"
              type="date"
              {...register("dateEnded")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.dateEnded && <p className="text-sm text-red-500 mt-1">{errors.dateEnded.message}</p>}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSprintModal;
