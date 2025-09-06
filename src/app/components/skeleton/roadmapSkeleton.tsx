import React from "react";
import { Skeleton } from "antd";
import {  List, BarChart } from "lucide-react";

const RoadmapSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-4">

      {/* Content */}
      <div className="space-y-4">
        {/* Fake Calendar / Table */}
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 30 }).map((_, idx) => (
            <Skeleton.Input
              key={idx}
              active
              size="large"
              className="!h-20 !w-full rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Sidebar Placeholder */}
      <div className="flex items-center space-x-2 pt-6">
        <List className="h-5 w-5 text-gray-400" />
        <BarChart className="h-5 w-5 text-gray-400" />
        <Skeleton.Input active size="small" className="!h-5 !w-32 rounded-md" />
      </div>
    </div>
  );
};

export default RoadmapSkeleton;
