
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Settings2, CalendarPlus } from "lucide-react";
const RoadmapFilter = ({
  SearchRoadmap,
  setSearchParams,
  handleToggleUnscheduledWork,
  currentDate,
  goToToday,
  previousMonth,
  nextMonth
}: {
  SearchRoadmap: React.ElementType;
  setSearchParams: (params: any) => void;
  handleToggleUnscheduledWork: () => void;
  currentDate: Date;
  goToToday: () => void;
  previousMonth: () => void;
  nextMonth: () => void;
}) => {

const formatMonth = (date: Date): string => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};
  return (
    <div className="flex items-center justify-between py-1">
      {/* Left side - Filters */}
    <SearchRoadmap
      onFiltersChange={setSearchParams}
    />
      {/* <RoadmapFilter setIssues={setIssues} /> */}

      {/* Right side - Calendar Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={goToToday}
          className="text-md cursor-pointer rounded border border-gray-300 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Today
        </button>

        <div className="flex h-full items-center space-x-1 rounded border border-gray-300">
          <button
            onClick={previousMonth}
            className="cursor-pointer p-3 text-gray-600 hover:bg-gray-100"
          >
            <FaChevronLeft size={14} color="#6a7282 " />
          </button>

          <span className="text-md px-3 py-2 font-semibold text-gray-500">
            {formatMonth(currentDate)}
          </span>

          <button
            onClick={nextMonth}
            className="cursor-pointer p-3 text-gray-600 hover:bg-gray-100"
          >
            <FaChevronRight size={14} color="#6a7282 " />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleUnscheduledWork}
            className="cursor-pointer rounded border border-gray-300 p-3 text-gray-600 hover:bg-gray-100"
          >
            <CalendarPlus size={20} color="#6a7282 " />
          </button>
          <button
            // onClick={previousMonth}
            className="cursor-pointer rounded border border-gray-300 p-3 text-gray-600 hover:bg-gray-100"
          >
            <Settings2 size={20} color="#6a7282 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapFilter;
