import { IColumn } from "@libs/types/project";
const RenderStatusCell = ({ column }: { column: IColumn }) => {
  return (
    <button
      className={`rounded-sm  p-1 py-0.5 hover:cursor-pointer ${
        statusOptions.find((option) => option.key === column.name)?.bgColor
      } group-hover:bg-none`}
    >
      <p
        className={`text-xs ${statusOptions.find((option) => option.key === column.name)?.textColor} text-center font-bold`}
      >
        {column.name && column.name.toUpperCase() }
      </p>
    </button>
  );
};

export default RenderStatusCell;

const statusOptions = [
  {
    label: "TO DO",
    key: "TO DO",
    order: 1,
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-800",
    bgColor: "bg-green-100",
  },
];
