import React from "react";
import MetricCards from "../../../components/projects/report/MetricCards";
import StatusOverview from "../../../components/projects/report/StatusOverview";
import IssueAnalytics from "../../../components/projects/report/IssueAnalytics";
// import TeamOverview from "./components/TeamOverview";

const ReportPage: React.FC = () => {
  return (
    <div className="w-full p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Project Summary</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of project status and metrics</p>
      </div>

      {/* Section 1: Key Metrics */}
      <section>
        <MetricCards />
      </section>

      {/* Section 2: Status Overview & Activity */}
      <section>
        <StatusOverview />
      </section>

      {/* Section 3: Issue Analytics */}
      <section>
        <IssueAnalytics />
      </section>

      {/* Section 4: Team Overview */}
      {/* <section>
        <TeamOverview />
      </section> */}
    </div>
  );
};

export default ReportPage;
