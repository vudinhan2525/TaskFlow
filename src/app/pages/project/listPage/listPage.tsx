import { lazy } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect, useRef } from "react";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { GetIssuesParams } from "@libs/types/issue";
import ListPageHeader from "@libs/app/components/projects/list/listPageHeader";

const ListTable = lazy(
  () => import("@libs/app/components/projects/list/listTable"),
);
const ListDetail = lazy(
  () => import("@libs/app/components/projects/list/listDetail"),
);

const ListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const listTableRef = useRef<HTMLDivElement>(null);
  const [maxHeightListTable, setMaxHeightListTable] = useState(0);
  const LOCAL_STORAGE_KEY = `listMode_${projectId}`;
  const [listMode, setListMode] = useState<"list" | "detail">(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved === "detail" ? "detail" : "list";
  });

  // Cập nhật filters khi listMode thay đổi
  const [filters, setFilter] = useState<GetIssuesParams>({
    project_id: projectId,
    is_fetch: true,
    limit: 100,
    parent_ids: listMode === "detail" ? [] : ["NULL"],
  });

  useEffect(() => {
    if (!listTableRef.current) return;
    const el = listTableRef.current;
    const measure = () => setMaxHeightListTable(el.clientHeight);
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [listTableRef]);

  const { issues, pagination, isLoading } = useProjectIssues(filters);

  return (
    <div className="flex flex-1 flex-col overflow-y-hidden">
      <Helmet>
        <title>List - Task Flow</title>
      </Helmet>

      <div className="flex flex-1 flex-col gap-2 overflow-y-hidden">
        <h1 className="p-2 text-2xl font-bold text-gray-700">List Issues</h1>
        <ListPageHeader
          filters={filters}
          setFilter={setFilter}
          issues={issues || []}
          listMode={listMode}
          setListMode={setListMode}
        />

        <div ref={listTableRef} className="h-full flex-1 flex-col">
          {listMode === "list" ? (
            <ListTable
              maxHeightListTable={Math.max(maxHeightListTable - 100, 200)}
              issues={issues || []}
              isFetching={isLoading}
              pagination={pagination}
              projectId={projectId || ""}
            />
          ) : (
            <ListDetail
              issues={issues || []}
              isFetching={isLoading}
              maxHeightListTable={maxHeightListTable}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
