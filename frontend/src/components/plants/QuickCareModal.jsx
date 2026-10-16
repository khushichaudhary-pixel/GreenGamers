import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Droplets, Sparkles, Scissors, HeartPulse, Layers, Check } from 'lucide-react';

const CARE_OPTIONS = [
  { type: 'watered', label: 'Watered', xp: 10, icon: Droplets, color: '#059669', desc: 'Hydrate soil and foliage' },
  { type: 'fertilized', label: 'Fertilized', xp: 10, icon: Sparkles, color: '#10b981', desc: 'Organic compost or nutrients' },
  { type: 'pruned', label: 'Pruned / Trimmed', xp: 10, icon: Scissors, color: '#047857', desc: 'Remove dead leaves & shape' },
  { type: 'checked_health', label: 'Health Inspection', xp: 5, icon: HeartPulse, color: '#0891b2', desc: 'Check for pests & vigor' },
  { type: 'mulching', label: 'Mulch & Soil Aeration', xp: 10, icon: Layers, color: '#d97706', desc: 'Soil nourishment & cover' },
];

export const QuickCareModal = ({ isOpen, onClose, plant, onCareLogged }) => {
  const { toastSuccess, toastError } = useToast();
  const { refreshUser } = useAuth();
  const [selectedType, setSelectedType] = useState('watered');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plant) return;

    try {
      setLoading(true);
      const selectedOption = CARE_OPTIONS.find((c) => c.type === selectedType);
      const data = await api.logCareActivity(plant._id, {
        activityType: selectedType,
        notes: notes || `Completed ${selectedOption?.label || selectedType} care routine.`,
      });

      if (data.success) {
        toastSuccess(
          `${selectedOption?.label || 'Care'} Logged! 🌱`,
          `+${selectedOption?.xp || 10} Eco XP earned for ${plant.name}`,
          selectedOption?.xp || 10
        );
        await refreshUser();
        if (onCareLogged) onCareLogged(data.plant, data.careActivity);
        onClose();
      }
    } catch (err) {
      toastError('Care logging failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Plant Care: ${plant?.name || 'Plant'}`}
      subtitle="Select care action performed to earn Eco XP and update plant health status"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Care Activity</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {CARE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedType === opt.type;
              return (
                <div
                  key={opt.type}
                  onClick={() => setSelectedType(opt.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isSelected ? `2px solid ${opt.color}` : '1px solid #e5e7eb',
                    backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#059669' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#ffffff' : opt.color,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                        {opt.label}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{opt.desc}</p>
                    </div>
                  </div>

                  <span
                    style={{
                      background: opt.color,
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    +{opt.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes / Observation (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Added 2 liters water; checked soil moisture"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Recording...' : 'Submit Care Action'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
