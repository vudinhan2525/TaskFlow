import { Skeleton } from "antd";

const IssueSidebarSkeleton: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Tiêu đề sprint */}
      <div className="mb-4">
        <Skeleton.Input active style={{ inlineSize: 200, blockSize: 20 }} />
      </div>

      {/* Danh sách issue */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-md border border-none bg-white p-3 shadow-sm"
          >
            {/* Dòng đầu: issue key + summary */}
            <div className="flex items-center justify-between mb-2">
              <Skeleton.Input active size="small" style={{ inlineSize: 100 }} />
              <Skeleton.Avatar active size="small" shape="circle" />
            </div>

            {/* Dòng mô tả */}
            <Skeleton.Input active size="small" style={{ inlineSize: "80%" }} />

            {/* Tag + footer */}
            <div className="mt-3 flex items-center gap-2">
              <Skeleton.Button active size="small" shape="round" />
              <Skeleton.Button active size="small" shape="round" />
              <Skeleton.Input
                active
                size="small"
                style={{ inlineSize: 60 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueSidebarSkeleton;
