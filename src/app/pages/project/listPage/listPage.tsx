import List from "@libs/app/components/projects/list/list";
import { useParams } from "react-router-dom";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="flex-1 overflow-y-hidden">
      <div className="flex-1">
        <List projectId={projectId} />
      </div>
      {/* <IssueSideBar /> */}
    </div>
  );
};

export default ListPage;
