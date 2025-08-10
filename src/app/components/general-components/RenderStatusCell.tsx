import { IColumn } from "@libs/types/project";

const statusColors = [
  {
    order: 1,
    textColor: "text-gray-600",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
  },
  {
    order: 2,
    textColor: "text-blue-600",
    dotColor: "bg-blue-400",
    bgColor: "bg-blue-100",
  },
  {
    order: 3,
    textColor: "text-green-600",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100",
  },
  {
    order: 4,
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-400",
    bgColor: "bg-yellow-100",
  },
  {
    order: 5,
    textColor: "text-red-600",
    dotColor: "bg-red-400",
    bgColor: "bg-red-100",
  },
  {
    order: 6,
    textColor: "text-purple-600",
    dotColor: "bg-purple-400",
    bgColor: "bg-purple-100",
  },
  {
    order: 7,
    textColor: "text-teal-600",
    dotColor: "bg-teal-400",
    bgColor: "bg-teal-100",
  },
  {
    order: 8,
    textColor: "text-indigo-600",
    dotColor: "bg-indigo-400",
    bgColor: "bg-indigo-100",
  },
];

const sizeClasses = {
  small: {
    button: "px-2 py-0.5 text-xs",
    dot: "w-2 h-2",
  },
  medium: {
    button: "px-3 py-1 text-sm",
    dot: "w-2.5 h-2.5",
  },
  large: {
    button: "px-4 py-1.5 text-base",
    dot: "w-3 h-3",
  },
};

const RenderStatusCell = ({
  column,
  index,
  size = "small",
}: {
  column: IColumn;
  index?: number;
  size?: "small" | "medium" | "large";
}) => {
  if (!column) return <></>;

  const selectedStatus =
    typeof index === "number"
      ? statusColors[
          ((index % statusColors.length) + statusColors.length) %
            statusColors.length
        ]
      : statusColors[1];

  const currentSize = sizeClasses[size];

  return (
    <button
      className={`rounded-2xl hover:cursor-pointer ${selectedStatus.bgColor} flex items-center gap-1 group-hover:bg-none ${currentSize.button}`}
    >
      <div
        className={`rounded-full ${selectedStatus.dotColor} ${currentSize.dot}`}
      ></div>
      <p className={`font-semibold ${selectedStatus.textColor}`}>
        {column.name ? column.name.toUpperCase() : ""}
      </p>
    </button>
  );
};

export default RenderStatusCell;
