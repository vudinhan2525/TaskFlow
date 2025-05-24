import List from "@libs/app/components/projects/list/list";
import { useParams } from "react-router-dom";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="flex">
      <div className="flex-1">
        <List projectId={projectId} />
      </div>
      <IssueSideBar />
    </div>
  );
};

export default ListPage;
