import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { IssueStatus } from "@libs/types/issue";
import { CiUser } from "react-icons/ci";
import Button from "@libs/app/components/general-components/button";
import { LuSearch, LuX } from "react-icons/lu";
import ListFilterDropDown from "./listFilter/ListFilterDropDown";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import AddProjectMemberModal from "../modals/adProjectMemberModel/addProjectMemberModal";
interface ListFilterProps {
  setIsCreateModalOpen: (isOpen: boolean) => void;
  onSprintSelect?: (sprintId: string) => void;
}
const ListFilter = ({
  setIsCreateModalOpen,
  onSprintSelect,
}: ListFilterProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projectMembers } = useProjectMembers(projectId || "");
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<{
    status: IssueStatus[];
    sprint: string[];
    assignee: string[];
    reporter: string[];
  }>({
    status: [],
    sprint: [],
    assignee: [],
    reporter: [],
  });

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
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

        <ListFilterDropDown
          filters={filters}
          handleFilterChange={handleFilterChange}
          projectId={projectId || ""}
          onSprintSelect={onSprintSelect}
        />

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
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          projectId={projectId || ""}
        />
      </div>
    </div>
  );
};
export default ListFilter;
