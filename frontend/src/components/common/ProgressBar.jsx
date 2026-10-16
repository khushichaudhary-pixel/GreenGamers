import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  sublabel = '',
  height = 8,
  color = '#059669',
  showPercent = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%' }}>
      {(label || sublabel || showPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.8125rem',
          }}
        >
          <span style={{ fontWeight: 600, color: '#374151' }}>{label}</span>
          <span style={{ color: '#6b7280', fontWeight: 500 }}>
            {sublabel || (showPercent ? `${percentage}%` : `${value} / ${max}`)}
          </span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#e5e7eb',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '999px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};
