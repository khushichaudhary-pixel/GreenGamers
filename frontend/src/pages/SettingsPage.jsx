import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Save,
  Check,
  Shield,
  Sliders,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [city, setCity] = useState(user?.city || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(
    user?.settings?.emailNotifications ?? true
  );
  const [careReminders, setCareReminders] = useState(user?.settings?.careReminders ?? true);
  const [challengeAlerts, setChallengeAlerts] = useState(user?.settings?.challengeAlerts ?? true);
  const [communityUpdates, setCommunityUpdates] = useState(
    user?.settings?.communityUpdates ?? true
  );
  const [measurementUnit, setMeasurementUnit] = useState(
    user?.settings?.measurementUnit || 'cm'
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const data = await api.updateProfile({
        name,
        bio,
        college,
        city,
        profileImage,
        settings: {
          emailNotifications,
          careReminders,
          challengeAlerts,
          communityUpdates,
          measurementUnit,
        },
      });

      if (data.success) {
        toastSuccess('Profile Updated! ✅', 'Your settings have been saved.');
        await refreshUser();
      }
    } catch (err) {
      toastError('Update Error', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toastError('Mismatch', 'New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      const data = await api.changePassword({
        currentPassword,
        newPassword,
      });

      if (data.success) {
        toastSuccess('Password Changed! 🔒', 'Your security credentials were updated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      toastError('Password Change Failed', err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
          Account & App Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
          Customize your planter profile, notification triggers, and security preferences
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <User size={20} color="#059669" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
            Profile Details
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">College / Organization</label>
              <input
                type="text"
                className="form-input"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL</label>
            <input
              type="text"
              className="form-input"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Planter Statement</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* 2. Notification Preferences */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e382c', marginBottom: '16px' }}>
              Notification & Reminder Preferences
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Plant Hydration Reminders', desc: 'Alerts when your registered plants are due for watering', checked: careReminders, set: setCareReminders },
                { label: 'Challenge Alerts & Deadlines', desc: 'Updates when active sustainability challenges are closing', checked: challengeAlerts, set: setChallengeAlerts },
                { label: 'Community Mentions & Comments', desc: 'Notifications when fellow planters like or comment on your milestones', checked: communityUpdates, set: setCommunityUpdates },
              ].map((n, idx) => (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#f8faf9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{n.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{n.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={n.checked}
                    onChange={(e) => n.set(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security & Password Change */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Lock size={20} color="#059669" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Repeat new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-outline" disabled={savingPassword}>
              <Lock size={16} /> {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
