import React, { useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Target, Trophy, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export const ChallengeCard = ({ challenge, onChallengeUpdated }) => {
  const { toastSuccess, toastError, toastCelebration } = useToast();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const isJoined = challenge.isJoined;
  const isCompleted = challenge.status === 'completed';
  const progress = challenge.progress || 0;
  const target = challenge.targetCount || 7;

  const handleJoin = async () => {
    try {
      setLoading(true);
      const data = await api.joinChallenge(challenge._id);
      if (data.success) {
        toastSuccess('Challenge Joined! 🎯', `Started "${challenge.title}"!`);
        if (onChallengeUpdated) onChallengeUpdated();
      }
    } catch (err) {
      toastError('Failed to join challenge', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementProgress = async () => {
    try {
      setLoading(true);
      const data = await api.updateChallengeProgress(challenge._id, 1);
      if (data.success) {
        if (data.completed) {
          toastCelebration(
            '🏆 Challenge Completed!',
            `Congratulations! You completed "${challenge.title}" and won +${challenge.rewardXP} XP!`,
            challenge.rewardXP
          );
        } else {
          toastSuccess('Progress Logged! 📈', `Updated progress: ${data.userChallenge.progress}/${target}`);
        }
        await refreshUser();
        if (onChallengeUpdated) onChallengeUpdated();
      }
    } catch (err) {
      toastError('Progress update error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: isCompleted ? '1.5px solid #a7f3d0' : isJoined ? '1.5px solid #cbd5e1' : '1px solid var(--border-subtle)',
        backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
      }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: isCompleted ? '#dcfce7' : '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              {challenge.icon || '🏆'}
            </div>
            <div>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0e382c', lineHeight: 1.3 }}>
                {challenge.title}
              </h4>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', textTransform: 'capitalize' }}>
                {challenge.category} Challenge • {challenge.durationDays} Days
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            <Sparkles size={13} /> +{challenge.rewardXP} XP
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5, margin: '14px 0 16px 0' }}>
          {challenge.description}
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <ProgressBar
            value={progress}
            max={target}
            label="Challenge Progress"
            sublabel={isCompleted ? 'COMPLETED' : `${progress} of ${target} completed`}
            height={8}
            color={isCompleted ? '#059669' : '#10b981'}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div>
        {isCompleted ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              color: '#065f46',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            <CheckCircle size={16} /> Reward Claimed (+{challenge.rewardXP} XP)
          </div>
        ) : isJoined ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <button
              onClick={handleIncrementProgress}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Updating...' : `Log Activity (${progress + 1}/${target})`}
            </button>
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            {loading ? 'Joining...' : 'Join Challenge'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
