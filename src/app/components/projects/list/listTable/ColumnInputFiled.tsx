import { IIssue } from "@libs/types/issue";
import { useState, useEffect } from "react";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";

const ColumnInputFiled = ({
  issue,
  field,
  inputType = "text",
}: {
  issue: IIssue | undefined;
  field: keyof IIssue;
  inputType?: "text" | "number";
}) => {
  const [newValue, setNewValue] = useState(
    issue?.[field] || (inputType === "number" ? 0 : ""),
  );
  const { updateIssueAsync } = useUpdateIssue({
    projectId: issue?.project_id || "",
  });
  useEffect(() => {
    setNewValue(issue?.[field] || (inputType === "number" ? 0 : ""));
  }, [issue, field, inputType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };
  if (!issue) return <></>;
  return (
    <input
      onChange={handleChange}
      type={inputType}
      onBlur={(e) => {
        if (e.target.value !== issue?.[field]) {
          updateIssueAsync({
            id: issue.id,
            data: { [field]: e.target.value },
          });
        }
      }}
      value={newValue?.toString()}
      className={`whover:bg-gray-100 flex items-center gap-2 rounded border-2 border-transparent px-2 py-1 outline-none focus:border-emerald-500 ${inputType === "number" ? "text-right" : ""} w-full`}
    />
  );
};

export default ColumnInputFiled;
