import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { LevelBadge } from './LevelBadge';
import { NotificationPanel } from './NotificationPanel';
import {
  Sprout,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              style={{
                padding: '8px',
                borderRadius: '8px',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Toggle Menu"
            >
              <Menu size={22} />
            </button>
          )}

          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
              }}
            >
              <Sprout size={22} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0e382c',
                  letterSpacing: '-0.02em',
                }}
              >
                GREEN GAMERS
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation (If on Landing or Public) */}
        {!isAuthenticated && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
            }}
            className="hidden-mobile"
          >
            <Link to="/" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9375rem' }}>
              Home
            </Link>
            <a href="#why-us" style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>
              Why Us
            </a>
            <a href="#how-it-works" style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>
              How It Works
            </a>
            <a href="#sdg-impact" style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>
              SDG Impact
            </a>
            <Link to="/leaderboard" style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>
              Leaderboard
            </Link>
            <Link to="/community" style={{ fontWeight: 600, color: '#4b5563', fontSize: '0.9375rem' }}>
              Community
            </Link>
          </nav>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <>
              {/* + Add Plant Button */}
              <Link to="/plants/add" className="btn btn-primary btn-sm" style={{ display: 'flex' }}>
                <PlusCircle size={16} />
                <span>Add Plant</span>
              </Link>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: showNotifications ? '#ecfdf5' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151',
                    transition: 'all 0.15s ease',
                  }}
                  title="Notifications"
                >
                  <Bell size={19} color={showNotifications ? '#059669' : '#4b5563'} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ffffff',
                      }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <NotificationPanel
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              {/* User Avatar & Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '4px 8px 4px 4px',
                    borderRadius: '999px',
                    backgroundColor: '#f8faf9',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c', lineHeight: 1.2 }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: 600 }}>
                      {user?.xp || 0} XP
                    </span>
                  </div>
                  <ChevronDown size={14} color="#6b7280" />
                </button>

                {showUserMenu && (
                  <div
                    className="card animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: '48px',
                      right: 0,
                      width: '220px',
                      padding: '8px',
                      zIndex: 1000,
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                        {user?.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </p>
                      <div style={{ marginTop: '8px' }}>
                        <LevelBadge level={user?.level || 1} title={user?.levelTitle} size="sm" />
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        borderRadius: '6px',
                      }}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/settings"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        borderRadius: '6px',
                      }}
                    >
                      <Settings size={16} /> Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#059669',
                          borderRadius: '6px',
                          backgroundColor: '#ecfdf5',
                        }}
                      >
                        <Shield size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        borderRadius: '6px',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
