import React from "react";
import { Check, X, Edit } from "lucide-react";
import { Tooltip } from "antd";

const CustomInput = ({
  field,
  value,
  inputType = "number",
  handleUpdateIssue,
  containerClassName,
  contentClassName,
}: {
  field: string;
  value?: string | number;
  inputType?: "text" | "number" | "date";
  handleUpdateIssue: (field: string, value: any) => void;
  containerClassName?: string;
  contentClassName?: string;
}) => {
  const [show, setShow] = React.useState(false);
  const [updatedValue, setUpdatedValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {show ? (
        <input
          ref={inputRef}
          type={inputType}
          onBlur={() => {
            handleUpdateIssue(field, updatedValue);
            setShow(false);
          }}
          value={updatedValue ? updatedValue : value}
          onChange={(e) => setUpdatedValue(e.target.value)}
          className={`w-full rounded-md border-2 border-green-500 p-1 outline-none ${contentClassName}`}
        />
      ) : (
        <div className="group relative flex w-full flex-row items-center justify-start gap-1">
          <span
            className={`inline-block cursor-pointer text-sm ${value ? "rounded-sm bg-gray-200 px-2 py-0.5 font-thin text-gray-900" : "font-semibold text-gray-500"} ${contentClassName}`}
            onClick={() => setShow(true)}
          >
            {value ? value : "None"}
          </span>
          {field == "summary" && (
            <Tooltip title="Edit summary">
              <button
                className="opacity-0 group-hover:opacity-100"
                onClick={() => {
                  setShow(true);
                  inputRef.current?.focus();
                }}
              >
                <Edit size={16} className="font-bold text-gray-700" />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {show && (
        <div className="absolute top-full right-0 z-50 flex translate-y-1 gap-1">
          <button
            style={{
              boxShadow: "4px 8px 16px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              handleUpdateIssue(field, updatedValue);
              setShow(false);
            }}
            className="z-50 flex cursor-pointer items-center justify-center rounded-md bg-white p-2 shadow-2xl hover:bg-gray-200"
          >
            <Check size={18} className="text-gray-900" />
          </button>
          <button
            style={{
              boxShadow: "-4px 8px 16px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              setShow(false);
            }}
            className="z-50 flex cursor-pointer items-center justify-center rounded-md bg-white p-2 shadow-md hover:bg-gray-200"
          >
            <X size={18} className="text-gray-900" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
