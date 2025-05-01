import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import IssueCard from "@libs/app/components/projects/board/issueCard";
import DeleteColumnModal from "@libs/app/components/projects/modals/deleteColumnModal";
import RenameColumnModal from "@libs/app/components/projects/modals/renameColumnModal";
import { useUpdateColumn, useUpdateProjectOrderColumn } from "@libs/hooks/useProject";
import { IIssue } from "@libs/types/issue";
import { IColumn } from "@libs/types/project";
import { Popover } from "antd";
import { ReactNode, useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";

const Issue = ({ issue, isDragging }: { issue: IIssue; isDragging?: boolean }) => {
  return <IssueCard issue={issue} isDragging={isDragging} />;
};

const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: issue.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <Issue issue={issue} />
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

  const handleMove = (direction: "left" | "right") => {
    const currentIndex = columns.findIndex((c) => c.id === column.id);
    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const newColumns = [...columns];
    [newColumns[currentIndex], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[currentIndex]];

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
    // Only allow deletion if column has no issues
    if (column.issues.length > 0) {
      alert("Cannot delete column with issues. Please move all issues to another column first.");
      setShowDeleteColumnModal(false);
      return;
    }

    const newColumns = columns.filter((col) => col.id !== column.id);

    // Reorder remaining columns
    const reordered = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setColumns(reordered);
    setShowDeleteColumnModal(false);

    // Update column order on server
    if (projectId) {
      updateOrderColumn({
        projectId: projectId,
        columns: reordered.map((col) => ({ id: col.id, order: col.order + 1 })),
      });
    }
  };
  const content: ReactNode = (
    <div className="">
      <div onClick={() => handleMove("left")} className="px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
        Move to left
      </div>
      <div onClick={() => handleMove("right")} className="px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
        Move to right
      </div>
      <div
        onClick={() => {
          setShowRenameColumnModal(true);
          setPopoverOpen(false);
        }}
        className="px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer"
      >
        Change column name
      </div>
      <div
        onClick={() => {
          setShowDeleteColumnModal(true);
          setPopoverOpen(false);
        }}
        className="px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer"
      >
        Delete column
      </div>
    </div>
  );
  return (
    <div ref={setNodeRef} className="w-80 p-2 mx-2 bg-gray-100 rounded">
      <div className="flex p-2  mb-3  justify-between items-center">
        <h2 className="text-lg font-bold">{column.name}</h2>
        <Popover content={content} trigger="click" placement="bottomRight" open={popoverOpen} onOpenChange={setPopoverOpen}>
          <div className="p-2 cursor-pointer hover:bg-gray-200 transition-all rounded-md">
            <LuEllipsisVertical />
          </div>
        </Popover>
      </div>
      <SortableContext items={column.issues.map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-40">
          {column.issues.map((issue) => {
            if (issue.parent_id === "") {
              return <SortableIssue key={issue.id} issue={issue} />;
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
