import ColumnDropdown from "./columnDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { IColumn } from "@libs/types/project";
import StatusBadge from "../badge/statusBadge";

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

  const currentColumn = columns.find((col) => col.id === column.id);

  return (
    <ColumnDropdown
      items={columns.map((column, index) => {
        return {
          value: column.name,
          key: column.id,
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: <StatusBadge column={column} index={index} className="p-2" />,
          onClick: () => {
            handleChangeStatus(column.id);
          },
        };
      })}
      currentItem={undefined}
      children={
        <StatusBadge
          column={currentColumn || column}
          index={columns.findIndex((col) => col.id === column.id)}
        />
      }
    />
  );
};

export default StatusDropdown;
