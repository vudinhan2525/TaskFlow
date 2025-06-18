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

const sprintSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    date_started: z.string().min(1, "Start date is required"),
    date_ended: z.string().min(1, "End date is required"),
    goal: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.date_started && data.date_ended) {
      const startDate = new Date(data.date_started);
      const endDate = new Date(data.date_ended);
      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["date_ended"],
        });
      }
    }
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
    },
  });

  const handleFormSubmit: SubmitHandler<SprintFormData> = async (data) => {
    const sprintData = {
      ...data,
      date_started: new Date(data.date_started).toISOString(),
      date_ended: new Date(data.date_ended).toISOString(),
      goal: data.goal || "",
      duration: Math.ceil(
        (new Date(data.date_ended).getTime() -
          new Date(data.date_started).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
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
      buttonContent={
        isLoading ? "Loading..." : isEditing ? "Update Sprint" : "Create Sprint"
      }
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(handleFormSubmit)(e);
      }}
      isLoadingButton={isLoading}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sprint Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Sprint 1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="date_started"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date_started"
              type="date"
              {...register("date_started")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.date_started && (
              <p className="mt-1 text-sm text-red-500">
                {errors.date_started.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="date_ended"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date_ended"
              type="date"
              {...register("date_ended")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.date_ended && (
              <p className="mt-1 text-sm text-red-500">
                {errors.date_ended.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="goal"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sprint Goal
            </label>
            <textarea
              id="goal"
              {...register("goal")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              rows={3}
              placeholder="What do you want to achieve in this sprint?"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSprintModal;
