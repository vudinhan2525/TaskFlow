import  { useRef, useState } from 'react'
import Modal from '@libs/app/components/general-components/modal/modal';
import FindUser from '@libs/app/components/general-components/findUser';
import { useCreateTeam } from '@libs/hooks/useTeam';
import { useParams } from 'react-router-dom';

interface AddProjectTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
 
}

const AddProjectTeamModal = ({ isOpen, onClose }: AddProjectTeamModalProps) => {
  const [name, setName] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { projectId } = useParams<{ projectId: string }>();
 

  const { createTeam, isLoading } = useCreateTeam();
  const handleCreateTeam =  () => {
    createTeam({ project_id: projectId || '', name: name.trim(), member_ids: memberIds });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create team"
      onClose={() => {
        onClose();
      }}

      isLoadingButton={isLoading}
      buttonContent="Create"
      onSubmit={handleCreateTeam}
      isSubmitDisabled={!name.trim() || memberIds.length === 0}
    >
      <div className="space-y-4" ref={wrapperRef}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
            placeholder="Team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add team members <span className="text-red-500">*</span></label>
          <FindUser value={memberIds} onChange={setMemberIds} />
        </div>

        {/* Membership controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Membership controls</label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={anyoneCanJoin}
              onChange={(e) => setAnyoneCanJoin(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Anyone can join this team without approval
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default AddProjectTeamModal