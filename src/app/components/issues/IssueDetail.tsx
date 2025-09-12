import { useRef, lazy } from "react";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { useIssue } from "@libs/hooks/useIssue";
import { useParams } from "react-router-dom";
import { useIssueStore } from "@libs/store/useIssueStore";
import IssueDetailSkeleton from "../skeleton/issueDetailSkeleton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useElementSize } from "@libs/hooks/useElementSize";

//lazy load

const Details = lazy(() => import("./detailsSection/detailsSection"));
const ActivityIssue = lazy(() => import("./activitySection/activitySection"));
const MetadataSection = lazy(() => import("./metadataSection/metadataSection"));
// import Details from "./detailsSection/detailsSection";
// import ActivityIssue from "./activitySection/activitySection";

const IssueDetail = ({ selectedIssueId }: { selectedIssueId: string }) => {
  if (!selectedIssueId) return null;
  const ref = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { projectId } = useParams<{ projectId: string }>();
  const { closeIssueDetail } = useIssueStore();
  const { issue: selectedIssue, isLoading: isLoadingIssue } = useIssue(
    projectId!,
    selectedIssueId,
  );

  const [_, setSearchParams] = useSearchParams();
  const IssueDetailHeader = [
    {
      key: "lock",
      icon: <IoLockClosedOutline />,
      label: "Lock Issue",
      onClick: () => {
        toast.info("Lock issue not implemented yet");
      },
    },
    {
      key: "watch",
      icon: <FaEye />,
      label: "Watch Issue",
      onClick: () => {
        toast.info("Watch issue not implemented yet");
      },
    },
    // {
    //   key: "like",
    //   icon: <AiOutlineLike />,
    //   label: "Like Issue",
    //   onClick: () => {
    //     toast.info("Like issue not implemented yet");
    //   },
    // },
    {
      key: "share",
      icon: <CiShare2 />,
      label: "Share Issue",
      onClick: () => {
        toast.info("Share issue not implemented yet");
      },
    },
    {
      key: "actions",
      icon: <BsThreeDots />,
      label: "Actions",
      onClick: () => {
        toast.info("Actions not implemented yet");
      },
    },
    {
      key: "close",
      icon: <IoIosClose />,
      label: "Close Issue",
      onClick: () => {
        hideSideBarDetailIssue();
        // setSelectedIssue(null);
        setSearchParams({});
      },
    },
  ];

  const layout = useElementSize(ref, selectedIssue);
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  const handleUpdateIssue = async (key: string, value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue!.id,
        data: {
          [key]: value,
        },
      });
    } catch {
      toast.error("Failed to update issue");
    }
  };
  const hideSideBarDetailIssue = () => {
    closeIssueDetail();
  };

  if (isLoadingIssue || !selectedIssue) {
    return <IssueDetailSkeleton />;
  }
  return (
    // <Suspense fallback={<IssueDetailSkeleton />}>
    <div
      ref={ref}
      className="z-30 flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto border-l border-gray-200 bg-white p-4 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold text-gray-600">
              {selectedIssue?.title}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {IssueDetailHeader.map((item) => (
            <div
              key={item.key}
              onClick={item.onClick}
              className="cursor-pointer rounded-sm border-1 border-gray-300 p-1.5 hover:bg-gray-100"
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>

      {layout === "horizontal" ? (
        <PanelGroup direction="horizontal">
          <Panel>
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto pr-2">
              <MetadataSection
                selectedIssue={selectedIssue!}
                handleUpdateIssue={handleUpdateIssue}
                fileInputRef={fileInputRef}
              />

              <ActivityIssue issueId={selectedIssue?.id || ""} />
            </div>
          </Panel>
          <PanelResizeHandle
            style={{
              backgroundColor: "oklch(0.696 0.17 162.48)",
            }}
            className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
          />
          <Panel minSize={30} maxSize={70} defaultSize={50}>
            <div className="flex-1 overflow-y-auto pl-2">
              <Details
                projectId={selectedIssue!.project_id}
                selectedIssue={selectedIssue!}
                handleUpdateIssue={handleUpdateIssue}
                layout={"vertical"}
              />
            </div>
          </Panel>
        </PanelGroup>
      ) : (
        <div className="flex flex-col gap-8">
          <MetadataSection
            selectedIssue={selectedIssue}
            fileInputRef={fileInputRef}
            handleUpdateIssue={handleUpdateIssue}
          />

          <Details
            projectId={projectId || ""}
            selectedIssue={selectedIssue}
            handleUpdateIssue={handleUpdateIssue}
            layout={"vertical"}
          />

          <ActivityIssue issueId={selectedIssue?.id || ""} />
        </div>
      )}
    </div>
    // </Suspense>
  );
};

export default IssueDetail;
