import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  TrendingUp,
  Droplets,
  BarChart3,
  Award,
  Target,
  Trophy,
  Users,
  Bell,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeMobileSidebar }) => {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Plants', path: '/plants', icon: Sprout },
    { label: 'Add Plant', path: '/plants/add', icon: PlusCircle },
    { label: 'Growth Timeline', path: '/growth-timeline', icon: TrendingUp },
    { label: 'Care Tracker', path: '/care-tracker', icon: Droplets },
    { label: 'Progress Report', path: '/progress-report', icon: BarChart3 },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Challenges', path: '/challenges', icon: Target },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Community Feed', path: '/community', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeMobileSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 750,
          }}
          className="mobile-only"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 68px)',
          position: 'sticky',
          top: '68px',
          overflowY: 'auto',
          flexShrink: 0,
          zIndex: 780,
          transition: 'transform 0.25s ease',
        }}
      >
        <div style={{ padding: '20px 16px' }}>
          {/* User Quick Gamification Banner */}
          <div
            style={{
              padding: '14px',
              backgroundColor: '#ecfdf5',
              borderRadius: '12px',
              border: '1px solid #d1fae5',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Level {user?.level || 1} • {user?.levelTitle || 'Seedling'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 800, color: '#dc2626' }}>
                <Flame size={13} /> {user?.streak || 1}d Streak
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c', marginBottom: '6px' }}>
              <span>Eco XP</span>
              <span>{user?.xp || 0} XP</span>
            </div>
            {/* Progress bar to next rank */}
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#cbd5e1',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${user?.levelInfo?.progressPercent || 40}%`,
                  height: '100%',
                  backgroundColor: '#059669',
                  borderRadius: '999px',
                }}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/plants'}
                  onClick={closeMobileSidebar}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#059669' : '#4b5563',
                    backgroundColor: isActive ? '#f0fdf4' : 'transparent',
                    borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {isAdmin && (
              <>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '8px 0' }} />
                <NavLink
                  to="/admin"
                  onClick={closeMobileSidebar}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : '#059669',
                    backgroundColor: isActive ? '#059669' : '#ecfdf5',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <ShieldAlert size={18} />
                  <span>Admin Panel</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bottom logout action */}
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#dc2626',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
