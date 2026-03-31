'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatar: string;
  lastLogin: string;
  campaignsSent: number;
}

interface PendingInvite {
  id: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  sentDate: string;
  status: 'Pending' | 'Expired';
}

const initialMembers: TeamMember[] = [
  { id: '1', name: 'You', email: 'admin@bestemail.in', role: 'Owner', avatar: '👑', lastLogin: '2 minutes ago', campaignsSent: 58 },
  { id: '2', name: 'Priya Sharma', email: 'priya@company.com', role: 'Admin', avatar: '🟣', lastLogin: '1 hour ago', campaignsSent: 23 },
  { id: '3', name: 'Rahul Kumar', email: 'rahul@company.com', role: 'Editor', avatar: '🔵', lastLogin: 'Yesterday', campaignsSent: 12 },
  { id: '4', name: 'Meera Nair', email: 'meera@company.com', role: 'Viewer', avatar: '⚪', lastLogin: '3 days ago', campaignsSent: 0 },
];

const initialInvites: PendingInvite[] = [
  { id: 'inv1', email: 'new@company.com', role: 'Editor', sentDate: 'March 1, 2026', status: 'Pending' },
];

const rolePermissions: Record<string, string> = {
  Owner: 'Everything + billing',
  Admin: 'Full access',
  Editor: 'Create & send emails',
  Viewer: 'View reports only',
};

const roleBadgeStyle = (role: string): React.CSSProperties => {
  switch (role) {
    case 'Owner':
      return { background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block' };
    case 'Admin':
      return { background: '#00B4D8', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' };
    case 'Editor':
      return { background: '#3B82F6', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' };
    case 'Viewer':
      return { background: '#E0F7FA', color: '#64648b', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' };
    default:
      return {};
  }
};

export default function TeamPage() {
  const isMobile = useIsMobile();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');

  const totalCampaigns = members.reduce((sum, m) => sum + m.campaignsSent, 0);
  const pendingCount = invites.filter(i => i.status === 'Pending').length;

  const handleRoleChange = (memberId: string, newRole: 'Admin' | 'Editor' | 'Viewer') => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success('Role updated successfully');
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success(`${name} has been removed from the team`);
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (members.some(m => m.email === inviteEmail) || invites.some(i => i.email === inviteEmail)) {
      toast.error('This email has already been invited or is a member');
      return;
    }
    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      sentDate: 'Just now',
      status: 'Pending',
    };
    setInvites(prev => [...prev, newInvite]);
    setInviteEmail('');
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  const handleCancelInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success('Invitation cancelled');
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: isMobile ? 16 : 24,
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: 8,
    border: '1px solid #E0F7FA',
    padding: '10px 14px',
    fontSize: 16,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: 12,
    background: '#00B4D8',
    color: '#fff',
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    minHeight: 44,
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <div style={{ background: '#F8F9FF', minHeight: '100vh', padding: isMobile ? 16 : 32 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
            Your Team 👥
          </h1>
          <p style={{ fontSize: 15, color: '#64648b', margin: '6px 0 0' }}>
            Manage who can access your account
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Team Members', value: members.length, icon: '👤' },
            { label: 'Pending Invites', value: pendingCount, icon: '📩' },
            { label: 'Total Campaigns Sent', value: totalCampaigns, icon: '🚀' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e' }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: '#8b8ba7', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div style={{ ...cardStyle, marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 18px' }}>
            Team Members
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? 14 : 16,
                  borderRadius: 12,
                  border: '1px solid #E0F7FA',
                  background: member.role === 'Owner' ? '#FFFDF5' : '#fff',
                  gap: isMobile ? 12 : 0,
                }}
              >
                {/* Left: avatar, name, email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: '#E0F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {member.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#8b8ba7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.email}
                    </div>
                  </div>
                </div>

                {/* Center: role badge, permissions, last login */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  alignItems: isMobile ? 'center' : 'flex-start',
                  gap: isMobile ? 10 : 4,
                  flex: isMobile ? undefined : 1,
                  flexWrap: 'wrap',
                }}>
                  <span style={roleBadgeStyle(member.role)}>{member.role}</span>
                  <span style={{ fontSize: 12, color: '#64648b' }}>{rolePermissions[member.role]}</span>
                  <span style={{ fontSize: 12, color: '#8b8ba7' }}>Last login: {member.lastLogin}</span>
                </div>

                {/* Right: actions */}
                {member.role !== 'Owner' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                      style={{
                        ...inputStyle,
                        width: isMobile ? '50%' : 110,
                        fontSize: 13,
                        padding: '8px 10px',
                        cursor: 'pointer',
                        background: '#fff',
                      }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: 8,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invite Team Member */}
        <div style={{ ...cardStyle, marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 18px' }}>
            Invite Team Member
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            alignItems: isMobile ? 'stretch' : 'flex-end',
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#64648b', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ width: isMobile ? '100%' : 150 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#64648b', display: 'block', marginBottom: 6 }}>
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                style={{ ...inputStyle, cursor: 'pointer', background: '#fff' }}
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <button onClick={handleSendInvite} style={{ ...buttonStyle, width: isMobile ? '100%' : 'auto' }}>
              Send Invite
            </button>
          </div>
        </div>

        {/* Pending Invites */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 18px' }}>
            Pending Invites
          </h2>
          {invites.length === 0 ? (
            <p style={{ fontSize: 14, color: '#8b8ba7', textAlign: 'center', padding: 24 }}>
              No pending invitations
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? 14 : 16,
                    borderRadius: 12,
                    border: '1px solid #E0F7FA',
                    background: '#fff',
                    gap: isMobile ? 12 : 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: '#E0F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      📧
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {invite.email}
                      </div>
                      <div style={{ fontSize: 13, color: '#8b8ba7' }}>
                        Sent {invite.sentDate}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <span style={roleBadgeStyle(invite.role)}>{invite.role}</span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: invite.status === 'Pending' ? '#FEF3C7' : '#FEE2E2',
                      color: invite.status === 'Pending' ? '#92400E' : '#DC2626',
                    }}>
                      {invite.status}
                    </span>
                    <button
                      onClick={() => handleResendInvite(invite.email)}
                      style={{
                        background: '#E0F7FA',
                        border: 'none',
                        color: '#00B4D8',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: 8,
                      }}
                    >
                      Resend
                    </button>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: 8,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
