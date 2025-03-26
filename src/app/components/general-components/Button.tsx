import React, { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
