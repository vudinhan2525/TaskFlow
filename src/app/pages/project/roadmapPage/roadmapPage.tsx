import React from "react";
import Roadmap from "@libs/app/components/projects/roadmap/roadmap";
import { useParams } from "react-router-dom";

const RoadmapPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="w-full p-6 pb-32">

      <Roadmap projectId={projectId} />
    </div>
  );
};

export default RoadmapPage;
