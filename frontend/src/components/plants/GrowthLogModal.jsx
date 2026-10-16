import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Camera, Sparkles, TrendingUp } from 'lucide-react';

export const GrowthLogModal = ({ isOpen, onClose, plant, onGrowthAdded }) => {
  const { toastSuccess, toastError } = useToast();
  const { refreshUser } = useAuth();
  const [height, setHeight] = useState(plant?.height || 20);
  const [growthPercentage, setGrowthPercentage] = useState(plant?.growthPercentage || 25);
  const [healthStatus, setHealthStatus] = useState(plant?.healthStatus || 'Healthy');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plant) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('height', height);
      formData.append('growthPercentage', growthPercentage);
      formData.append('healthStatus', healthStatus);
      formData.append('notes', notes);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const data = await api.addGrowthUpdate(plant._id, formData);
      if (data.success) {
        const xpEarned = imageFile ? 35 : 20;
        toastSuccess(
          'Growth Update Recorded! 🌿',
          `+${xpEarned} Eco XP awarded for tracking ${plant.name}`,
          xpEarned
        );
        await refreshUser();
        if (onGrowthAdded) onGrowthAdded(data.plant, data.growthUpdate);
        onClose();
      }
    } catch (err) {
      toastError('Failed to record growth update', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Growth: ${plant?.name || 'Plant'}`}
      subtitle="Track height progression & capture visual growth records (+20-35 XP)"
    >
      <form onSubmit={handleSubmit}>
        {/* Height and Percentage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Plant Height (cm)</label>
            <input
              type="number"
              className="form-input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="1"
              max="1000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Health Status</label>
            <select
              className="form-select"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
            >
              <option value="Healthy">Healthy</option>
              <option value="Thriving">Thriving</option>
              <option value="Needs Care">Needs Care</option>
              <option value="Dormant">Dormant</option>
            </select>
          </div>
        </div>

        {/* Growth Percentage Slider */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Estimated Maturity / Growth Stage
            </label>
            <span style={{ fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>
              {growthPercentage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={growthPercentage}
            onChange={(e) => setGrowthPercentage(e.target.value)}
            style={{ width: '100%', accentColor: '#059669' }}
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label className="form-label">Growth Photograph (+15 Bonus XP)</label>
          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#f8faf9',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            />
            {imagePreview ? (
              <div style={{ position: 'relative', height: '120px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ height: '100%', borderRadius: '6px', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div>
                <Camera size={24} color="#059669" style={{ margin: '0 auto 6px auto' }} />
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                  Click to upload new plant photo
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPG, PNG or WEBP up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Observations & Notes</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. New fresh leaves sprouted, healthy stem color, watered after recording..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Save Growth Log (+20 XP)'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
