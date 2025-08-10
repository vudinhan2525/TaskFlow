import RenderStatusCell from "../RenderStatusCell";
import ColumnDropdown from "./columnDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { IColumn } from "@libs/types/project";

const StatusDropdown = ({
  projectId,
  issueId,
  column,
}: {
  projectId: string;
  issueId: string;
  column: IColumn;
}) => {
  const { columns } = useProjectColumns(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeStatus = (updatedStatus: string) => {
    updateIssueAsync({
      id: issueId,
      data: {
        column_id: updatedStatus,
      },
    });
  };
  return (
    <ColumnDropdown
      items={columns.map((column, index) => ({
        value: column.name,
        style: {
          padding: 0,
          background: "white",
        },
        label: (
          <div
            key={column.id}
            className={`flex items-center p-2 hover:border-l-2 hover:border-emerald-500 hover:bg-gray-300`}
          >
            <RenderStatusCell column={column} index={index} />
          </div>
        ),
        key: column?.id,
        onClick: () => handleChangeStatus(column?.id),
      }))}
      children={
        <div className="flex justify-start px-2">
          <RenderStatusCell
            column={column}
            index={columns.findIndex((col) => col.id === column.id)}
          />
        </div>
      }
      currentItem={column?.name}
    />
  );
};

export default StatusDropdown;
