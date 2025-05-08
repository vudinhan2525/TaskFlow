import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useCreateSprint, useUpdateSprint } from "@libs/hooks/useSprint";

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  isEditing?: boolean;
  initialSprint?: {
    id: string;
    name: string;
    date_started: string;
    date_ended: string;
    goal?: string;
    duration?: number;
  };
}

const sprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date_started: z.string().min(1, "Start date is required"),
  date_ended: z.string().min(1, "End date is required"),
  goal: z.string().optional(),
  duration: z.number().optional(),
});

type SprintFormData = z.infer<typeof sprintSchema>;

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  projectId,
  isEditing,
  initialSprint,
}) => {
  const { createSprint, isLoading: isCreating } = useCreateSprint({
    projectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const { updateSprint, isLoading: isUpdating } = useUpdateSprint({
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
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: "",
      date_started: "",
      date_ended: "",
      goal: "",
      duration: 14,
    },
  });

  const handleFormSubmit: SubmitHandler<SprintFormData> = async (data) => {
    const sprintData = {
      ...data,
      goal: data.goal || "", // Ensure goal is always a string
      duration: data.duration || 14, // Ensure duration has a default value
    };

    if (isEditing && initialSprint) {
      updateSprint({ id: initialSprint.id, data: sprintData });
    } else {
      createSprint({ ...sprintData, project_id: projectId });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={isEditing ? "Update Sprint" : "Create Sprint"}
      onClose={onClose}
      buttonContent={isLoading ? "Loading..." : isEditing ? "Update Sprint" : "Create Sprint"}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(handleFormSubmit)(e)
      }}
      isLoadingButton={isLoading}
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
            <label htmlFor="date_started" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date_started"
              type="date"
              {...register("date_started")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.date_started && <p className="text-sm text-red-500 mt-1">{errors.date_started.message}</p>}
          </div>

          <div>
            <label htmlFor="date_ended" className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date_ended"
              type="date"
              {...register("date_ended")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.date_ended && <p className="text-sm text-red-500 mt-1">{errors.date_ended.message}</p>}
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              Sprint Goal
            </label>
            <textarea
              id="goal"
              {...register("goal")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="What do you want to achieve in this sprint?"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Sprint Duration (days)
            </label>
            <input
              id="duration"
              type="number"
              {...register("duration")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="14"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSprintModal;
