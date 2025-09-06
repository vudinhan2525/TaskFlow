import List from "@libs/app/components/projects/list/list";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="flex-1 overflow-y-hidden">
      <Helmet>
        <title>List - Task Flow</title>
      </Helmet>
      <div className="flex-1">
        <List projectId={projectId} />
      </div>
    </div>
  );
};

export default ListPage;
