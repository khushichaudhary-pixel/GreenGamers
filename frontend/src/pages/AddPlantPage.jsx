import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

const POPULAR_SPECIES = [
  { name: 'Holy Basil (Krishna Tulsi)', type: 'Medicinal / Herb (Ocimum tenuiflorum)', height: 12, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
  { name: 'Indian Lilac (Neem Sapling)', type: 'Tree (Azadirachta indica)', height: 25, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sacred Peepal', type: 'Tree (Ficus religiosa)', height: 20, image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80' },
  { name: 'Golden Pothos (Money Plant)', type: 'Indoor Climber (Epipremnum aureum)', height: 15, image: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?w=600&auto=format&fit=crop&q=80' },
  { name: 'Desi Rose (Gulab)', type: 'Flowering Shrub (Rosa indica)', height: 15, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  { name: 'Snake Plant (Sansevieria)', type: 'Air Purifier (Dracaena trifasciata)', height: 18, image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80' },
  { name: 'Medicinal Aloe Vera', type: 'Succulent (Aloe barbadensis)', height: 10, image: 'https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Alphonso Mango Sapling', type: 'Fruit Tree (Mangifera indica)', height: 35, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80' },
];

export const AddPlantPage = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Home Garden');
  const [height, setHeight] = useState('15');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [loading, setLoading] = useState(false);

  const { toastCelebration, toastError } = useToast();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setType(preset.type);
    setHeight(String(preset.height));
    setSelectedPresetImage(preset.image);
    setImagePreview(preset.image);
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSelectedPresetImage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !type) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      formData.append('plantingDate', plantingDate);
      formData.append('location', location);
      formData.append('height', height);
      formData.append('description', description);
      formData.append('notes', notes);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (selectedPresetImage) {
        formData.append('image', selectedPresetImage);
      }

      const data = await api.createPlant(formData);
      if (data.success) {
        toastCelebration(
          '🌱 Plant Registered Successfully!',
          `You earned +50 Eco XP for registering ${name}!`,
          50
        );
        await refreshUser();
        navigate(`/plants/${data.plant._id}`);
      }
    } catch (err) {
      toastError('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Link */}
      <Link
        to="/plants"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6b7280',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={16} /> Back to My Plants
      </Link>

      <div
        className="card"
        style={{
          padding: '36px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              <Sparkles size={12} /> +50 Eco XP Registration Reward
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0e382c' }}>
              Register a New Plant
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
              Enter your plant details to initiate growth tracking and daily care routines
            </p>
          </div>

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <Sprout size={24} />
          </div>
        </div>

        {/* Quick Presets Carousel */}
        <div style={{ marginBottom: '28px' }}>
          <label className="form-label">Quick Auto-Fill Popular Species</label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {POPULAR_SPECIES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: name === p.name ? '#ecfdf5' : '#f8faf9',
                  border: name === p.name ? '1.5px solid #059669' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: name === p.name ? '#059669' : '#374151',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Plant / Tree Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Balcony Holy Basil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Species / Plant Type *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ocimum tenuiflorum (Tulsi)"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Planting Date</label>
              <input
                type="date"
                className="form-input"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / Plot</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Balcony East Pot #2 or Campus Botanical"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Height (cm)</label>
              <input
                type="number"
                className="form-input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                max="1000"
              />
            </div>
          </div>

          {/* Photograph Upload */}
          <div className="form-group">
            <label className="form-label">Plant Photograph</label>
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '24px',
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
                <div style={{ position: 'relative', height: '180px', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ height: '100%', borderRadius: '8px', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div>
                  <Camera size={32} color="#059669" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#374151' }}>
                    Upload plant photo or select a species preset above
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                    PNG, JPG or WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description & Notes */}
          <div className="form-group">
            <label className="form-label">Description & Sunlight Needs</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Placed in terracotta pot with organic compost. Enjoys 4 hours of direct morning sunlight."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <Link to="/plants" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !name || !type}
            >
              {loading ? 'Registering Plant...' : 'Register Plant (+50 XP)'}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
