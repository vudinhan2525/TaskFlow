import { IColumn } from "@libs/types/project";
const RenderStatusCell = ({ column }: { column: IColumn }) => {
  const selectedStatus = statusOptions.find((option) => option.key === column.name) || statusOptions[1];
  return (
    <button
      className={`rounded-2xl p-1 px-2 py-0.5 hover:cursor-pointer ${
        selectedStatus.bgColor
      } flex items-center  group-hover:bg-none gap-1`}
    >
      <div
        className={`rounded-full p-0.5 ${selectedStatus.dotColor} `}
      ></div>
      <p
        className={`text-xs ${selectedStatus.textColor} text-center font-semibold`}
      >
        {column.name && column.name.toUpperCase()}
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
    textColor: "text-gray-600",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-600",
    dotColor: "bg-blue-400",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-600",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100",
  },
];
