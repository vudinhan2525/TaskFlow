import IssueSideBarV2 from "@libs/app/components/issues/IssueSideBarV2";
import { IIssue } from "@libs/types/issue";
import React, { createContext, useContext, useState } from "react";

type VisibleStatus = "show" | "hide";

interface IssueDetailContextType {
  showSideBarDetailIssue: (issue: IIssue) => void;
  hideSideBarDetailIssue: () => void;
  selectedIssue: IIssue | undefined;
  toggleSideBarDetailIssue: (issue: IIssue) => void;
}

const IssueDetailContext = createContext<IssueDetailContextType | null>(null);

export const useIssueDetailContext = () => {
  const ctx = useContext(IssueDetailContext);
  if (!ctx) throw new Error("IssueDetailContext is not available");
  return ctx;
};

export const IssueDetailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedIssue, setSelectedIssue] = useState<IIssue>();
  const [visible, setVisible] = useState<VisibleStatus>("hide");
  const showSideBarDetailIssue = (issue: IIssue) => {
    setSelectedIssue(issue);
    setVisible("show");
  };
  const hideSideBarDetailIssue = () => {
    setVisible("hide");
  };
  const toggleSideBarDetailIssue = (issue: IIssue) => {
    if (visible === "show") {
      hideSideBarDetailIssue();
    } else showSideBarDetailIssue(issue);
  };
  return (
    <IssueDetailContext.Provider
      value={{
        selectedIssue,
        showSideBarDetailIssue,
        hideSideBarDetailIssue,
        toggleSideBarDetailIssue,
      }}
    >
      {children}
      {visible == "show" && selectedIssue && <IssueSideBarV2 />}
    </IssueDetailContext.Provider>
  );
};
