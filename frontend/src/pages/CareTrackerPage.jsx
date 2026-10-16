import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { QuickCareModal } from '../components/plants/QuickCareModal';
import {
  Droplets,
  Sparkles,
  Scissors,
  HeartPulse,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';

const CARE_TYPES = [
  { type: 'watered', label: 'Watering', icon: Droplets, xp: 10, color: '#059669', bg: '#ecfdf5' },
  { type: 'fertilized', label: 'Fertilizing', icon: Sparkles, xp: 10, color: '#10b981', bg: '#d1fae5' },
  { type: 'pruned', label: 'Pruning / Trimming', icon: Scissors, xp: 10, color: '#047857', bg: '#e0f2fe' },
  { type: 'checked_health', label: 'Health Check', icon: HeartPulse, xp: 5, color: '#0891b2', bg: '#ecfeff' },
  { type: 'mulching', label: 'Mulch & Soil Aeration', icon: Layers, xp: 10, color: '#d97706', bg: '#fef3c7' },
];

export const CareTrackerPage = () => {
  const [plants, setPlants] = useState([]);
  const [careLogs, setCareLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlantForCare, setSelectedPlantForCare] = useState(null);

  const { toastSuccess, toastError } = useToast();
  const { user, refreshUser } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plantsRes, careRes] = await Promise.all([
        api.getPlants(),
        api.getCareActivities(),
      ]);

      if (plantsRes.success) setPlants(plantsRes.plants || []);
      if (careRes.success) setCareLogs(careRes.careActivities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickWater = async (plant) => {
    try {
      const data = await api.logCareActivity(plant._id, {
        activityType: 'watered',
        notes: 'Daily care checklist hydration.',
      });

      if (data.success) {
        toastSuccess('Watered! 💧', `+10 Eco XP earned for ${plant.name}`, 10);
        await refreshUser();
        fetchData();
      }
    } catch (err) {
      toastError('Watering failed', err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your plant care schedule..." />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Care & Watering Tracker
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Maintain consistent watering routines, log soil nourishment, and preserve your Green Streak
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '8px 16px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.875rem',
          }}
        >
          <Flame size={18} /> {user?.streak || 1} Day Active Streak
        </div>
      </div>

      {/* Quick Action Activity Types Reference Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {CARE_TYPES.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.type}
              className="card"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: c.bg,
                border: `1px solid ${c.color}30`,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.color,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e382c' }}>{c.label}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: c.color }}>
                  +{c.xp} Eco XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Layout: Daily Plant Checklist & Recent Care Feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left: Plant Hydration & Care Checklist */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                Plant Hydration Checklist
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                One-click watering and care logging
              </p>
            </div>
            <span
              style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {plants.length} Plants
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plants.map((plant) => {
              const hoursSinceWater = plant.lastWatered
                ? Math.floor((new Date() - new Date(plant.lastWatered)) / (1000 * 60 * 60))
                : 48;
              const isUrgent = hoursSinceWater >= 24;

              return (
                <div
                  key={plant._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    backgroundColor: isUrgent ? '#fffbeb' : '#ffffff',
                    border: isUrgent ? '1.5px solid #fde68a' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={plant.image}
                      alt={plant.name}
                      style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0e382c' }}>
                        {plant.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: isUrgent ? '#b45309' : '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isUrgent && <AlertTriangle size={12} />} Watered {hoursSinceWater}h ago • {plant.location || 'Garden'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleQuickWater(plant)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      title="Quick Water (+10 XP)"
                    >
                      <Droplets size={13} /> Water (+10XP)
                    </button>
                    <button
                      onClick={() => setSelectedPlantForCare(plant)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '6px 8px' }}
                      title="More Care Options"
                    >
                      <PlusCircle size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Care Activity Stream */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                Recent Care Activity Stream
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Verified maintenance logs & XP records
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
              {careLogs.length} Total Logs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
            {careLogs.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', padding: '24px' }}>
                No care activities logged yet. Water a plant to record your first entry!
              </p>
            ) : (
              careLogs.map((log) => (
                <div
                  key={log._id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: '#f8faf9',
                    borderRadius: '10px',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#059669',
                        marginTop: '2px',
                      }}
                    >
                      <Droplets size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e382c' }}>
                        {log.activityType?.replace('_', ' ').toUpperCase()} on {log.plantId?.name || 'Plant'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '2px' }}>
                        "{log.notes}"
                      </p>
                      <span style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
                        {new Date(log.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    +{log.xpEarned} XP
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPlantForCare && (
        <QuickCareModal
          isOpen={!!selectedPlantForCare}
          onClose={() => setSelectedPlantForCare(null)}
          plant={selectedPlantForCare}
          onCareLogged={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};
