import React from "react";
import { Skeleton } from "antd";

const BacklogPageSkeleton: React.FC = () => {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton.Input active size="large" style={{ inlineSize: 200 }} />
        <Skeleton.Button active size="large" style={{ inlineSize: 120 }} />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-4">
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
      </div>

      <div className="flex flex-1 gap-4">
        {/* Sidebar */}

        {/* Main backlog list */}
        <div className="flex flex-1 flex-col gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
            >
              <Skeleton.Avatar active size="small" shape="circle" />
              <div className="flex flex-1 flex-row items-center gap-4">
                <Skeleton.Input active size="small" style={{ inlineSize: "60%" }} />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ inlineSize: "30%" }}
                />
              </div>
              <Skeleton.Button active size="small" style={{ inlineSize: 50 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BacklogPageSkeleton;
