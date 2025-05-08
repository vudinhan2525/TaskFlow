import { FaChevronDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { useState, useMemo, useEffect } from "react";
import { Dropdown } from "antd";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { IssueStatus } from "@libs/types/issue";
import { CiUser } from "react-icons/ci";
interface ListFilterProps {
  setIsCreateModalOpen: (isOpen: boolean) => void;
  onSprintSelect?: (sprintId: string) => void;
}
const ListFilter = ({ setIsCreateModalOpen, onSprintSelect }: ListFilterProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { sprints } = useProjectSprints(projectId || "");
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<{
    status: IssueStatus[];
    sprint: string[];
  }>({
    status: [],
    sprint: [],
  });

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

  const handleFilterChange = (key: keyof typeof filters, value: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, [key]: value[key] }));
    navigate(`/projects/${projectId}/list?${key}=${value[key]}`);
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
        <div className="flex items-center justify-between rounded border border-gray-300 px-4 outline-none focus-within:ring-1 focus-within:ring-emerald-500">
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Search list"
            className="flex-1 py-1 text-sm focus:outline-none"
          />

          {keyword ? (
            <IoIosClose
              className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
              onClick={() => handleKeywordChange("")}
            />
          ) : (
            <CiSearch />
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
                    <p className="text-sm font-medium text-gray-700">Status</p>
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
                          checked={filters.status.includes(status.key as IssueStatus)}
                          onChange={() =>
                            handleFilterChange("status", {
                              status: filters.status.includes(status.key as IssueStatus)
                                ? filters.status.filter((s) => s !== (status.key as IssueStatus))
                                : [...filters.status, status.key as IssueStatus],
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
                    <p className="text-sm font-medium text-gray-700">Sprint</p>
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
                    {sprints?.map((sprint) => (
                      <div
                        key={sprint.id}
                        onClick={() => {
                          const newSprintIds = filters.sprint.includes(sprint.id)
                            ? filters.sprint.filter((s) => s !== sprint.id)
                            : [...filters.sprint, sprint.id];
                          handleFilterChange("sprint", { sprint: newSprintIds });

                          if (newSprintIds.length === 1) {
                            onSprintSelect?.(newSprintIds[0]);
                          } else {
                            onSprintSelect?.("");
                          }
                        }}
                        className="px-3 py-1 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm"
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
            <button className="cursor-pointer rounded bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600">
              Filter <FaChevronDown className="ml-1 inline" />
            </button>
          </Dropdown>
        </div>

        <div className="cursor-pointer rounded-full border-3 border-transparent bg-gray-200 p-2 hover:border-emerald-500 hover:bg-gray-500">
          <CiUser/>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="rounded bg-emerald-500 px-3 py-1 text-sm text-white hover:bg-emerald-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Issue
        </button>
      </div>
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
        className={`text-xs 
  ${statusOptions.find((option) => option.key === status)?.textColor} text-center font-bold
  `}
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
