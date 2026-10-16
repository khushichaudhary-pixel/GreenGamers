import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../common/ProgressBar';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Droplets,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const PlantCard = ({ plant, onUpdate, onOpenGrowthModal }) => {
  const { toastSuccess, toastError } = useToast();
  const { refreshUser } = useAuth();
  const [watering, setWatering] = useState(false);
  const [justWatered, setJustWatered] = useState(false);

  const getHealthClass = (status) => {
    switch (status) {
      case 'Healthy':
      case 'Thriving':
        return 'status-healthy';
      case 'Needs Care':
        return 'status-needs-care';
      case 'Dormant':
        return 'status-dormant';
      default:
        return 'status-healthy';
    }
  };

  const handleQuickWater = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (watering || justWatered) return;

    try {
      setWatering(true);
      const data = await api.logCareActivity(plant._id, {
        activityType: 'watered',
        notes: 'Quick daily watering from dashboard.',
      });

      if (data.success) {
        setJustWatered(true);
        toastSuccess('Plant Watered! 💧', `+10 Eco XP earned for caring for ${plant.name}`, 10);
        await refreshUser();
        if (onUpdate) onUpdate(data.plant);
        setTimeout(() => setJustWatered(false), 8000);
      }
    } catch (err) {
      toastError('Watering failed', err.message);
    } finally {
      setWatering(false);
    }
  };

  // Calculate days since planted
  const daysOld = plant.plantingDate
    ? Math.max(1, Math.floor((new Date() - new Date(plant.plantingDate)) / (1000 * 60 * 60 * 24)))
    : 1;

  // Calculate hours since last watered
  const hoursSinceWater = plant.lastWatered
    ? Math.floor((new Date() - new Date(plant.lastWatered)) / (1000 * 60 * 60))
    : 48;

  const needsWater = hoursSinceWater >= 24;

  return (
    <div
      className="card card-hover animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Top Image & Species Badge */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={plant.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80'}
          alt={plant.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Health status badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`status-pill ${getHealthClass(plant.healthStatus)}`}>
            {plant.healthStatus}
          </span>
        </div>

        {/* XP earned badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(14, 56, 44, 0.85)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={12} color="#10b981" /> {plant.xpEarned || 50} XP
        </div>

        {/* Urgent Needs Water Indicator */}
        {needsWater && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <AlertTriangle size={11} /> Needs Water ({hoursSinceWater}h ago)
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '8px' }}>
          <h4
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--primary-forest)',
              lineHeight: 1.3,
            }}
          >
            {plant.name}
          </h4>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#059669',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {plant.type}
          </p>
        </div>

        {/* Meta tags */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} color="#9ca3af" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {plant.location || 'Home Garden'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} color="#9ca3af" />
            <span>Age: {daysOld} days • Height: {plant.height || 15} cm</span>
          </div>
        </div>

        {/* Growth Bar */}
        <div style={{ marginBottom: '16px', marginTop: 'auto' }}>
          <ProgressBar
            value={plant.growthPercentage || 15}
            max={100}
            label="Growth Stage"
            sublabel={`${plant.growthPercentage || 15}%`}
            height={6}
            color="#059669"
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={handleQuickWater}
            disabled={watering || justWatered}
            className={`btn btn-sm ${justWatered ? 'btn-secondary' : 'btn-primary'}`}
            style={{
              padding: '8px 10px',
              fontSize: '0.8125rem',
            }}
            title="Quickly log watering and earn +10 XP"
          >
            {justWatered ? (
              <>
                <Check size={14} color="#059669" /> Watered
              </>
            ) : (
              <>
                <Droplets size={14} /> Water (+10XP)
              </>
            )}
          </button>

          <Link
            to={`/plants/${plant._id}`}
            className="btn btn-outline btn-sm"
            style={{
              padding: '8px 10px',
              fontSize: '0.8125rem',
            }}
          >
            Details <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
