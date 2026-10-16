import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LevelBadge } from '../components/common/LevelBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Flame,
  Sprout,
  Droplets,
  Search,
  Filter,
} from 'lucide-react';

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'all' && filterValue.trim()) {
        params.filterType = filterType;
        params.filterValue = filterValue.trim();
      }
      const data = await api.getLeaderboard(params);
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
        setCurrentUserRank(data.currentUserRank);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType]);

  const handleSearchFilter = (e) => {
    e.preventDefault();
    fetchLeaderboard();
  };

  if (loading) {
    return <LoadingSpinner text="Ranking planters across institutions..." />;
  }

  const top3 = leaderboard.slice(0, 3);
  const restLeaderboard = leaderboard.slice(3);

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
              backgroundColor: '#fef3c7',
              color: '#b45309',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '6px',
            }}
          >
            <Trophy size={14} /> National Sustainability Standings
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Green Gamers Leaderboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
            Real-time rankings based on verified plant counts, care actions, and active streaks
          </p>
        </div>

        {/* Current User Standings Pill */}
        {currentUserRank && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              Rank #{currentUserRank.rank}
            </span>
            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '12px' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c' }}>
                {user?.name} (You)
              </p>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                {user?.xp} Eco XP • Level {user?.level}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'monthly', label: 'This Month' },
            { id: 'weekly', label: 'This Week' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: timeframe === t.id ? '#059669' : '#f3f4f6',
                color: timeframe === t.id ? '#ffffff' : '#4b5563',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter by College / City */}
        <form onSubmit={handleSearchFilter} style={{ display: 'flex', gap: '8px', flex: '1 1 300px' }}>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '130px', padding: '8px 10px', fontSize: '0.8125rem' }}
          >
            <option value="all">Global</option>
            <option value="college">By College</option>
            <option value="city">By City</option>
          </select>

          {filterType !== 'all' && (
            <input
              type="text"
              className="form-input"
              placeholder={`Enter ${filterType}...`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              style={{ fontSize: '0.875rem' }}
            />
          )}

          {filterType !== 'all' && (
            <button type="submit" className="btn btn-primary btn-sm">
              Apply
            </button>
          )}
        </form>
      </div>

      {/* TOP 3 PODIUM SPECIAL TREATMENT */}
      {top3.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'end',
            marginBottom: '12px',
          }}
        >
          {/* Rank 2 (Silver) */}
          <div
            className="card card-hover"
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              border: '2px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              order: 1,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#94a3b8',
                color: '#ffffff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                marginBottom: '12px',
              }}
            >
              #2
            </div>
            <img
              src={top3[1].profileImage}
              alt={top3[1].name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #cbd5e1', marginBottom: '12px' }}
            />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0e382c' }}>
              {top3[1].name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>
              {top3[1].college}
            </p>
            <LevelBadge level={top3[1].level} title={top3[1].levelTitle} size="sm" />
            <div style={{ marginTop: '16px', fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              {top3[1].xp} XP
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {top3[1].plantsCount} Plants • {top3[1].careActivitiesCount} Care Logs
            </span>
          </div>

          {/* Rank 1 (Gold - Center & Elevated) */}
          <div
            className="card card-hover"
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              backgroundColor: '#fffdf5',
              border: '2px solid #f59e0b',
              boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              order: 0,
              transform: 'scale(1.03)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              }}
            >
              👑 #1
            </div>
            <img
              src={top3[0].profileImage}
              alt={top3[0].name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f59e0b', marginBottom: '12px' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0e382c' }}>
              {top3[0].name}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '8px' }}>
              {top3[0].college}
            </p>
            <LevelBadge level={top3[0].level} title={top3[0].levelTitle} size="md" />
            <div style={{ marginTop: '16px', fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
              {top3[0].xp} XP
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {top3[0].plantsCount} Plants • {top3[0].careActivitiesCount} Care Logs • {top3[0].streak}d Streak
            </span>
          </div>

          {/* Rank 3 (Bronze) */}
          <div
            className="card card-hover"
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fffaf5',
              border: '2px solid #ea580c',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              order: 2,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ea580c',
                color: '#ffffff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                marginBottom: '12px',
              }}
            >
              #3
            </div>
            <img
              src={top3[2].profileImage}
              alt={top3[2].name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ea580c', marginBottom: '12px' }}
            />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0e382c' }}>
              {top3[2].name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>
              {top3[2].college}
            </p>
            <LevelBadge level={top3[2].level} title={top3[2].levelTitle} size="sm" />
            <div style={{ marginTop: '16px', fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              {top3[2].xp} XP
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {top3[2].plantsCount} Plants • {top3[2].careActivitiesCount} Care Logs
            </span>
          </div>
        </div>
      )}

      {/* FULL LEADERBOARD TABLE */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c', width: '80px' }}>Rank</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Planter</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>College / Org</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Plants</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Care Actions</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c' }}>Level</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: '#0e382c', textAlign: 'right' }}>Total Eco XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => {
                const isMe = item._id === user?._id;
                return (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: isMe ? '#ecfdf5' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: item.rank <= 3 ? '#b45309' : '#4b5563' }}>
                      #{item.rank}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.profileImage}
                          alt={item.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontWeight: 700, color: '#0e382c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {item.name} {isMe && <span style={{ color: '#059669', fontSize: '0.75rem' }}>(You)</span>}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {item.streak}d streak
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#4b5563' }}>{item.college || 'Green Campus'}</td>
                    <td style={{ padding: '14px 20px', color: '#111827', fontWeight: 600 }}>{item.plantsCount}</td>
                    <td style={{ padding: '14px 20px', color: '#111827', fontWeight: 600 }}>{item.careActivitiesCount}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <LevelBadge level={item.level} title={item.levelTitle} size="sm" showTitle={false} />
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                      {item.xp?.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
