import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { LevelBadge } from '../components/common/LevelBadge';
import { Modal } from '../components/common/Modal';
import {
  ShieldAlert,
  Users,
  Sprout,
  Droplets,
  Target,
  PlusCircle,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Globe,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [plantsList, setPlantsList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // New challenge form modal
  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeCategory, setChallengeCategory] = useState('care');
  const [challengeTarget, setChallengeTarget] = useState('7');
  const [challengeReward, setChallengeReward] = useState('150');
  const [challengeDuration, setChallengeDuration] = useState('14');
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, usersRes, plantsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminPlants(),
      ]);

      if (overviewRes.success) setOverview(overviewRes);
      if (usersRes.success) setUsersList(usersRes.users || []);
      if (plantsRes.success) setPlantsList(plantsRes.plants || []);
    } catch (err) {
      toastError('Admin Access Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const data = await api.updateUserRole(targetUser._id, newRole);
      if (data.success) {
        toastSuccess('Role Updated', `${targetUser.name} is now ${newRole}.`);
        setUsersList((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toastError('Update Error', err.message);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      setCreatingChallenge(true);
      const data = await api.createAdminChallenge({
        title: challengeTitle,
        description: challengeDesc,
        category: challengeCategory,
        targetCount: Number(challengeTarget),
        rewardXP: Number(challengeReward),
        durationDays: Number(challengeDuration),
      });

      if (data.success) {
        toastSuccess('Challenge Created! 🎯', `"${challengeTitle}" is now live.`);
        setShowNewChallengeModal(false);
        setChallengeTitle('');
        setChallengeDesc('');
        fetchAdminData();
      }
    } catch (err) {
      toastError('Challenge creation error', err.message);
    } finally {
      setCreatingChallenge(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
        <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
        <h2 style={{ fontSize: '1.5rem', color: '#991b1b', fontWeight: 800 }}>Access Denied</h2>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          You must have administrator credentials to access the Green Gamers Admin Dashboard.
        </p>
      </div>
    );
  }

  if (loading || !overview) {
    return <LoadingSpinner text="Accessing administrative control panel..." />;
  }

  const stats = overview.stats || {};

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '6px',
            }}
          >
            <ShieldAlert size={14} /> Institutional Administration
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Green Gamers Admin Console
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
            Platform health monitoring, challenge publication, user role management & moderation
          </p>
        </div>

        <button onClick={() => setShowNewChallengeModal(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Create New Challenge
        </button>
      </div>

      {/* Admin KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          icon={Users}
          title="Total Registered Planters"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active this week`}
          badgeText="Verified Accounts"
        />
        <StatCard
          icon={Sprout}
          title="Total Trees Cataloged"
          value={stats.totalPlants}
          subtitle="Across all university plots"
          badgeText="Life on Land"
          color="#059669"
          bgColor="#ecfdf5"
        />
        <StatCard
          icon={Droplets}
          title="Care Actions Logged"
          value={stats.totalCareActivities}
          subtitle="Watering, checks & pruning"
          badgeText="Habit Engine"
          color="#047857"
          bgColor="#d1fae5"
        />
        <StatCard
          icon={Globe}
          title="Total Carbon Impact"
          value={`${stats.estimatedTotalCO2SavedKg} kg`}
          subtitle="Platform annualized CO2"
          badgeText="SDG 13"
          color="#10b981"
          bgColor="#ecfdf5"
        />
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: '24px' }}>
        {[
          { id: 'overview', label: 'Platform Overview' },
          { id: 'users', label: `Planter Accounts (${usersList.length})` },
          { id: 'plants', label: `Flora Inventory (${plantsList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px',
              fontSize: '0.9375rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#059669' : '#6b7280',
              borderBottom: activeTab === tab.id ? '3px solid #059669' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Recent Activity */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Recent Registrations */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
              Recent Planter Registrations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {overview.recentUsers?.map((u) => (
                <div
                  key={u._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#f8faf9',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e382c' }}>{u.name}</p>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {u.email} • {u.college?.split(' ')[0]}
                    </span>
                  </div>
                  <LevelBadge level={u.level || 1} title={u.levelTitle} size="sm" showTitle={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Plants Registered */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
              Latest Trees Cataloged
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {overview.recentPlants?.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#f8faf9',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e382c' }}>{p.name}</p>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        By {p.userId?.name || 'User'} • {p.type?.split(' (')[0]}
                      </span>
                    </div>
                  </div>
                  <span className="status-pill status-healthy" style={{ fontSize: '0.6875rem' }}>
                    {p.healthStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planter Accounts Table */}
      {activeTab === 'users' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Planter</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Email</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Institution</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Level & XP</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Role</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#4b5563' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px', color: '#6b7280' }}>{u.college}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>Lvl {u.level}</span> ({u.xp} XP)
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          backgroundColor: u.role === 'admin' ? '#fee2e2' : '#ecfdf5',
                          color: u.role === 'admin' ? '#dc2626' : '#059669',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Flora Inventory Table */}
      {activeTab === 'plants' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Plant Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Species Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Planter</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Height</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Health</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Maturity</th>
                </tr>
              </thead>
              <tbody>
                {plantsList.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#059669', fontWeight: 600 }}>{p.type}</td>
                    <td style={{ padding: '14px 20px', color: '#4b5563' }}>{p.userId?.name || 'User'}</td>
                    <td style={{ padding: '14px 20px', color: '#111827' }}>{p.height} cm</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="status-pill status-healthy" style={{ fontSize: '0.6875rem' }}>
                        {p.healthStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>
                      {p.growthPercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showNewChallengeModal && (
        <Modal
          isOpen={showNewChallengeModal}
          onClose={() => setShowNewChallengeModal(false)}
          title="Publish New Sustainability Challenge"
          subtitle="Create an official platform challenge with reward XP and deadlines"
        >
          <form onSubmit={handleCreateChallenge}>
            <div className="form-group">
              <label className="form-label">Challenge Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 14-Day Monsoon Care Sprint"
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Rules *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Explain the required daily actions and criteria..."
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={challengeCategory}
                  onChange={(e) => setChallengeCategory(e.target.value)}
                >
                  <option value="care">💧 Care</option>
                  <option value="plantation">🌱 Plantation</option>
                  <option value="growth">📸 Growth</option>
                  <option value="streak">🔥 Streak</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={challengeTarget}
                  onChange={(e) => setChallengeTarget(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reward XP</label>
                <input
                  type="number"
                  className="form-input"
                  value={challengeReward}
                  onChange={(e) => setChallengeReward(e.target.value)}
                  min="10"
                  step="10"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowNewChallengeModal(false)}
                disabled={creatingChallenge}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={creatingChallenge}>
                {creatingChallenge ? 'Publishing...' : 'Publish Challenge'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
