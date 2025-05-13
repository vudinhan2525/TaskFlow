import Button from "@libs/app/components/general-components/button";
import { ReactNode } from "react";
import { LuX } from "react-icons/lu";

interface BaseModalProps {
  title: string;
  buttonContent: string;
  isLoadingButton?: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: any;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  title,
  buttonContent = "Accept",
  onClose,
  isLoadingButton,
  onSubmit,
  children,
  className,
}: BaseModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{ zIndex: 1000 }}
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/40 bg-opacity-50 overflow-y-auto p-4"
    >
      <div
        className={`animate-fade-in min-w-[500px] max-w-[90%] max-h-[90vh] rounded-lg bg-white p-6 shadow-xl relative ${className}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-green-700">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <LuX className="h-7 w-7 cursor-pointer" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
          {children}
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <Button
            isLoading={isLoadingButton}
            onClick={() => {
              if (onSubmit) onSubmit();
            }}
            className="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {buttonContent}
          </Button>
        </div>
      </div>
    </div>
  );
}