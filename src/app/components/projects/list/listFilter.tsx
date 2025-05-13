import { FaChevronDown } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { useState, useMemo, useEffect } from "react";
import { Dropdown } from "antd";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { IssueStatus } from "@libs/types/issue";
import { CiUser } from "react-icons/ci";
import Button from "@libs/app/components/general-components/button";
import { LuSearch, LuX } from "react-icons/lu";
<<<<<<< Updated upstream
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import AddProjectMemberModal from "@libs/app/components/projects/modals/addProjectMemberModal";
import UserAvatar from "../../general-components/user/UserAvatar";
=======
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import AddProjectMemberModal from "../modals/adProjectMemberModel/addProjectMemberModal";
import { ISprint } from "@libs/types";
>>>>>>> Stashed changes
interface ListFilterProps {
  setIsCreateModalOpen: (isOpen: boolean) => void;
  onSprintSelect?: (sprintId: string) => void;
}
const ListFilter = ({
  setIsCreateModalOpen,
  onSprintSelect,
}: ListFilterProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { sprints } = useProjectSprints(projectId || "");
  const { projectMembers } = useProjectMembers(projectId || "");
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<{
    status: IssueStatus[];
    sprint: string[];
  }>({
    status: [],
    sprint: [],
  });
<<<<<<< Updated upstream
  const [isOpenAddProjectMemberModal, setIsOpenAddProjectMemberModal] =
    useState(true);
  const { projectMembers } = useProjectMembers(projectId || "");
=======
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
>>>>>>> Stashed changes

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        if (!value) {
          navigate(`/projects/${projectId}/list`);
          return;
        }

        navigate(`/projects/${projectId}/list?keyword=${value}`);
      }, 500),
    [navigate, projectId],
  );

  const handleFilterChange = (
    key: keyof typeof filters,
    value: Partial<typeof filters>,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value[key] }));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.status.length > 0) {
      queryParams.set("status", filters.status.join("-"));
    }

    if (filters.sprint.length > 0) {
      queryParams.set("sprint", filters.sprint.join("-"));
    }

    const queryString = queryParams.toString();
    navigate(
      `/projects/${projectId}/list${queryString ? `?${queryString}` : ""}`,
    );
  }, [filters, navigate, projectId]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    debouncedUpdate(value);
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="flex items-center rounded-md border border-gray-300 bg-white px-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className={`relative block w-full appearance-none rounded-md py-2 text-[15px] text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
            placeholder="Search list"
          />
          {keyword ? (
            <LuX
              className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
              onClick={() => handleKeywordChange("")}
            />
          ) : (
            <LuSearch />
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-1">
          <Dropdown
            dropdownRender={() => (
              <div className="flex flex-col gap-8 rounded-lg bg-white p-4 shadow-lg">
                {/* Status Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-700">
                      Status
                    </div>
                    {filters.status.length > 0 && (
                      <IoIosClose
                        size={20}
                        className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                        onClick={() =>
                          handleFilterChange("status", {
                            status: [],
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <div
                        key={status.key}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-emerald-500"
                          checked={filters.status.includes(
                            status.key as IssueStatus,
                          )}
                          onChange={() =>
                            handleFilterChange("status", {
                              status: filters.status.includes(
                                status.key as IssueStatus,
                              )
                                ? filters.status.filter(
                                    (s) => s !== (status.key as IssueStatus),
                                  )
                                : [
                                    ...filters.status,
                                    status.key as IssueStatus,
                                  ],
                            })
                          }
                        />
                        {renderStatusCell(status.key as IssueStatus)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sprint Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-700">
                      Sprint
                    </div>
                    {filters.sprint.length > 0 && (
                      <IoIosClose
                        size={20}
                        className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                        onClick={() =>
                          handleFilterChange("sprint", {
                            sprint: [],
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sprints?.map((sprint: ISprint) => (
                      <div
                        key={sprint.id}
                        onClick={() => {
                          const newSprintIds = filters.sprint.includes(
                            sprint.id,
                          )
                            ? filters.sprint.filter((s) => s !== sprint.id)
                            : [...filters.sprint, sprint.id];
                          handleFilterChange("sprint", {
                            sprint: newSprintIds,
                          });

                          if (newSprintIds.length === 1) {
                            onSprintSelect?.(newSprintIds[0]);
                          } else {
                            onSprintSelect?.("");
                          }
                        }}
                        className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                      >
                        {sprint.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            trigger={["click"]}
          >
            <button className="cursor-pointer rounded bg-emerald-500 px-3 py-2 text-sm text-white hover:bg-emerald-600">
              Filter <FaChevronDown className="ml-1 inline" />
            </button>
          </Dropdown>
        </div>

<<<<<<< Updated upstream
        <div className="flex flex-row items-center gap-4">
          {projectMembers?.map((member) => (
            <div key={member.id}>
              <UserAvatar userId={member.user_id} isDisplayName={false} />
            </div>
          ))}
          <button
            onClick={() => setIsOpenAddProjectMemberModal(true)}
            className="cursor-pointer rounded-full border-1 border-transparent bg-gray-200 p-2 transition-all hover:border-emerald-500 hover:bg-gray-300"
          >
            <CiUser />
          </button>
=======

        <div className="flex flex-row items-center">

        {/* Member */}  
        <div className="flex flex-row items-center">
          {projectMembers?.length &&
            projectMembers.map((member, index) => (
              <div
                key={member.user_id}
                style={{
                  transform: `translateX(-${index * 12}px)`,
                }}
                className={`cursor-pointer rounded-full border-2 border-transparent p-[1px] hover:z-50 hover:border-emerald-500`}
              >
                <UserAvatar
                  userId={member.user_id}
                  size={28}
                  isDisplayName={false}
                />
              </div>
            ))}
        </div>

        {/* Add member */}
        <div
          onClick={() => setIsAddMemberModalOpen(true)}
          className="cursor-pointer rounded-full border-1 border-transparent bg-gray-200 p-2 transition-all hover:border-emerald-500 hover:bg-gray-300"
        >
          <CiUser />
>>>>>>> Stashed changes
        </div>
        </div>

      </div>

      <div className="flex items-center space-x-2">
        <Button
          className="rounded bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Issue
        </Button>
      </div>
      <AddProjectMemberModal
<<<<<<< Updated upstream
        isOpen={isOpenAddProjectMemberModal}
        onClose={() => setIsOpenAddProjectMemberModal(false)}
=======
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
>>>>>>> Stashed changes
        projectId={projectId || ""}
      />
    </div>
  );
};
export default ListFilter;
const renderStatusCell = (status: IssueStatus) => {
  return (
    <button
      className={`rounded-xl px-2 py-1 text-xs hover:cursor-pointer ${
        statusOptions.find((option) => option.key === status)?.bgColor
      } group-hover:bg-none`}
    >
      <p
        className={`text-xs ${statusOptions.find((option) => option.key === status)?.textColor} text-center font-bold`}
      >
        {status ? status.toUpperCase() : "-"}
      </p>
    </button>
  );
};

const statusOptions = [
  {
    label: "TO DO",
    key: "TO DO",
    order: 1,
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-700",
    bgColor: "bg-green-100",
  },
];
