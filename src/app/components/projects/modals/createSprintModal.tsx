import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSprints } from "@libs/hooks/useSprint";
import { useParams } from "react-router-dom";
import Modal from "@libs/app/components/general-components/modal";

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sprintSchema = z
  .object({
    name: z.string().min(1, "Sprint name is required"),
    dateStarted: z.string().min(1, "Start date is required"),
    dateEnded: z.string().min(1, "End date is required"),
    goal: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.dateStarted);
      const end = new Date(data.dateEnded);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["dateEnded"],
    }
  );

type SprintFormData = z.infer<typeof sprintSchema>;

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ isOpen, onClose }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { createSprint } = useSprints(projectId || "");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: "",
      dateStarted: "",
      dateEnded: "",
      goal: "",
    },
  });

  const startDate = watch("dateStarted");

  const handleFormSubmit = async (data: SprintFormData) => {
    if (!projectId) return;

    try {
      const duration = Math.ceil(
        (new Date(data.dateEnded).getTime() - new Date(data.dateStarted).getTime()) / (1000 * 60 * 60 * 24)
      );

      await createSprint.mutateAsync({
        ...data,
        projectId,
        duration,
      });
      onClose();
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create Sprint"
      onClose={onClose}
      buttonContent="Create sprint"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Sprint Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="dateStarted" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="dateStarted"
            {...register("dateStarted")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.dateStarted && <p className="text-sm text-red-500 mt-1">{errors.dateStarted.message}</p>}
        </div>

        <div>
          <label htmlFor="dateEnded" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="dateEnded"
            {...register("dateEnded")}
            min={startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.dateEnded && <p className="text-sm text-red-500 mt-1">{errors.dateEnded.message}</p>}
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Sprint Goal
          </label>
          <textarea
            id="goal"
            {...register("goal")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            placeholder="What do you want to achieve in this sprint?"
          />
          {errors.goal && <p className="text-sm text-red-500 mt-1">{errors.goal.message}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default CreateSprintModal;
