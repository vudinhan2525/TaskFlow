import { Skeleton, Card } from "antd";

const KanbanBoardSkeleton = () => {
  const columns = ["To Do", "In Progress", "Review", "Done"];

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton.Input active size="large" style={{ inlineSize: 200 }} />
        <Skeleton.Button active size="large" style={{ inlineSize: 120 }} />
      </div>

      {/* Filter bar */}
      <div className="flex items-center space-x-4">
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
        <Skeleton.Input active size="small" style={{ inlineSize: 150 }} />
      </div>

      <div className="flex space-x-4 overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col}
            className="flex min-w-[260px] flex-1 flex-col rounded-lg border border-gray-200 bg-gray-50"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-3">
              <Skeleton.Input active size="small" style={{inlineSize: 100 }} />
              <Skeleton.Button active size="small" />
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3 p-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="rounded-md border border-gray-100 shadow-sm"
                  style={{
                    padding: "12px",
                  }}
                >
                  <div className="space-y-2">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{inlineSize: "80%" }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{inlineSize: "60%" }}
                    />
                    <div className="flex items-center space-x-2">
                      <Skeleton.Avatar active size="small" />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{inlineSize: 50 }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoardSkeleton;
