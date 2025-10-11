import { useState } from "react";
import { Upload } from "lucide-react";
import { Popover, Tooltip } from "antd";
import { LuTableProperties, LuTable } from "react-icons/lu";
import { exportCSV, exportExcel } from "@libs/utils/file";
import { IIssue } from "@libs/types/issue";
import { GetIssuesParams } from "@libs/types/issue";
import PageFilter from "@libs/app/components/general-components/pageFilter";

const items = [
  { key: "export_csv", label: "Export CSV (all fields)" },
  { key: "export_excel", label: "Export Excel (all fields)" },
];

interface ListPageHeaderProps {
  issues: IIssue[];
  filters: GetIssuesParams;
  setFilter: (filter: GetIssuesParams) => void;
  listMode: "list" | "detail";
  setListMode: (mode: "list" | "detail") => void;
}

const ListPageHeader = ({
  filters,
  setFilter,
  issues,
  listMode,
  setListMode,
}: ListPageHeaderProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleExport = (key: string) => {
    switch (key) {
      case "export_csv":
        exportCSV(issues || []);
        break;
      case "export_excel":
        exportExcel(issues || []);
        break;
      default:
    }
    setIsPopoverOpen(false);
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <PageFilter
        initialFilters={filters}
        onFiltersChange={(filter) => {
          setFilter(filter as GetIssuesParams);
        }}
      />

      <div className="flex items-center gap-6 pr-4">
        <Popover
          content={
            <div className="flex flex-col rounded-md bg-white py-2 shadow-lg">
              {items.map((item) => (
                <span
                  key={item.key}
                  onClick={() => handleExport(item.key)}
                  className="cursor-pointer rounded-xs p-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </span>
              ))}
            </div>
          }
          placement="bottomLeft"
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={(bool) => setIsPopoverOpen(bool)}
        >
          <button
            className={`cursor-pointer rounded-sm border border-gray-300 p-2 transition-all duration-100 hover:bg-gray-300 ${
              isPopoverOpen ? "border-green-500 bg-green-100" : ""
            }`}
          >
            <Upload
              className={`text-md text-gray-700 ${
                isPopoverOpen ? "text-emerald-500" : ""
              }`}
              size={16}
            />
          </button>
        </Popover>

        <div className="flex items-center gap-1">
          <Tooltip title="List Table" className="text-xs text-gray-700">
            <button
              className={`cursor-pointer rounded-sm border border-gray-300 p-2 transition-all duration-100 hover:bg-gray-300 ${
                listMode === "list" ? "border-green-500 bg-green-100" : ""
              }`}
              onClick={() => {
                setListMode("list");
                setFilter({
                  ...filters,
                  parent_ids: ["NULL"],
                });
              }}
            >
              <LuTable
                className={`text-md text-gray-700 ${
                  listMode === "list" ? "text-emerald-500" : ""
                }`}
                size={16}
              />
            </button>
          </Tooltip>

          <Tooltip title="Detail View">
            <button
              className={`cursor-pointer rounded-sm border border-gray-300 p-2 transition-all duration-100 hover:bg-gray-300 ${
                listMode === "detail" ? "border-green-500 bg-green-100" : ""
              }`}
              onClick={() => {
                setListMode("detail");
                setFilter({
                  ...filters,
                  parent_ids: [],
                });
              }}
            >
              <LuTableProperties
                className={`text-md text-gray-700 ${
                  listMode === "detail" ? "text-emerald-500" : ""
                }`}
                size={16}
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ListPageHeader;
