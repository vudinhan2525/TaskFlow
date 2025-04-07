import React from "react";
import { HiCheck, HiPlus, HiRefresh, HiClock } from "react-icons/hi";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-lg p-6`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm font-medium ${textColor} opacity-80`}>{title}</p>
        <p className={`text-2xl font-semibold ${textColor} mt-2`}>{value}</p>
      </div>
      <div className={`${textColor} opacity-80`}>{icon}</div>
    </div>
  </div>
);

const MetricCards: React.FC = () => {
  const metrics = [
    {
      title: "Total Completed",
      value: 145,
      icon: <HiCheck size={24} />,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "New Issues",
      value: 23,
      icon: <HiPlus size={24} />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Recently Updated",
      value: 67,
      icon: <HiRefresh size={24} />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      title: "Due Soon",
      value: 18,
      icon: <HiClock size={24} />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricCards;
