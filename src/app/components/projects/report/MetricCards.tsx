import { UserStats } from "@libs/types/project";
import React from "react";
import { HiCheck, HiPlus, HiRefresh, HiOutlineCalendar } from "react-icons/hi";
import { motion } from "motion/react";
interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  subLabel: string;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  subLabel,
  highlight,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className={`flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
      highlight ? "bg-green-50/30 ring-1 ring-green-100" : ""
    }`}
  >
    {/* Icon container */}
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-md ${
        highlight ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
    </div>

    {/* Content */}
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-semibold text-gray-900">
        {value} {label}
      </span>
      <span className="text-xs text-gray-500">{subLabel}</span>
    </div>
  </motion.div>
);

const MetricCards = ({ data }: { data: UserStats }) => {
  const metrics = [
    {
      label: "completed",
      value: data.by_status[data.by_status.length - 1]?.count || 0,
      icon: <HiCheck size={16} />,
      subLabel: "in the last 7 days",
      highlight: true,
    },
    {
      label: "updated",
      value: data.recently_updated_count || 0,
      icon: <HiRefresh size={16} />,
      subLabel: "in the last 7 days",
    },
    {
      label: "created",
      value: data.new_issues_count || 0,
      icon: <HiPlus size={16} />,
      subLabel: "in the last 7 days",
    },
    {
      label: "due soon",
      value: 0,
      icon: <HiOutlineCalendar size={16} />,
      subLabel: "in the next 7 days",
    },
  ];

  if (!data.by_status.length) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricCards;
