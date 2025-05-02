import List from "@libs/app/components/projects/list/list";
import { useParams } from "react-router-dom";
import { useProjectIssues } from "@libs/hooks/useIssue";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { issues } = useProjectIssues({
    project_id: projectId,
  });
  return (
    <div className="flex">
      <div className="flex-1">
        <List projectId={projectId} issues={issues} />
      </div>
      <IssueSideBar />
    </div>
  );
};

export default ListPage;
