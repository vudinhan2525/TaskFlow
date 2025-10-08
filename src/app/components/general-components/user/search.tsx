import { useDebounce } from "@libs/hooks/common/useDebounce";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
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
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
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
          className="w-full rounded-md border border-gray-300 px-4 py-2 outline-[#1447e6]"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
        />
        <FaMagnifyingGlass className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && issues && issues.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
