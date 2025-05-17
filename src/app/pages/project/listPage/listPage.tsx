import List from "@libs/app/components/projects/list/list";
import { useParams, useSearchParams } from "react-router-dom";
import { useProjectIssues } from "@libs/hooks/useIssue";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";
import { parseFiltersSearchParams,FiltersSearchParams } from "@libs/utils/parseFiltersSearchParams";
import { useProjectColumns } from "@libs/hooks/useProject";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const { columns } = useProjectColumns(projectId || "");

  const filtersSearchParams = searchParams.get("filters");
  const keywordSearchParams = searchParams.get("keyword");

  const filters:FiltersSearchParams = parseFiltersSearchParams(filtersSearchParams || "");

  const { issues } = useProjectIssues({
    project_id: projectId,
    keyword: keywordSearchParams || undefined,
    sprint_ids: filters.sprint_ids,
    assignee_ids: filters.assignee_ids,
    column_ids: filters.status.map((status) =>{
      const column = columns.find((column) => column.name === status);
      return column?.id || "";
    }),
    page: 1,
    limit: 10,
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
