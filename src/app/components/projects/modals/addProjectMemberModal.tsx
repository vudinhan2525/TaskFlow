import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dropdown } from "antd";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../../../store/slices/uiSlice";
import { FaAngleDown } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

interface AddProjectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

// Define the member role type
type MemberRole = "ADMIN" | "MEMBER" | "OWNER";
const MemberRoleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
    description:
      "Admin can do most things, including adding members, deleting members, and editing the project.",
  },
  {
    value: "MEMBER",
    label: "Member",
    description:
      "Member are part of the project and can view the project and the members.",
  },
  {
    value: "OWNER",
    label: "Owner",
    description: "Owner is the owner of the project and can do everything.",
  },
];

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleModal(isOpen));
  }, [dispatch, isOpen]);

  const queryClient = useQueryClient();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpenSelectOption, setIsOpenSelectOption] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const role = watch("role");

  // Mock function for adding a member - you would need to implement the actual API call
  const addMember = useMutation({
    mutationFn: (data: MemberFormData) => {
      console.log("Adding member with data:", data);

      // Mock API response
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      handleCloseModal();
    },
    onError: () => {
      toast.error("Failed to add member. Please try again.");
    },
  });

  const handleFormSubmit: SubmitHandler<MemberFormData> = (data) => {
    addMember.mutate(data);
  };

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add people"
      onClose={handleCloseModal}
      buttonContent={addMember.isPending ? "Loading..." : "Add"}
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoadingButton={addMember.isPending}
    >
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name, email or group
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("email")}
                className="w-full rounded-xs border-1 border-gray-300 p-2 text-sm outline-none hover:bg-gray-100 focus:border-2 focus:border-emerald-500 focus:bg-none"

                placeholder="e.g. Maria, maria@company.com"
              />
              <span className="absolute top-0 right-0 flex h-full items-center justify-center pr-2">
                <IoMdSearch className="text-gray-500" />
              </span>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="dropdown-container w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <div ref={dropDownRef}>
              <Dropdown
                dropdownRender={(menu) => (
                  <div
                    style={{
                      width: dropDownRef.current?.offsetWidth || "100%",
                    }}
                  >
                    {menu}
                  </div>
                )}
                menu={{
                  style: {
                    padding: "12px 0px",
                  },
                  items: MemberRoleOptions.map((option) => ({
                    style: {
                      padding: "0px",
                      width: "100%",
                    },
                    key: option.value,
                    label: (
                      <div
                        className={`flex flex-col border-l-2 border-transparent px-2 py-1 leading-5 hover:border-l-emerald-500 hover:bg-emerald-50 ${role == option.value && "border-l-emerald-500 bg-emerald-50"}`}
                      >
                        <p
                          className={`text-md font-normal ${role == option.value && "text-emerald-500"}`}
                        >
                          {option.label}
                        </p>
                        <p className="text-sm leading-4 font-normal text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    ),
                    onClick: () => {
                      setValue("role", option.value as MemberRole);
                    },
                  })),
                }}
                trigger={["click"]}
                open={isOpenSelectOption}
                onOpenChange={setIsOpenSelectOption}
              >
                <div
                  className={`relative w-full rounded-xs  p-2 text-sm font-normal text-gray-500 hover:bg-gray-100 cursor-pointer ${isOpenSelectOption ? "border-2 border-emerald-500 bg-none" : "border-1 border-gray-300"} `}
                >
                  {role}
                  <span className="absolute top-0 right-0 flex h-full items-center justify-center pr-2">
                    <FaAngleDown />
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectMemberModal;
