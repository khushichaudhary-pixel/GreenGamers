import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ChallengeCard } from '../components/gamification/ChallengeCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Target, Trophy, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await api.getChallenges();
      if (data.success) {
        setChallenges(data.challenges || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter((c) => {
    if (activeFilter === 'active') return c.isJoined && c.status === 'active';
    if (activeFilter === 'completed') return c.status === 'completed';
    if (activeFilter === 'available') return !c.isJoined;
    return true;
  });

  const totalRewardsAvailable = challenges.reduce((acc, c) => acc + (c.rewardXP || 0), 0);
  const completedCount = challenges.filter((c) => c.status === 'completed').length;

  if (loading) {
    return <LoadingSpinner text="Fetching active sustainability challenges..." />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #0e382c 0%, #065f46 100%)',
          color: '#ffffff',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(5, 150, 105, 0.4)',
                color: '#6ee7b7',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              <Target size={14} /> Habit Formation Challenges
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              Green Sustainability Challenges
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', marginTop: '4px' }}>
              Complete time-bound planting and watering routines to earn substantial Eco XP bonus pools
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '12px 20px', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef3c7' }}>
                {completedCount}/{challenges.length}
              </span>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: `All Challenges (${challenges.length})` },
          { id: 'active', label: 'In Progress / Joined' },
          { id: 'available', label: 'Available to Join' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: activeFilter === tab.id ? '#059669' : '#ffffff',
              color: activeFilter === tab.id ? '#ffffff' : '#4b5563',
              border: activeFilter === tab.id ? '1px solid #059669' : '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            onChallengeUpdated={fetchChallenges}
          />
        ))}
      </div>
    </div>
  );
};
