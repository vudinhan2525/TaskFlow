import { memo } from "react";
import { ISprint } from "@libs/types/index";
import { IIssue } from "@libs/types/issue";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumSprint";

interface ISprintIssues extends ISprint {
  issues: IIssue[];
}

const BackLog = ({
  projectId,
  sprintIssues,
  isDragging,
  setIsCreateSprintModalOpen,
}: {
  projectId: string;
  sprintIssues: ISprintIssues[];
  isDragging: boolean;
  setIsCreateSprintModalOpen: (isOpen: boolean, sprint: ISprint | null) => void;
}) => {
  return (
    <div>
      <div className="flex min-w-[650px] flex-col gap-2 overflow-x-auto">
        {sprintIssues?.map((sprint: ISprintIssues) => (
          <ScrumSprint
            key={sprint.id}
            sprint={sprint}
            projectId={projectId}
            isDragging={isDragging}
            setIsCreateSprintModalOpen={setIsCreateSprintModalOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(BackLog);
