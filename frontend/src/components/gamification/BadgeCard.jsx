import React from 'react';
import { Award, CheckCircle, Lock } from 'lucide-react';

export const BadgeCard = ({
  badge,
  isEarned = false,
  earnedAt,
  progress = 0,
  maxRequirement = 1,
}) => {
  return (
    <div
      className="card card-hover"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: isEarned ? '#ffffff' : '#fcfcfc',
        border: isEarned ? '1.5px solid #a7f3d0' : '1px dashed #e2e8f0',
        position: 'relative',
        opacity: isEarned ? 1 : 0.82,
      }}
    >
      {/* Earned Stamp */}
      {isEarned ? (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            fontWeight: 800,
            backgroundColor: '#ecfdf5',
            padding: '2px 8px',
            borderRadius: '999px',
          }}
        >
          <CheckCircle size={12} /> UNLOCKED
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}
        >
          <Lock size={12} /> LOCKED
        </div>
      )}

      {/* Badge Icon Circle */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: isEarned ? '#ecfdf5' : '#f3f4f6',
          border: isEarned ? '3px solid #10b981' : '2px dashed #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '14px',
          boxShadow: isEarned ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none',
          filter: isEarned ? 'none' : 'grayscale(80%)',
        }}
      >
        {badge.icon || '🌱'}
      </div>

      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e382c', marginBottom: '6px' }}>
        {badge.name}
      </h4>

      <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.4, marginBottom: '14px' }}>
        {badge.description}
      </p>

      {/* Unlock Date or Locked Progress */}
      {isEarned ? (
        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: 'auto' }}>
          Earned on {new Date(earnedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ) : (
        <div style={{ width: '100%', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#9ca3af', marginBottom: '4px' }}>
            <span>Requirement: {badge.requirementType?.replace('_', ' ')}</span>
            <span>Target: {badge.requirementValue || 1}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.round(((progress || 0) / (badge.requirementValue || 1)) * 100))}%`,
                height: '100%',
                backgroundColor: '#cbd5e1',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
