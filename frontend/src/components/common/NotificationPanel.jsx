import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, ExternalLink } from 'lucide-react';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="card animate-fade-in"
      style={{
        position: 'absolute',
        top: '52px',
        right: '0',
        width: '360px',
        maxHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8faf9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#059669" />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0e382c' }}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </span>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              fontSize: '0.75rem',
              color: '#059669',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, maxHeight: '360px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            No new notifications 🌱
          </div>
        ) : (
          notifications.slice(0, 6).map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (!n.read) markAsRead(n._id);
                if (n.link) {
                  navigate(n.link);
                  onClose();
                }
              }}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: n.read ? '#ffffff' : '#f0fdf4',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = n.read ? '#ffffff' : '#f0fdf4')
              }
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.25rem' }}>{n.icon || '🌱'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: n.read ? 600 : 700, color: '#111827' }}>
                    {n.title}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '2px' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!n.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#059669',
                      marginTop: '4px',
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          backgroundColor: '#f8faf9',
        }}
      >
        <button
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#059669',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          View All Notifications <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};
