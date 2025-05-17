import { IIssue } from "@libs/types/issue";
import { useIssue } from "@libs/hooks/useIssue";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const ColumnInputFiled = ({
  issueId,
  field,
  inputType = "text",
  handleChangeCellValue,
}: {
  issueId: string;
  field: keyof IIssue;
  inputType?: "text" | "number";
  handleChangeCellValue: (
    id: string,
    field: keyof IIssue,
    value: string,
  ) => void;
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { issue } = useIssue(projectId || "", issueId);
  const [newValue, setNewValue] = useState(
    issue?.[field] || (inputType === "number" ? 0 : ""),
  );
  useEffect(() => {
    setNewValue(issue?.[field] || (inputType === "number" ? 0 : ""));
  }, [issue, field, inputType]);
  return (
    <input
      onChange={(e) => setNewValue(e.target.value)}
      type={inputType}
      onBlur={(e) => {
        if (e.target.value !== issue?.[field]) {
          handleChangeCellValue(issueId, field, e.target.value);
        }
      }}
      value={newValue}
      className={`flex items-center gap-2 rounded border-3 border-transparent p-2 outline-none hover:bg-gray-100 focus:border-emerald-500 ${inputType === "number" ? "text-right" : ""}`}
    />
  );
};

export default ColumnInputFiled;
