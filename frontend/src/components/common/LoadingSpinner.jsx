import React from 'react';
import { Sprout } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading Green Gamers...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px',
        width: '100%',
      }}
    >
      <div
        className="animate-pulse-glow"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          border: '2px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          marginBottom: '16px',
        }}
      >
        <Sprout size={28} />
      </div>
      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0e382c' }}>{text}</p>
    </div>
  );
};
