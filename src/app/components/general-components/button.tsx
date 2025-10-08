import React, { ReactNode } from "react";
import { LuLoader } from "react-icons/lu"; // optional spinner icon from lucide-react
import { Tooltip } from "antd";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "light"
  | "primary-outline"
  | "secondary-outline"
  | "primary-light"
  | "secondary-light"
  | "outline"; // Added 'outline' variant

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const variantStyles = {
  primary:
    "transform rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:cursor-pointer hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  dark: "border border-gray-800 bg-gray-800 text-white hover:bg-gray-900 hover:border-gray-900",
  light: "border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200",
  "primary-outline":
    "border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-100 hover:text-black",
  "secondary-outline":
    "border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white",
  "primary-light": "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  "secondary-light": "bg-gray-50 text-gray-700 hover:bg-gray-100",
  outline: "border-2 border-emerald-500 hover:bg-gray-100 text-emerald-700",
};

const Button = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  title,
  disabled = false,
  isLoading = false,
  type = "button",
}: ButtonProps): React.ReactElement => {
  const baseStyles =
    "px-2 py-1 rounded-md transition-all duration-200 font-medium text-sm outline-none ring-emerald-500 focus:ring-2 focus:ring-offset-2 select-none flex items-center justify-center gap-2";

  const variantStyle = variantStyles[variant];
  const disabledStyles =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <Tooltip title={title}>
      <button
        role="button"
        type={type}
        tabIndex={disabled || isLoading ? -1 : 0}
        onClick={!(disabled || isLoading) ? onClick : undefined}
        aria-disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyle} ${disabledStyles} ${className} `}
        onKeyDown={(e) => {
          if (
            !(disabled || isLoading) &&
            (e.key === "Enter" || e.key === " ")
          ) {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {isLoading && <LuLoader className="h-4 w-4 animate-spin" />}
        {isLoading ? "Đang xử lý..." : children}
      </button>
    </Tooltip>
  );
};

export default Button;
