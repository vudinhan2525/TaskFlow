import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface AddProjectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

// Define the member role type
type MemberRole = "ADMIN" | "MEMBER" | "OWNER";

const memberSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["ADMIN", "MEMBER", "OWNER"] as const),
});

type MemberFormData = z.infer<typeof memberSchema>;

const AddProjectMemberModal: React.FC<AddProjectMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  // Mock function for adding a member - you would need to implement the actual API call
  const addMember = useMutation({
    mutationFn: (data: MemberFormData) => {
      // In a real implementation, you would:
      // 1. Search for user by email
      // 2. Add the user to the project with the selected role
      console.log('Adding member with data:', data);
      
      // Mock API response
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to add member. Please try again.");
    },
  });

  const handleFormSubmit: SubmitHandler<MemberFormData> = (data) => {
    addMember.mutate(data);
  };

  const role = watch("role");

  if (!isOpen) return null;

  return (
    <Modal
      title="Add people"
      onClose={onClose}
      buttonContent={addMember.isPending ? "Loading..." : "Add"}
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoadingButton={addMember.isPending}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name, email or group
            </label>
            <input
              type="text"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Maria, maria@company.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <DropdownAntd
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "MEMBER", label: "Member" },
                { value: "OWNER", label: "Owner" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">{role === "MEMBER" ? "Member" : role}</div>}
              onClickItem={(option) =>
                setValue("role", option.value as MemberRole)
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectMemberModal;
