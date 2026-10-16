import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
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
  TrendingUp,
  Camera,
  Calendar,
  Sparkles,
  MapPin,
  PlusCircle,
  Clock,
} from 'lucide-react';

export const GrowthTimelinePage = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [growthLogs, setGrowthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const data = await api.getPlants();
      if (data.success && data.plants.length > 0) {
        setPlants(data.plants);
        setSelectedPlantId(data.plants[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrowthHistory = async (plantId) => {
    if (!plantId) return;
    try {
      const data = await api.getGrowthHistory(plantId);
      if (data.success) {
        setGrowthLogs(data.growthUpdates || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    if (selectedPlantId) {
      fetchGrowthHistory(selectedPlantId);
    }
  }, [selectedPlantId]);

  if (loading) {
    return <LoadingSpinner text="Loading plant growth timelines..." />;
  }

  const selectedPlant = plants.find((p) => p._id === selectedPlantId) || plants[0];

  const chartData = growthLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    height: log.height,
    growth: log.growthPercentage,
  }));

  if (chartData.length === 0 && selectedPlant) {
    chartData.push({
      date: 'Planted',
      height: selectedPlant.height || 15,
      growth: selectedPlant.growthPercentage || 15,
    });
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Plant Growth Timeline
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Visual progression, milestone charts, and photographic growth logs
          </p>
        </div>

        {selectedPlant && (
          <button onClick={() => setShowLogModal(true)} className="btn btn-primary">
            <Camera size={18} /> Record Growth Measurement (+20-35 XP)
          </button>
        )}
      </div>

      {/* Plant Selector Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <label className="form-label" style={{ marginBottom: '10px' }}>
          Select Registered Plant:
        </label>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {plants.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelectedPlantId(p._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: selectedPlantId === p._id ? '#ecfdf5' : '#f8faf9',
                border: selectedPlantId === p._id ? '2px solid #059669' : '1px solid #e5e7eb',
                color: selectedPlantId === p._id ? '#059669' : '#374151',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedPlant ? (
        <>
          {/* Growth Analytics Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0e382c' }}>
                  {selectedPlant.name} – Height Progression Chart (cm)
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  Initial: {selectedPlant.initialHeight || 15} cm • Current: {selectedPlant.height} cm (+
                  {(selectedPlant.height || 15) - (selectedPlant.initialHeight || 15)} cm gained)
                </p>
              </div>

              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                }}
              >
                {selectedPlant.growthPercentage}% Maturity
              </span>
            </div>

            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="timelineColor" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#timelineColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chronological Photo Log Timeline Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e382c' }}>
              Photographic Milestone Timeline
            </h3>

            {growthLogs.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                No growth measurements logged yet for this plant. Click "Record Growth Measurement" to record!
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {growthLogs.map((log, index) => (
                  <div
                    key={log._id || index}
                    className="card card-hover"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Log Image */}
                    <div style={{ height: '200px', backgroundColor: '#000', position: 'relative' }}>
                      <img
                        src={log.image || selectedPlant.image}
                        alt="Growth stage"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(14, 56, 44, 0.9)',
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Height: {log.height} cm
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        +{log.xpEarned || 20} XP
                      </div>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                          {new Date(log.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="status-pill status-healthy">{log.healthStatus}</span>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5, marginTop: '4px' }}>
                        "{log.notes || 'Recorded growth update.'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Growth Log Modal */}
      {showLogModal && selectedPlant && (
        <GrowthLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          plant={selectedPlant}
          onGrowthAdded={() => {
            fetchGrowthHistory(selectedPlant._id);
          }}
        />
      )}
    </div>
  );
};
