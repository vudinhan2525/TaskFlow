import { useMemo } from "react";
import DatePicker from "antd/lib/date-picker";
import { IIssue } from "@libs/types/issue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TriangleAlert, Calendar } from "lucide-react";
import { useRowPermission } from "@libs/app/context/permission.context";
import { Tooltip } from "antd/lib";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type IssueDateField =
  | "created_at"
  | "updated_at"
  | "completed_at"
  | "due_date_from"
  | "due_date_to";

function normalizeLegacyDate(value: string): string {
  return value.replace("a.m.", "AM").replace("p.m.", "PM").trim();
}

function parseIssueDate(value?: string | null): Dayjs | null {
  if (!value) return null;

  if (value.startsWith("0001-01-01")) return null;

  if (value.includes("T") && value.endsWith("Z")) {
    return dayjs.utc(value);
  }

  const normalized = normalizeLegacyDate(value);
  const parsed = dayjs(normalized, "YYYY-MM-DD h:mm:ss A", true);
  return parsed.isValid() ? parsed : null;
}

const CustomDatePicker = ({
  issue,
  projectId,
  field,
  isEditable = true,
  className,
}: {
  issue: IIssue;
  projectId: string;
  field: IssueDateField;
  isEditable?: boolean;
  className?: string;
}) => {
  const { updateIssue } = useUpdateIssue({ projectId });

  const isExpired = useMemo(() => {
    if (field !== "due_date_to" || !issue[field]) return false;
    return new Date(issue[field]) < new Date();
  }, [issue, field]);

  const handleChange = (date: Dayjs | null) => {
    // nếu là created_at thì không update
    if (field === "created_at") return;
    updateIssue({
      id: issue.id,
      data: {
        [field]: date ? date.utc().toISOString() : "null",
      },
    });
  };

  const parsedDate = useMemo(
    () => parseIssueDate(issue[field]),
    [issue, isEditable, field],
  );

  const permissionResult = useRowPermission();
  return (
    <button disabled={!permissionResult.isAllow} className={`${className} btn`}>
      <Tooltip title={permissionResult.isAllow ? "" : permissionResult.message}>
        <DatePicker
          placeholder="None"
          value={parsedDate}
          onChange={handleChange}
          disabled={field === "created_at" || !isEditable}
          suffixIcon={
            isExpired ? (
              <TriangleAlert className="text-red-800" size={16} />
            ) : (
              <Calendar className="text-gray-400" size={16} />
            )
          }
          style={{
            fontWeight: isExpired ? "bold" : "medium",
            borderColor: isExpired ? "#9f0712" : undefined,
            color: isExpired ? "#9f0712" : undefined,
          }}
        />
      </Tooltip>
    </button>
  );
};

export default CustomDatePicker;
