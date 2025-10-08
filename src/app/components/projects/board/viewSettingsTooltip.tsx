import React, { useRef, useEffect } from "react";
import { useFieldVisibility } from "@libs/app/context/board.context";
import { X } from "lucide-react";
import { Divider } from "antd";
import { motion } from "motion/react";

interface ViewSettingsTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const ViewSettingsTooltip: React.FC<ViewSettingsTooltipProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const { fieldVisibility, toggleField } = useFieldVisibility();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const fieldLabels = {
    workType: "Work type",
    workItemKey: "Work item key",
    epic: "Epic",
    dueDate: "Due date",
    labels: "Labels",
    estimate: "Estimate",
    linkedWorkItems: "Linked work items",
    priority: "Priority",
    assignee: "Assignee",
  };

  const generalSettings = [
    { key: "openWorkItemsInSidebar", label: "Open work items in sidebar" },
    { key: "workSuggestions", label: "Work suggestions" },
  ];

  const fieldSettings = Object.entries(fieldLabels).map(([key, label]) => ({
    key: key as keyof typeof fieldLabels,
    label,
  }));

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0.3 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: 0, y: 0, opacity: 0 }}
      ref={tooltipRef}
      className="absolute top-full right-0 z-50 mt-2 w-68 rounded-lg border border-gray-200 bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-gray-900">View settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {/* General Settings */}
        <div className="mb-2">
          {generalSettings.map(({ key, label }) => (
            <div key={key} className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <ToggleSwitch
                isOn={fieldVisibility[key as keyof typeof fieldVisibility]}
                onToggle={() =>
                  toggleField(key as keyof typeof fieldVisibility)
                }
              />
            </div>
          ))}
        </div>

        <Divider />

        {/* Fields Section */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-900">Fields</h4>
          {fieldSettings.map(({ key, label }) => (
            <div key={key} className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <ToggleSwitch
                isOn={fieldVisibility[key]}
                onToggle={() => toggleField(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
        isOn ? "bg-green-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ViewSettingsTooltip;
