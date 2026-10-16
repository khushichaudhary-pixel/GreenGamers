import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Camera, Tag, Send } from 'lucide-react';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated, userPlants = [] }) => {
  const { toastSuccess, toastError } = useToast();
  const { refreshUser } = useAuth();
  const [caption, setCaption] = useState('');
  const [plantTag, setPlantTag] = useState('');
  const [activityType, setActivityType] = useState('plantation');
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
    if (!caption.trim()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('caption', caption.trim());
      formData.append('plantTag', plantTag || 'General Plantation');
      formData.append('activityType', activityType);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const data = await api.createCommunityPost(formData);
      if (data.success) {
        toastSuccess('Published to Community! 🌱', '+15 Eco XP earned for inspiring other planters!', 15);
        await refreshUser();
        if (onPostCreated) onPostCreated(data.post);
        setCaption('');
        setImageFile(null);
        setImagePreview(null);
        onClose();
      }
    } catch (err) {
      toastError('Failed to publish post', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Plantation Milestone"
      subtitle="Inspire fellow Green Gamers with your sapling progress, care routine, or rooftop garden (+15 XP)"
    >
      <form onSubmit={handleSubmit}>
        {/* Caption */}
        <div className="form-group">
          <label className="form-label">Post Caption / Story</label>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Share your experience planting, pruning, or caring for your plants today..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>

        {/* Tag & Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Plant Tag</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tulsi, Neem, Balcony Garden"
              value={plantTag}
              onChange={(e) => setPlantTag(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Activity Type</label>
            <select
              className="form-select"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value="plantation">🌱 New Plantation</option>
              <option value="growth">📈 Growth Milestone</option>
              <option value="care">💧 Care & Watering Routine</option>
              <option value="achievement">🏆 Badge / Level Achievement</option>
              <option value="general">🌍 General Sustainability</option>
            </select>
          </div>
        </div>

        {/* Photo upload */}
        <div className="form-group">
          <label className="form-label">Upload Photograph</label>
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
              <div style={{ position: 'relative', height: '140px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ height: '100%', borderRadius: '6px', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div>
                <Camera size={26} color="#059669" style={{ margin: '0 auto 6px auto' }} />
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                  Click to choose a photo
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPG, PNG or WEBP</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !caption.trim()}>
            {loading ? 'Publishing...' : 'Publish Post (+15 XP)'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
