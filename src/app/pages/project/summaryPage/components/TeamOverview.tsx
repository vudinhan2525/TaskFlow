import React from "react";

interface TeamMemberWorkload {
  name: string;
  totalIssues: number;
  issuesByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

const TeamOverview: React.FC = () => {
  const teamData: TeamMemberWorkload[] = [
    {
      name: "John Doe",
      totalIssues: 12,
      issuesByPriority: { high: 4, medium: 5, low: 3 },
    },
    {
      name: "Jane Smith",
      totalIssues: 15,
      issuesByPriority: { high: 3, medium: 8, low: 4 },
    },
    {
      name: "Mike Johnson",
      totalIssues: 8,
      issuesByPriority: { high: 2, medium: 4, low: 2 },
    },
    {
      name: "Sarah Wilson",
      totalIssues: 10,
      issuesByPriority: { high: 3, medium: 4, low: 3 },
    },
  ].sort((a, b) => b.totalIssues - a.totalIssues);

  const maxIssues = Math.max(...teamData.map((member) => member.totalIssues));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Team Workload</h3>
      <div className="space-y-6">
        {teamData.map((member, index) => {
          const highWidth = (member.issuesByPriority.high / member.totalIssues) * 100;
          const mediumWidth = (member.issuesByPriority.medium / member.totalIssues) * 100;
          const lowWidth = (member.issuesByPriority.low / member.totalIssues) * 100;

          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{member.name}</span>
                <span className="text-sm text-gray-500">{member.totalIssues} issues</span>
              </div>
              <div className="relative h-4 w-full bg-gray-100 rounded">
                <div className="absolute left-0 h-full rounded-l bg-red-500" style={{ width: `${highWidth}%` }} />
                <div
                  className="absolute h-full bg-orange-500"
                  style={{ left: `${highWidth}%`, width: `${mediumWidth}%` }}
                />
                <div
                  className="absolute h-full rounded-r bg-yellow-500"
                  style={{ left: `${highWidth + mediumWidth}%`, width: `${lowWidth}%` }}
                />
              </div>
              <div className="flex justify-end mt-1 space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-gray-600">High ({member.issuesByPriority.high})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                  <span className="text-gray-600">Medium ({member.issuesByPriority.medium})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-gray-600">Low ({member.issuesByPriority.low})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamOverview;
