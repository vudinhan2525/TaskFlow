import { useDebounce } from "@libs/hooks/useDebounce";
import { useProjectIssues } from "@libs/hooks/useIssue";
import { useState, useEffect, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { issues } = useProjectIssues({
    keyword: debouncedSearch,
    page: 1,
    limit: 4,
  });
  console.log(issues);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for issue..."
          className="px-4 py-2 border border-gray-300 outline-[#1447e6] rounded-md w-full"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
        />
        <FaMagnifyingGlass className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
      </div>

      {isOpen && issues && issues.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // Handle issue selection here
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{issue.title}</div>
              <div className="text-sm text-gray-500">#{issue.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
