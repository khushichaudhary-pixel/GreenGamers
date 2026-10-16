import React from 'react';
import { Award, ShieldCheck, Flame, TreePine, Sparkles, Globe } from 'lucide-react';

const LEVEL_CONFIG = {
  1: { title: 'Seedling', icon: '🌱', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  2: { title: 'Green Starter', icon: '🌿', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
  3: { title: 'Plant Protector', icon: '🛡️', color: '#047857', bg: '#e0f2fe', border: '#bae6fd' },
  4: { title: 'Eco Warrior', icon: '⚔️', color: '#0284c7', bg: '#f0fdf4', border: '#86efac' },
  5: { title: 'Eco Steward', icon: '🌳', color: '#065f46', bg: '#dcfce7', border: '#4ade80' },
  6: { title: 'Green Champion', icon: '🏆', color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
  7: { title: 'Earth Guardian', icon: '🌍', color: '#7c3aed', bg: '#f3e8ff', border: '#d8b4fe' },
};

export const LevelBadge = ({ level = 1, title, size = 'md', showTitle = true }) => {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const displayTitle = title || config.title;

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.75rem', gap: '4px' },
    md: { padding: '4px 12px', fontSize: '0.8125rem', gap: '6px' },
    lg: { padding: '6px 16px', fontSize: '0.9375rem', gap: '8px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: '999px',
        fontWeight: 700,
        letterSpacing: '0.01em',
        ...sizeStyles[size],
      }}
    >
      <span>{config.icon}</span>
      <span>Lvl {level}</span>
      {showTitle && <span style={{ opacity: 0.9 }}>• {displayTitle}</span>}
    </span>
  );
};
