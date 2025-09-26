import React, { useEffect, useMemo, useState } from "react";
import { Users, Plus } from "lucide-react";
import PermissionsSettings from "../../../components/projects/settings/permissionSettings";
import { useParams } from "react-router-dom";
import { useProjectTeamById } from "@libs/hooks/useTeam";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import Modal from "@libs/app/components/general-components/modal/modal";
import FindUser from "@libs/app/components/general-components/findUser";
import { useMutation } from "@tanstack/react-query";
import { teams } from "@libs/apis/team";
import { queryClient } from "@libs/apis/react-query";
import { toast } from "react-toastify";
import { useUpdateTeam } from "@libs/hooks/useTeam";

const TeamDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { teamId } = useParams<{ teamId: string }>();
  const { team, isLoadingTeam } = useProjectTeamById(
    projectId || "",
    teamId || "",
  );
  const { updateTeam, isLoading: isUpdatingTeam } = useUpdateTeam(
    projectId || "",
  );
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [newPermissionKeys, setNewPermissionKeys] = useState<Set<string>>(
    new Set(team?.permission_keys || []),
  );
  useEffect(() => {
    setNewPermissionKeys(new Set(team?.permission_keys || []));
  }, [team]);
  const memberIds = useMemo(() => team?.member_ids || [], [team]);

  const { mutate: updateMembers, isPending: isUpdating } = useMutation({
    mutationFn: async (data: { member_ids: string[] }) => {
      if (!team?.id) throw new Error("Missing team id");
      return (
        await teams.update(projectId || "", team.id, {
          member_ids: data.member_ids,
        })
      ).data;
    },
    onSuccess: () => {
      toast.success("Updated team members");
      queryClient.invalidateQueries({ queryKey: ["team", projectId, teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams", projectId] });
      setIsAddPeopleOpen(false);
    },
    onError: () => toast.error("Failed to update team members"),
  });

  const handleUpdateTeam = async () => {
    if (!team?.id) throw new Error("Missing team id");
    return updateTeam({
      team_id: team.id,
      permission_keys: Array.from(newPermissionKeys),
    });
  };

  if (isLoadingTeam || !team) return <div>Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto w-full">
          {/* Green Banner */}
          <div className="mb-6 flex h-24 items-center justify-center rounded-lg bg-green-100">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-green-300 bg-white/70 px-3 py-1 text-sm text-green-700 shadow-sm hover:bg-white"
            >
              Add cover image
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Sidebar - Team Profile */}
            <div className="space-y-6 lg:col-span-1">
              {/* Team Profile Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <Users className="h-4 w-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {team?.name}
                  </h2>
                  <div className="ml-auto">
                    <button
                      onClick={() => {
                        setSelectedUserIds(memberIds);
                        setIsAddPeopleOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                      Add people
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      About
                    </h3>
                    <p className="text-sm text-gray-600">
                      {team?.description || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Members
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {memberIds.slice(0, 8).map((uid) => (
                          <div key={uid} className="inline-block">
                            <UserAvatar
                              userId={uid}
                              size={32}
                              isDisplayName={false}
                            />
                          </div>
                        ))}
                        {memberIds.length > 8 && (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                            +{memberIds.length - 8}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {memberIds.length} members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Team Permissions */}
            <div className="lg:col-span-2">
              <PermissionsSettings
                permissionKeys={newPermissionKeys}
                setPermissionKeys={setNewPermissionKeys}
                onSave={handleUpdateTeam}
              />
            </div>
          </div>
        </div>
      </div>

      {isAddPeopleOpen && (
        <Modal
          title="Add people to team"
          buttonContent="Save"
          onClose={() => setIsAddPeopleOpen(false)}
          onSubmit={() => updateMembers({ member_ids: selectedUserIds })}
          isLoadingButton={isUpdating}
        >
          <FindUser
            value={selectedUserIds}
            onChange={setSelectedUserIds}
            label="Select members"
            className="mt-2"
          />
        </Modal>
      )}
    </>
  );
};

export default TeamDetailPage;
