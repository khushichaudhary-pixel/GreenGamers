import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Bell,
  Check,
  Droplets,
  Camera,
  Sparkles,
  Trophy,
  Award,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  const getIconForType = (type) => {
    switch (type) {
      case 'reminder':
        return <Droplets size={20} color="#059669" />;
      case 'growth':
        return <Camera size={20} color="#0891b2" />;
      case 'xp':
        return <Sparkles size={20} color="#d97706" />;
      case 'badge':
        return <Award size={20} color="#7c3aed" />;
      case 'challenge':
      case 'leaderboard':
        return <Trophy size={20} color="#ea580c" />;
      default:
        return <Bell size={20} color="#059669" />;
    }
  };

  if (loading && notifications.length === 0) {
    return <LoadingSpinner text="Retrieving notifications..." />;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Notifications & Care Reminders
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Stay updated on watering intervals, XP milestones, and challenge updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You are all caught up! You will receive reminders here when your plants need hydration or when you earn badges."
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {notifications.map((n, idx) => (
            <div
              key={n._id || idx}
              onClick={() => {
                if (!n.read) markAsRead(n._id);
                if (n.link) navigate(n.link);
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '18px 24px',
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: n.read ? '#f3f4f6' : '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIconForType(n.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: n.read ? 600 : 800,
                        color: '#0e382c',
                      }}
                    >
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span
                        style={{
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '999px',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#4b5563', marginTop: '4px', lineHeight: 1.4 }}>
                    {n.message}
                  </p>

                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '6px', display: 'block' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {n.link && (
                  <span style={{ color: '#059669', display: 'flex' }}>
                    <ExternalLink size={16} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
