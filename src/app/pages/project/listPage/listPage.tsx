import List from "@libs/app/components/projects/list/list";
import { useParams, useSearchParams } from "react-router-dom";
import { useProjectIssues } from "@libs/hooks/useIssue";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";
import { IssueStatus } from "@libs/types/issue";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const status = searchParams.get("status");
  const sprint = searchParams.get("sprint");
  const { issues } = useProjectIssues({
    project_id: projectId,
    keyword: keyword || undefined,
    status: status ? status.split("-") as IssueStatus[] : [],
    sprint_id: sprint ||'',
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
