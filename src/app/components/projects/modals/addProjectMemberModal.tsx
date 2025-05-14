import React from "react";
import { projectMembers } from "@libs/apis/projectMember";
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

  const addMember = useMutation({
    mutationFn: async (data: MemberFormData) => {
      // First get the user by email
      const userResponse = await projectMembers.getUserByEmail(data.email);
      if (!userResponse.data.data) {
        throw new Error("User not found");
      }

      // Then add the user to the project
      const userId = userResponse.data.data.id;
      return projectMembers.add(projectId, userId, data.role);
    },
    onSuccess: () => {
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });
      reset();
      onClose();
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add member. Please try again.");
      }
    },
  });

  const handleFormSubmit: SubmitHandler<MemberFormData> = (data) => {
    addMember.mutate(data);
  };

  const role = watch("role");

  if (!isOpen) return null;

  return (
    <Modal
      title="Invite people"
      onClose={onClose}
      buttonContent={addMember.isPending ? "Sending..." : "Send Invitation"}
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoadingButton={addMember.isPending}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            An invitation will be sent to the user's email. They will need to accept it to join the project.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name, email or group
            </label>
            <input
              type="text"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
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
              className={addMember.isPending ? "opacity-50 cursor-not-allowed" : ""}
              parent={
                <div className={`w-full font-medium ${addMember.isPending ? "text-gray-400" : ""}`}>
                  {role === "MEMBER" ? "Member" : role}
                </div>
              }
              onClickItem={(option) => {
                if (!addMember.isPending) {
                  setValue("role", option.value as MemberRole);
                }
              }}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectMemberModal;
