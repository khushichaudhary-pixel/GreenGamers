import React from 'react';
import { Sprout } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sprout,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          marginBottom: '16px',
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '420px', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
