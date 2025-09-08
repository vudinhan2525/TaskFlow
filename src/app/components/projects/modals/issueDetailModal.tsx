import React from "react";
import IssueDetail from "../../issues/IssueDetail";
import { useIssueStore } from "@libs/store/useIssueStore";
import ModalPortal from "../../general-components/modal/modalPortal";

const IssueDetailModal = () => {
  const { closeIssueDetail } = useIssueStore();
  const selectedIssueId = useIssueStore((s) => s.selectedIssueId);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeIssueDetail();
    }
  };
  return (
    <ModalPortal>
      <>
        {selectedIssueId ? (
          <div
            className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/60"
            onClick={handleBackdropClick}
          >
            <div className="flex h-[80%] min-h-[400px] w-[70%] min-w-[600px] items-center justify-center overflow-hidden rounded-md transition-all duration-300">
              {selectedIssueId && (
                <IssueDetail selectedIssueId={selectedIssueId} />
              )}
            </div>
          </div>
        ) : null}
      </>
    </ModalPortal>
  );
};  

export default IssueDetailModal;
