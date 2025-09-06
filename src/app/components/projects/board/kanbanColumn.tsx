import {
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import IssueCard from "@libs/app/components/projects/board/issueCard";
import DeleteColumnModal from "@libs/app/components/projects/modals/deleteColumnModal";
import RenameColumnModal from "@libs/app/components/projects/modals/renameColumnModal";
import {
  useDeleteColumn,
  useUpdateColumn,
  useUpdateProjectOrderColumn,
} from "@libs/hooks/useProject";
import { IIssue } from "@libs/types/issue";
import { IColumn } from "@libs/types/project";
import { Popover } from "antd";
import { ReactNode, useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import type { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";

const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: issue.id,
      // transition: {
      //   duration:50, // milliseconds
      //   easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      // },
    });
  const isDragging = attributes["aria-pressed"];
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "default",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <IssueCard issue={issue} isDragging={isDragging} />
    </div>
  );
};

export const KanbanColumn = ({
  columns,
  column,
  setColumns,
  projectId,
}: {
  columns: IColumn[];
  column: IColumn;
  projectId: string | undefined;
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>;
}) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });
  const { updateOrderColumn } = useUpdateProjectOrderColumn();
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { updateColumn } = useUpdateColumn();
  const { deleteColumn } = useDeleteColumn((deletedColumnId) => {
    // Xử lý sau khi xóa thành công
    const newColumns = columns
      .filter((col) => col.id !== deletedColumnId)
      .map((col, index) => ({
        ...col,
        order: index,
      }));

    setColumns(newColumns);
  });
  const handleMove = (direction: "left" | "right") => {
    const currentIndex = columns.findIndex((c) => c.id === column.id);
    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const newColumns = [...columns];
    [newColumns[currentIndex], newColumns[targetIndex]] = [
      newColumns[targetIndex],
      newColumns[currentIndex],
    ];

    const reordered = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setColumns(reordered);

    updateOrderColumn({
      projectId: projectId || "",
      columns: reordered.map((col) => ({ id: col.id, order: col.order + 1 })),
    });
    setPopoverOpen(false);
  };
  const handleRenameColumn = (newName: string) => {
    const newColumns = columns.map((col) => {
      if (col.id === column.id) {
        return { ...col, name: newName };
      }
      return col;
    });
    setColumns(newColumns);
    setShowRenameColumnModal(false);
    if (projectId) {
      updateColumn({
        column_id: column.id,
        name: newName,
        projectId: projectId,
      });
    }
  };
  const handleDeleteColumn = () => {
    // Kiểm tra nếu còn issue thì không xó
    setShowDeleteColumnModal(false);

    if (projectId) {
      deleteColumn({ column_id: column.id });
    }
  };
  const content: ReactNode = (
    <div className="">
      <div
        onClick={() => handleMove("left")}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Move to left
      </div>
      <div
        onClick={() => handleMove("right")}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Move to right
      </div>
      <div
        onClick={() => {
          setShowRenameColumnModal(true);
          setPopoverOpen(false);
        }}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Change column name
      </div>
      <div
        onClick={() => {
          setShowDeleteColumnModal(true);
          setPopoverOpen(false);
        }}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Delete column
      </div>
    </div>
  );
  return (
    <div ref={setNodeRef} className="mx-2 w-80 rounded bg-gray-100 p-2">
      <div className="mb-3 flex items-center justify-between p-2">
        <h2 className="text-base font-thin text-gray-500">{column.name}</h2>
        <Popover
          content={content}
          trigger="click"
          placement="bottomRight"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
        >
          <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-gray-200">
            <LuEllipsisVertical />
          </div>
        </Popover>
      </div>
      <SortableContext
        items={column.issues.map((issue) => issue.id)}
        // strategy={verticalListSortingStrategy}
      >
        <div className="max-h-[600px] min-h-40 overflow-auto">
          {column.issues.map((issue) => {
            if (issue.parent_id === "") {
              const newColumn: IColumn = { ...column };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              delete (newColumn as any).issues;
              const newIssue: IIssue = { ...issue, column: newColumn };

              return <SortableIssue key={issue.id} issue={newIssue} />;
            }
          })}
        </div>
      </SortableContext>
      {showRenameColumnModal && (
        <RenameColumnModal
          onClose={() => {
            setShowRenameColumnModal(false);
          }}
          onSubmit={handleRenameColumn}
        />
      )}
      {showDeleteColumnModal && (
        <DeleteColumnModal
          onClose={() => {
            setShowDeleteColumnModal(false);
          }}
          onSubmit={handleDeleteColumn}
        />
      )}
    </div>
  );
};
