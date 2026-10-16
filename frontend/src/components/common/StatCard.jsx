import React from 'react';

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'positive',
  color = '#059669',
  bgColor = '#ecfdf5',
  onClick,
}) => {
  return (
    <div
      className={`card ${onClick ? 'card-hover' : ''}`}
      onClick={onClick}
      style={{
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>{title}</span>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.875rem',
            fontWeight: 800,
            color: '#0e382c',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {badgeText && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: badgeType === 'positive' ? '#d1fae5' : '#fef3c7',
              color: badgeType === 'positive' ? '#047857' : '#b45309',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ marginTop: '6px', fontSize: '0.8125rem', color: '#6b7280' }}>{subtitle}</p>
      )}
    </div>
  );
};
