import React from "react";
import { FaPlus } from "react-icons/fa";
import { RotateCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface TableFooterProps {
  selectedRowKeys: React.Key[];
  onCreateClick: () => void;
  visibleCount: number;
  totalCount: number;
}

const TableFooter = ({
  selectedRowKeys,
  onCreateClick,
  visibleCount,
  totalCount,
}: TableFooterProps) => {
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between bg-gray-100 p-2 px-4">
      <div className="flex items-center gap-3">
        {selectedRowKeys.length > 0 && (
          <span className="text-sm text-gray-600">
            {selectedRowKeys.length} selected
          </span>
        )}
        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-transparent px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <FaPlus className="h-3 w-3 text-gray-700" />
          Create
        </button>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>
          {visibleCount} of {totalCount}
        </span>
        <button
          type="button"
          aria-label="Refresh"
          onClick={() =>
            queryClient.invalidateQueries({
              predicate: (q) =>
                Array.isArray(q.queryKey) && q.queryKey[0] === "issues",
            })
          }
          className="rounded p-1 hover:bg-gray-100"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TableFooter;
