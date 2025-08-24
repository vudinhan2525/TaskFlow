import React from "react";
import { Check, X } from "lucide-react";

const CustomInput = ({
  field,
  value,
  inputType = "number",
  handleUpdateIssue,
  className
}: {
  field: string;
  value?: string | number;
  inputType?: "string" | "number" | "date";
  handleUpdateIssue: (field: string, value: any) => void;
  className?: string;
}) => {
  const [show, setShow] = React.useState(false);
  const [updatedValue, setUpdatedValue] = React.useState(value);
  return (
    <div className={`relative w-full ${className}`}>
      {show ? (
        <input
          type={inputType}
          value={updatedValue}
          onChange={(e) => setUpdatedValue(e.target.value)}
          className="w-full rounded-md border-2 border-green-500 p-1 outline-none"
        />
      ) : (
        <span
          className={`cursor-pointer text-sm font-thin ${value ? "rounded-sm bg-gray-200 px-2 py-0.5 text-gray-900" : "text-sm font-semibold text-gray-500"}`}
          onClick={() => setShow(true)}
        >
          {value ? value : "None"}
        </span>
      )}

      {show && (
        <div className="absolute top-full right-0 z-50 flex translate-y-1 gap-1">
          <button
            style={{
              boxShadow: "4px 8px 16px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              handleUpdateIssue(field, updatedValue); // Assuming label is the key to update
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
