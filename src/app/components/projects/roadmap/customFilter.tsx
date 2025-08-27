import React from "react";
import { ChevronDown, Search, X } from "lucide-react";

const CustomFilter = ({ title }: { title: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    inputRef.current?.focus();
  };

  // Sample options for demonstration
  const options = [
    { id: 'done', label: 'DONE', color: 'bg-green-100 text-green-800' },
    { id: 'in-progress', label: 'IN PROGRESS', color: 'bg-blue-100 text-blue-800' },
    { id: 'in-review', label: 'IN REVIEW', color: 'bg-purple-100 text-purple-800' },
    { id: 'to-do', label: 'TO DO', color: 'bg-gray-100 text-gray-800' },
  ];

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggleOpen}
        className={`
          inline-flex items-center gap-2 px-2 py-1 text-sm font-medium
          border rounded-sm transition-all duration-200 cursor-pointer
          ${isOpen 
            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <span className="text-lg">{title}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {/* Search Header */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={`Search ${title.toLowerCase()}`}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                <div className="py-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={option.id}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label 
                        htmlFor={option.id}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${option.color}`}>
                          {option.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-8 text-center text-gray-500 text-sm">
                  No {title.toLowerCase()} found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500">
                {filteredOptions.length} of {options.length}
              </span>
              <div className="flex gap-2">
                <button className="text-xs text-gray-600 hover:text-gray-800">
                  Clear all
                </button>
                <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CustomFilter;