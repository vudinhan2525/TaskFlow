import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Settings,
  Eye,
  Edit,
  UserPlus,
  Shield,
  Lock
} from 'lucide-react';

import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiShield } from 'react-icons/fi';

interface Permission {
  id: string;
  label: string;
  description: string;
  category: 'read' | 'write' | 'admin';
}

interface Team {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  isDefault?: boolean;
  createdAt: string;
}

const ProjectSettings: React.FC = () => {
  const permissions: Permission[] = [
    { id: 'view_project', label: 'View Project', description: 'Can view project details and content', category: 'read' },
    { id: 'view_board', label: 'View Board', description: 'Can view Kanban board', category: 'read' },
    { id: 'view_backlog', label: 'View Backlog', description: 'Can view product backlog', category: 'read' },
    { id: 'view_roadmap', label: 'View Roadmap', description: 'Can view project roadmap', category: 'read' },
    { id: 'create_issues', label: 'Create Issues', description: 'Can create new issues and tasks', category: 'write' },
    { id: 'edit_issues', label: 'Edit Issues', description: 'Can edit existing issues', category: 'write' },
    { id: 'delete_issues', label: 'Delete Issues', description: 'Can delete issues', category: 'write' },
    { id: 'manage_sprints', label: 'Manage Sprints', description: 'Can create and manage sprints', category: 'write' },
    { id: 'manage_team', label: 'Manage Team', description: 'Can add/remove team members', category: 'admin' },
    { id: 'project_settings', label: 'Project Settings', description: 'Can modify project settings', category: 'admin' },
  ];

  const defaultTeam: Team = {
    id: 'default',
    name: 'Default Team',
    description: 'Default team with basic permissions',
    permissions: ['view_project', 'view_board', 'view_backlog', 'create_issues'],
    memberCount: 5,
    isDefault: true,
    createdAt: '2024-01-15'
  };

  const [teams, setTeams] = useState<Team[]>([
    defaultTeam,
    {
      id: '2',
      name: 'Developers',
      description: 'Development team with full access',
      permissions: ['view_project', 'view_board', 'view_backlog', 'view_roadmap', 'create_issues', 'edit_issues', 'manage_sprints'],
      memberCount: 8,
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'Project Managers',
      description: 'PM team with admin privileges',
      permissions: ['view_project', 'view_board', 'view_backlog', 'view_roadmap', 'create_issues', 'edit_issues', 'delete_issues', 'manage_sprints', 'manage_team', 'project_settings'],
      memberCount: 3,
      createdAt: '2024-02-15'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'permissions'>('teams');
  
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    copyFromDefault: true
  });

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;
    
    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      permissions: newTeam.copyFromDefault ? [...defaultTeam.permissions] : newTeam.permissions,
      memberCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTeams([...teams, team]);
    setNewTeam({ name: '', description: '', permissions: [], copyFromDefault: true });
    setShowCreateForm(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (teamId === 'default') return; // Không thể xóa default team
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleEditTeam = (teamId: string) => {
    setEditingTeam(teamId);
  };

  const handleSaveTeam = (teamId: string, updatedTeam: Partial<Team>) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, ...updatedTeam } : team
    ));
    setEditingTeam(null);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (newTeam.copyFromDefault) {
      setNewTeam({ ...newTeam, copyFromDefault: false });
    }
    
    const updatedPermissions = checked 
      ? [...newTeam.permissions, permissionId]
      : newTeam.permissions.filter(id => id !== permissionId);
    
    setNewTeam({ ...newTeam, permissions: updatedPermissions });
  };

  const getPermissionIcon = (category: string) => {
    switch (category) {
      case 'read': return <Eye className="w-4 h-4" />;
      case 'write': return <Edit className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      name: team.name,
      description: team.description,
      permissions: [...team.permissions]
    });

    const handleSave = () => {
      handleSaveTeam(team.id, editData);
      setIsEditing(false);
    };

    const handlePermissionToggle = (permissionId: string, checked: boolean) => {
      const updatedPermissions = checked 
        ? [...editData.permissions, permissionId]
        : editData.permissions.filter(id => id !== permissionId);
      
      setEditData({ ...editData, permissions: updatedPermissions });
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                  disabled={team.isDefault}
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="text-gray-600 bg-transparent border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none w-full resize-none"
                  rows={2}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {team.name}
                  {team.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 mt-1">{team.description}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                {!team.isDefault && (
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <FiUsers className="w-4 h-4" />
            {team.memberCount} members
          </span>
          <span>Created: {team.createdAt}</span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions:</h4>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.permissions.includes(permission.id)}
                    onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    {getPermissionIcon(permission.category)}
                    <span className="text-sm">{permission.label}</span>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {team.permissions.map((permId) => {
                const permission = permissions.find(p => p.id === permId);
                if (!permission) return null;
                
                const colorClass = {
                  read: 'bg-green-100 text-green-800',
                  write: 'bg-blue-100 text-blue-800',
                  admin: 'bg-purple-100 text-purple-800'
                }[permission.category];

                return (
                  <span
                    key={permId}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${colorClass}`}
                  >
                    {getPermissionIcon(permission.category)}
                    {permission.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
            BL
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BlueSky Project Settings</h1>
            <p className="text-gray-600">Manage teams and permissions for your software project</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'teams'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiUsers className="w-4 h-4 inline mr-2" />
          Teams
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'permissions'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiShield className="w-4 h-4 inline mr-2" />
          Permissions
        </button>
      </div>

      {activeTab === 'teams' && (
        <div>
          {/* Create Team Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Team
            </button>
          </div>

          {/* Create Team Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Team</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter team description"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={newTeam.copyFromDefault}
                      onChange={(e) => setNewTeam({ 
                        ...newTeam, 
                        copyFromDefault: e.target.checked,
                        permissions: e.target.checked ? [] : newTeam.permissions
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Copy permissions from Default Team
                    </span>
                  </label>

                  {!newTeam.copyFromDefault && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Select Permissions:</h4>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {permissions.map((permission) => (
                          <label key={permission.id} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newTeam.permissions.includes(permission.id)}
                              onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                            />
                            <div>
                              <div className="flex items-center gap-1">
                                {getPermissionIcon(permission.category)}
                                <span className="text-sm font-medium">{permission.label}</span>
                              </div>
                              <span className="text-xs text-gray-500">{permission.description}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateTeam}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Team
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewTeam({ name: '', description: '', permissions: [], copyFromDefault: true });
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Teams List */}
          <div className="grid gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Permission Overview</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-900">Available Permissions</h3>
            </div>
            
            <div className="p-6">
              {['read', 'write', 'admin'].map((category) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    {getPermissionIcon(category)}
                    {category} Permissions
                  </h4>
                  
                  <div className="grid gap-4">
                    {permissions.filter(p => p.category === category).map((permission) => (
                      <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 mt-1">
                          {getPermissionIcon(permission.category)}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{permission.label}</h5>
                          <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                          {permission.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;