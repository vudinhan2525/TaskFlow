import React, { useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [_, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = React.useState("");

  useEffect(() => {
    if (searchInput) {
      setSearchParams({ text: searchInput });
    } else {
      setSearchParams({});
    }
  }, [searchInput]);
  return (
    <div className="relative flex items-center gap-2 rounded-xs px-2 py-1.5 ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-green-600">
      <Search className="h-4 w-4 text-gray-900" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search road map"
        className="h-full w-40 rounded border-none pr-3 text-base font-medium text-gray-900 outline-none"
      />
      {searchInput && (
        <button
          onClick={() => {
            setSearchInput("");
            setSearchParams({});
          }}
          className="absolute right-2 flex h-full w-4 cursor-pointer items-center justify-center text-gray-400"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
