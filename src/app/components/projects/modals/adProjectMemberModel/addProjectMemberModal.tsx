import React, { useEffect, useState } from "react";
import Modal from "@libs/app/components/general-components/modal/modal";
import "./addProjectMemberModal.css";
import { Dropdown, Select, Spin } from "antd";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../../../../store/slices/uiSlice";
import { FaAngleDown } from "react-icons/fa";
import { useDebounce } from "@libs/hooks/useDebounce";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { useAddProjectMember } from "@libs/hooks/useProjectMember";
import { useListUser } from "@libs/hooks/useUser";
import { toast } from "react-toastify";
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

const AddProjectMemberModal: React.FC<AddProjectMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleModal(isOpen));
  }, [dispatch, isOpen]);

  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpenSelectOption, setIsOpenSelectOption] = useState(false);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const [role, setRole] = useState<MemberRole>("MEMBER");
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const { users, isLoading } = useListUser(debouncedKeyword);
  const {  addProjectMemberAsync, isLoading: isAddLoading } = useAddProjectMember(projectId);

  const handleAddProjectMember= async ()=>{
    if(value.length === 0){ 
      toast.error("Please select a user");
      return
    }
    addProjectMemberAsync({
      project_id: projectId,
      user_id: value[0],
      role: role,
    })
  }

  if (!isOpen) return null; 

  return (
    <Modal
      title="Add people"
      onClose={onClose}
      buttonContent={"Add"}
      onSubmit={handleAddProjectMember}
      isLoadingButton={isAddLoading}
    >
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name, email or group
            </label>
            <div className="relative">
              <Select
                className={`custom-select w-full hover:bg-gray-100 ${isFocus ? "border-2 border-emerald-500" : "border-1 border-gray-300"}`}
                mode="multiple"
                searchValue={keyword}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                showSearch={true}
                onChange={(value) => {
                  setValue(value);
                  setIsFocus(false);
                }}
                loading={isLoading}
                notFoundContent={
                  isLoading ? (
                    <div className="flex h-full items-center justify-center border-emerald-500">
                      <Spin />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-gray-500">
                      {keyword.length > 0 ? "No users found" : "Start typing to search"}
                    </div>
                  )
                }
                filterOption={false}
                options={
                  keyword.length
                    ? users?.map((user) => ({
                        label: (
                          <div>
                            <UserAvatar userId={user.id} isDisplayName={true} />
                          </div>
                        ),
                        value: user.id,
                      }))
                    : []
                }
                onSearch={(value) => setKeyword(value)}
                placeholder="e.g. Maria, maria@company.com"
              />
            </div>
          </div>

          <div className="w-full">
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
                      setRole(option.value as MemberRole);
                    },
                  })),
                }}
                trigger={["click"]}
                open={isOpenSelectOption}
                onOpenChange={setIsOpenSelectOption}
              >
                <div
                  className={`relative w-full cursor-pointer rounded-xs p-2 text-sm font-normal text-gray-500 hover:bg-gray-100 ${isOpenSelectOption ? "border-2 border-emerald-500 bg-none" : "border-1 border-gray-300"} `}
                >
                  {role}
                  <span className="absolute top-0 right-0 flex h-full items-center justify-center pr-2">
                    <FaAngleDown />
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddProjectMemberModal;
