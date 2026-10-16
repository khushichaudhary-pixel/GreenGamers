import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LevelBadge } from '../components/common/LevelBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { BadgeCard } from '../components/gamification/BadgeCard';
import { PlantCard } from '../components/plants/PlantCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  User,
  Mail,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  Flame,
  Sprout,
  Droplets,
  Award,
  Globe,
  Edit3,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setLoading(true);
        const data = await api.getPlants();
        if (data.success) {
          setPlants(data.plants || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlants();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your planter profile..." />;
  }

  const levelInfo = user?.levelInfo || {
    level: user?.level || 5,
    levelTitle: user?.levelTitle || 'Eco Steward',
    currentXp: user?.xp || 1680,
    minXp: 1400,
    maxXp: 2000,
    progressPercent: 46,
    xpToNextLevel: 320,
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Profile Hero Card */}
      <div
        className="card"
        style={{
          padding: '36px',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={
                user?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'User'}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ecfdf5',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
                  {user?.name}
                </h1>
                <LevelBadge level={user?.level || 1} title={user?.levelTitle} size="md" />
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={15} color="#9ca3af" /> {user?.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={15} color="#9ca3af" /> {user?.college || 'Green Campus'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="#9ca3af" /> {user?.city || 'Bangalore'}
                </span>
              </div>

              {user?.bio && (
                <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '12px', maxWidth: '600px', lineHeight: 1.5 }}>
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Eco XP Total Box */}
          <div
            style={{
              backgroundColor: '#ecfdf5',
              padding: '16px 24px',
              borderRadius: '16px',
              border: '1.5px solid #a7f3d0',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
              Lifetime Eco XP
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', lineHeight: 1.2 }}>
              {user?.xp || 0} XP
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {levelInfo.xpToNextLevel} XP to Level {levelInfo.level + 1}
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
          <ProgressBar
            value={levelInfo.currentXp - levelInfo.minXp}
            max={levelInfo.maxXp - levelInfo.minXp}
            label={`Progression to Level ${levelInfo.level + 1}`}
            sublabel={`${levelInfo.currentXp} / ${levelInfo.maxXp} XP`}
            height={8}
          />
        </div>
      </div>

      {/* "Your Green Journey" Sustainability Summary */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '20px' }}>
          Your Green Journey Contribution
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
              {plants.length}
            </span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
              Registered Plants
            </p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Trees & urban flora nurtured</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
              48
            </span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
              Care Activities
            </p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Watering, pruning & nutrition</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
              {user?.streak || 18} Days
            </span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>
              Care Streak
            </p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Continuous active habit</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
              {user?.badges?.length || 5}
            </span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>
              Unlocked Badges
            </p>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Milestones claimed</span>
          </div>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
          Earned Badges Showcase ({user?.badges?.length || 0})
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {(user?.badges || []).map((badge) => (
            <BadgeCard
              key={badge.slug}
              badge={badge}
              isEarned={true}
              earnedAt={badge.earnedAt}
            />
          ))}
        </div>
      </div>

      {/* User's Plant Showcase */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
          Registered Plants ({plants.length})
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {plants.map((plant) => (
            <PlantCard key={plant._id} plant={plant} />
          ))}
        </div>
      </div>
    </div>
  );
};
