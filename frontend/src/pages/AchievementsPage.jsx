import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BadgeCard } from '../components/gamification/BadgeCard';
import { LevelBadge } from '../components/common/LevelBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Award, Trophy, Sparkles, CheckCircle2, Lock, Flame, Shield } from 'lucide-react';

const ALL_BADGES_DATA = [
  {
    slug: 'first_plant',
    name: 'First Plant',
    description: 'Awarded for registering your very first plant on Green Gamers.',
    icon: '🌱',
    category: 'plantation',
    requirementType: 'plants_count',
    requirementValue: 1,
    xpReward: 50,
  },
  {
    slug: 'water_keeper',
    name: 'Water Keeper',
    description: 'Awarded after completing 10 watering care activities.',
    icon: '💧',
    category: 'care',
    requirementType: 'watering_count',
    requirementValue: 10,
    xpReward: 75,
  },
  {
    slug: 'growth_tracker',
    name: 'Growth Tracker',
    description: 'Awarded after submitting 5 verified growth photo updates.',
    icon: '📸',
    category: 'growth',
    requirementType: 'growth_photos',
    requirementValue: 5,
    xpReward: 100,
  },
  {
    slug: 'green_streak',
    name: 'Green Streak',
    description: 'Awarded for maintaining 7 consecutive days of plant care.',
    icon: '🔥',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 7,
    xpReward: 150,
  },
  {
    slug: 'plant_protector',
    name: 'Plant Protector',
    description: 'Awarded for completing 30 total plant care maintenance sessions.',
    icon: '🌳',
    category: 'care',
    requirementType: 'total_care',
    requirementValue: 30,
    xpReward: 200,
  },
  {
    slug: 'green_champion',
    name: 'Green Champion',
    description: 'Awarded for reaching Level 5 (Eco Steward) or higher.',
    icon: '🏆',
    category: 'level',
    requirementType: 'xp_level',
    requirementValue: 5,
    xpReward: 300,
  },
  {
    slug: 'biodiversity_advocate',
    name: 'Biodiversity Advocate',
    description: 'Awarded for planting and nurturing at least 4 distinct plant species.',
    icon: '🌿',
    category: 'plantation',
    requirementType: 'species_count',
    requirementValue: 4,
    xpReward: 150,
  },
  {
    slug: 'carbon_neutralizer',
    name: 'Carbon Neutralizer',
    description: 'Awarded for reaching 10 registered growing plants.',
    icon: '🌍',
    category: 'special',
    requirementType: 'plants_count',
    requirementValue: 10,
    xpReward: 250,
  },
];

const LEVELS_ROADMAP = [
  { level: 1, title: 'Seedling', minXp: 0, maxXp: 199, icon: '🌱', perk: 'Platform onboarding & single plant tracking' },
  { level: 2, title: 'Green Starter', minXp: 200, maxXp: 499, icon: '🌿', perk: 'Unlock 7-day care challenges' },
  { level: 3, title: 'Plant Protector', minXp: 500, maxXp: 899, icon: '🛡️', perk: 'Campus leaderboard eligibility' },
  { level: 4, title: 'Eco Warrior', minXp: 900, maxXp: 1399, icon: '⚔️', perk: 'Community photo milestone sharing' },
  { level: 5, title: 'Eco Steward', minXp: 1400, maxXp: 1999, icon: '🌳', perk: 'Campus reforestation team creation' },
  { level: 6, title: 'Green Champion', minXp: 2000, maxXp: 2999, icon: '🏆', perk: 'Priority verification & ambassador badge' },
  { level: 7, title: 'Earth Guardian', minXp: 3000, maxXp: 9999, icon: '🌍', perk: 'Master sustainability mentor status' },
];

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('badges');

  const earnedBadgesSlugs = (user?.badges || []).map((b) => b.slug);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Achievements & Badges
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Earn sustainability milestone badges, level up your profile, and celebrate care streaks
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LevelBadge level={user?.level || 1} title={user?.levelTitle} size="lg" />
          <span
            style={{
              backgroundColor: '#fef3c7',
              color: '#b45309',
              padding: '6px 14px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            {user?.xp || 0} Total XP
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: '24px' }}>
        {[
          { id: 'badges', label: `Milestone Badges (${user?.badges?.length || 0}/${ALL_BADGES_DATA.length})` },
          { id: 'levels', label: '7-Level Gamification Roadmap' },
          { id: 'rules', label: 'XP Reward Matrix' },
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

      {/* Tab 1: Badges Grid */}
      {activeTab === 'badges' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {ALL_BADGES_DATA.map((badge) => {
            const isEarned = earnedBadgesSlugs.includes(badge.slug);
            const earnedInfo = (user?.badges || []).find((b) => b.slug === badge.slug);

            return (
              <BadgeCard
                key={badge.slug}
                badge={badge}
                isEarned={isEarned}
                earnedAt={earnedInfo?.earnedAt}
                progress={isEarned ? badge.requirementValue : 1}
                maxRequirement={badge.requirementValue}
              />
            );
          })}
        </div>
      )}

      {/* Tab 2: Levels Roadmap */}
      {activeTab === 'levels' && (
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '20px' }}>
            Official Planter Progression Ladder
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {LEVELS_ROADMAP.map((lvl) => {
              const isCurrent = user?.level === lvl.level;
              const isPassed = (user?.level || 1) > lvl.level;

              return (
                <div
                  key={lvl.level}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    backgroundColor: isCurrent ? '#ecfdf5' : isPassed ? '#f8faf9' : '#ffffff',
                    border: isCurrent ? '2px solid #059669' : '1px solid #e5e7eb',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '2rem' }}>{lvl.icon}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0e382c' }}>
                          Level {lvl.level}: {lvl.title}
                        </h4>
                        {isCurrent && (
                          <span
                            style={{
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            CURRENT RANK
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
                        {lvl.perk}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                      {lvl.minXp} – {lvl.maxXp} XP
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {isPassed ? '✓ Achieved' : isCurrent ? 'In Progress' : 'Locked'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: XP Reward Matrix */}
      {activeTab === 'rules' && (
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
            Eco XP Reward Matrix & Point Rules
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '20px' }}>
            Every care routine you log produces verified points that calculate your leaderboard standing.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Action / Milestone</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Points Earned</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Cooldown / Rule</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { action: 'New Plant Registration', xp: '+50 XP', rule: 'One-time per new sapling cataloged' },
                  { action: 'Watering Log', xp: '+10 XP', rule: 'Awarded every 12-24 hours per plant' },
                  { action: 'Growth Height Update', xp: '+20 XP', rule: 'Periodic measurement increment' },
                  { action: 'Growth Photo Evidence', xp: '+15 XP Bonus', rule: 'When photo attached to measurement' },
                  { action: 'Pruning / Fertilizing', xp: '+10 XP', rule: 'Logged routine maintenance' },
                  { action: 'Health Check Inspection', xp: '+5 XP', rule: 'Foliage and pest check' },
                  { action: 'Challenge Completion', xp: '+100 - +300 XP', rule: 'Upon hitting all challenge requirements' },
                  { action: 'Community Post Share', xp: '+15 XP', rule: 'Sharing tips or milestones with peers' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{row.action}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#059669' }}>{row.xp}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
