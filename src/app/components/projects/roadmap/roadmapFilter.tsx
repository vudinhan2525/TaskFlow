import { useState, useEffect } from "react";
import SearchBar from "../../general-components/searchBar";
import { Select, Dropdown, Checkbox, Input, Button } from "antd";
import { Filter, CalendarPlus, Settings2 } from "lucide-react";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { useParams, useSearchParams } from "react-router-dom";

import CustomFilter from "./customFilter";
import { GetIssuesParams, IIssue } from "@libs/types/issue";
import { useProjectIssues } from "@libs/hooks/useIssue";
const RoadmapFilter = ({
  setIssues,
}: {
  setIssues: React.Dispatch<React.SetStateAction<IIssue[]>>;
}) => {
  const [params] = useSearchParams();

  const { projectId } = useParams<{ projectId: string }>();
  const { projectMembers } = useProjectMembers(projectId || "");

  const [filters, setFilters] = useState<GetIssuesParams>({
    keyword: params.get("text") || "",
    // due_date_from: params.get("due_date_from") || undefined,
    // due_date_to: params.get("due_date_to") || undefined,
    // column_ids: params.get("column_ids")?.split(",").filter(Boolean) || [],
    // created_at_from: params.get("created_at_from") || undefined,
    // created_at_to: params.get("created_at_to") || undefined,
    // assignee_ids: params.get("assignee_ids")?.split(",").filter(Boolean) || [],
    // page: params.get("page") ? parseInt(params.get("page")!) : 1,
    // limit: params.get("limit") ? parseInt(params.get("limit")!) : 12,
    project_id: projectId,
  });
  const { issues } = useProjectIssues(filters);
  useEffect(() => {
    setFilters({
      ...filters,
      keyword: params.get("text") || "",
    });
  }, [params.get("text")]);
  useEffect(() => {
    setIssues(issues);
  }, [issues]);

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <SearchBar />

        <div className="flex items-center gap-3 p-2">
          <CustomFilter title="Assignee" />
          <CustomFilter title="Status" />
          <CustomFilter title="Labels" />
          <CustomFilter title="More Filters" />
        </div>
      </div>
    </div>
  );
};                                        

export default RoadmapFilter;
