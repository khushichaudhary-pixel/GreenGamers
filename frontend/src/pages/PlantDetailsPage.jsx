import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { QuickCareModal } from '../components/plants/QuickCareModal';
import { GrowthLogModal } from '../components/plants/GrowthLogModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Sprout,
  Droplets,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Camera,
  Scissors,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
} from 'lucide-react';

export const PlantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const { refreshUser } = useAuth();

  const [plant, setPlant] = useState(null);
  const [growthUpdates, setGrowthUpdates] = useState([]);
  const [careActivities, setCareActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCareModal, setShowCareModal] = useState(false);
  const [showGrowthModal, setShowGrowthModal] = useState(false);

  const fetchPlantDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getPlantById(id);
      if (data.success) {
        setPlant(data.plant);
        setGrowthUpdates(data.growthUpdates || []);
        setCareActivities(data.careActivities || []);
      }
    } catch (err) {
      toastError('Could not load plant', err.message);
      navigate('/plants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlantDetails();
    }
  }, [id]);

  const handleQuickWater = async () => {
    try {
      const data = await api.logCareActivity(plant._id, {
        activityType: 'watered',
        notes: 'Hydrated from plant profile.',
      });
      if (data.success) {
        toastSuccess('Watered Plant! 💧', `+10 Eco XP earned for ${plant.name}`, 10);
        await refreshUser();
        fetchPlantDetails();
      }
    } catch (err) {
      toastError('Watering failed', err.message);
    }
  };

  const handleDeletePlant = async () => {
    if (window.confirm(`Are you sure you want to remove "${plant.name}" and its history?`)) {
      try {
        await api.deletePlant(plant._id);
        toastSuccess('Plant Removed', 'Plant and logs removed from your dashboard.');
        navigate('/plants');
      } catch (err) {
        toastError('Delete error', err.message);
      }
    }
  };

  if (loading || !plant) {
    return <LoadingSpinner text="Loading plant profile and growth history..." />;
  }

  // Days since planted
  const daysOld = plant.plantingDate
    ? Math.max(1, Math.floor((new Date() - new Date(plant.plantingDate)) / (1000 * 60 * 60 * 24)))
    : 1;

  // Chart data
  const chartData = growthUpdates.map((u) => ({
    date: new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    height: u.height,
    growth: u.growthPercentage,
  }));

  if (chartData.length === 0) {
    chartData.push({
      date: new Date(plant.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      height: plant.height,
      growth: plant.growthPercentage,
    });
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <Link
          to="/plants"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to My Plants
        </Link>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDeletePlant}
            className="btn btn-outline btn-sm"
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Trash2 size={14} /> Remove Plant
          </button>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          padding: '32px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Plant Large Image */}
        <div style={{ height: '360px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={plant.image}
            alt={plant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <span
              className={`status-pill ${
                plant.healthStatus === 'Healthy' || plant.healthStatus === 'Thriving'
                  ? 'status-healthy'
                  : 'status-needs-care'
              }`}
              style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
            >
              {plant.healthStatus}
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(14, 56, 44, 0.9)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#10b981" /> {plant.xpEarned} Total XP
          </div>
        </div>

        {/* Plant Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              {plant.type}
            </span>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0e382c', marginTop: '10px' }}>
              {plant.name}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', fontSize: '0.875rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#059669" />
                <span>{plant.location || 'Home Garden'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#059669" />
                <span>
                  Planted on {new Date(plant.plantingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ({daysOld} days ago)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#059669" />
                <span>
                  Last Watered:{' '}
                  {plant.lastWatered
                    ? new Date(plant.lastWatered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Recently'}
                </span>
              </div>
            </div>

            {/* Growth Progress Bar */}
            <div style={{ margin: '20px 0' }}>
              <ProgressBar
                value={plant.growthPercentage || 15}
                max={100}
                label="Growth Stage / Maturity"
                sublabel={`${plant.growthPercentage}% (Current Height: ${plant.height} cm)`}
                height={10}
              />
            </div>

            {plant.description && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '20px' }}>
                {plant.description}
              </p>
            )}
          </div>

          {/* Action Button Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <button onClick={handleQuickWater} className="btn btn-primary btn-sm" style={{ padding: '10px' }}>
              <Droplets size={16} /> Water (+10 XP)
            </button>
            <button
              onClick={() => setShowGrowthModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '10px' }}
            >
              <TrendingUp size={16} /> Log Growth (+20 XP)
            </button>
            <button
              onClick={() => setShowCareModal(true)}
              className="btn btn-outline btn-sm"
              style={{ padding: '10px' }}
            >
              <Scissors size={16} /> Care Actions
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: '24px' }}>
        {[
          { id: 'timeline', label: 'Growth Timeline & Photos' },
          { id: 'care', label: `Care Activity Logs (${careActivities.length})` },
          { id: 'chart', label: 'Height Progression Chart' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px',
              fontSize: '0.9375rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#059669' : '#6b7280',
              borderBottom: activeTab === tab.id ? '3px solid #059669' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Growth Timeline */}
      {activeTab === 'timeline' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
              Chronological Growth Updates
            </h3>
            <button onClick={() => setShowGrowthModal(true)} className="btn btn-primary btn-sm">
              <Camera size={14} /> Add New Measurement
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {growthUpdates.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                No growth measurements recorded yet. Click "Add New Measurement" to record height!
              </div>
            ) : (
              growthUpdates.map((update, idx) => (
                <div
                  key={update._id || idx}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: '#ecfdf5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#059669',
                        }}
                      >
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e382c' }}>
                          Height: {update.height} cm ({update.growthPercentage}% Maturity)
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Recorded on {new Date(update.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="status-pill status-healthy">{update.healthStatus}</span>
                      <span
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        +{update.xpEarned || 20} XP
                      </span>
                    </div>
                  </div>

                  {update.notes && (
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5 }}>
                      "{update.notes}"
                    </p>
                  )}

                  {update.image && (
                    <div style={{ height: '220px', borderRadius: '10px', overflow: 'hidden' }}>
                      <img
                        src={update.image}
                        alt="Growth evidence"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Care Activity Logs */}
      {activeTab === 'care' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
              Care Activities History
            </h3>
            <button onClick={() => setShowCareModal(true)} className="btn btn-primary btn-sm">
              <Droplets size={14} /> Log Care Activity
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Date & Time</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Activity</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>Notes</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: '#0e382c' }}>XP Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {careActivities.map((act) => (
                    <tr key={act._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                        {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#059669', textTransform: 'capitalize' }}>
                        {act.activityType.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>
                        {act.notes || 'Routine maintenance'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 700, fontSize: '0.75rem' }}>
                          +{act.xpEarned} XP
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Chart */}
      {activeTab === 'chart' && (
        <div className="card animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c', marginBottom: '20px' }}>
            Height Progression Trend (cm)
          </h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="plantColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e382c',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="height"
                  name="Height (cm)"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#plantColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCareModal && (
        <QuickCareModal
          isOpen={showCareModal}
          onClose={() => setShowCareModal(false)}
          plant={plant}
          onCareLogged={() => {
            fetchPlantDetails();
          }}
        />
      )}

      {showGrowthModal && (
        <GrowthLogModal
          isOpen={showGrowthModal}
          onClose={() => setShowGrowthModal(false)}
          plant={plant}
          onGrowthAdded={() => {
            fetchPlantDetails();
          }}
        />
      )}
    </div>
  );
};
