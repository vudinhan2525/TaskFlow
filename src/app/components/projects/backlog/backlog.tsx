import React from "react";
import Button from "../../general-components/button";

const Backlog: React.FC = () => {
  return (
    <div className="border-b border-gray-200">
      {/* Backlog Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <span className="text-sm font-medium text-gray-800">BACKLOG (0 issues)</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Estimate: 0</span>
          <Button variant="primary">Create sprint</Button>
        </div>
      </div>

      {/* Empty Backlog Message */}
      <div className="p-3">
        <p className="text-sm text-gray-500 italic">Your backlog is empty</p>
        <Button variant="primary-light" className="mt-2">
          + Create work item or create from Confluence page
        </Button>
      </div>
    </div>
  );
};

export default Backlog;
