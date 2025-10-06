import ColumnDropdown from "./columnDropdown";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { IColumn } from "@libs/types/project";
import StatusBadge from "../badge/statusBadge";
import { memo, useState } from "react";

const StatusDropdown = ({
  projectId,
  issueId,
  column,
}: {
  projectId: string;
  issueId: string;
  column: IColumn;
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const { columns } = useProjectColumns(
    { project_id: projectId },
    isOpenDropdown,
  );
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
      items={columns.map((column) => {
        return {
          value: column.name,
          key: column.id,
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: <StatusBadge column={column} className="p-2" />,
          onClick: () => {
            handleChangeStatus(column.id);
          },
        };
      })}
      currentItem={undefined}
      children={<StatusBadge column={column} />}
      setIsOpenDropdown={setIsOpenDropdown}
    />
  );
};

export default memo(StatusDropdown);
