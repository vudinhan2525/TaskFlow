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

const ListFilter = ({
  setIsCreateModalOpen,
}: {
  setIsCreateModalOpen: (isOpen: boolean) => void;
}) => {
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
    [navigate, projectId]
  );

  const handleFilterChange = (
    key: keyof typeof filters,
    value: Partial<typeof filters>
  ) => {
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
      `/projects/${projectId}/list${queryString ? `?${queryString}` : ""}`
    );
    console.log(queryString);
  }, [filters, navigate, projectId]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    debouncedUpdate(value);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="flex items-center justify-between border border-gray-300 rounded outline-none focus-within:ring-1 focus-within:ring-emerald-500 px-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Search list"
            className=" py-1 text-sm flex-1 focus:outline-none"
          />

          {keyword ? (
            <IoIosClose
              className="text-gray-500 cursor-pointer hover:scale-125 transition-all duration-100"
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
              <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-8">
                {/* Status Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      Status
                    </p>
                    {filters.status.length > 0 && (
                      <IoIosClose
                        size={20}
                        className="text-gray-500 cursor-pointer hover:scale-125 transition-all duration-100"
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
                        className="px-3 py-1 rounded-full cursor-pointer border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-emerald-500"
                          checked={filters.status.includes(
                            status.key as IssueStatus
                          )}
                          onChange={() =>
                            handleFilterChange("status", {
                              status: filters.status.includes(
                                status.key as IssueStatus
                              )
                                ? filters.status.filter(
                                    (s) => s !== (status.key as IssueStatus)
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
                    <p className="text-sm font-medium text-gray-700">Sprint</p>
                    {filters.sprint.length > 0 && (
                      <IoIosClose
                        size={20}
                        className="text-gray-500 cursor-pointer hover:scale-125 transition-all duration-100"
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
                        onClick={() =>
                          handleFilterChange("sprint", {
                            sprint: filters.sprint.includes(sprint.id)
                              ? filters.sprint.filter((s) => s !== sprint.id)
                              : [...filters.sprint, sprint.id],
                          })
                        }
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
            <button className="px-3 py-1 text-sm text-white bg-emerald-500 rounded hover:bg-emerald-600 cursor-pointer">
              Filter <FaChevronDown className="inline ml-1" />
            </button>
          </Dropdown>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 text-sm text-white bg-emerald-500 rounded hover:bg-emerald-600"
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
      className={`text-xs rounded-xl px-2 py-1 hover:cursor-pointer ${
        statusOptions.find((option) => option.key === status)?.bgColor
      } group-hover:bg-none`}
    >
      <p
        className={`text-xs 
  ${
    statusOptions.find((option) => option.key === status)?.textColor
  } text-center font-bold
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
