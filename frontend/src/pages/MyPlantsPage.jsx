import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PlantCard } from '../components/plants/PlantCard';
import { GrowthLogModal } from '../components/plants/GrowthLogModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Sprout, PlusCircle, Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const FILTERS = ['All', 'Healthy', 'Needs Care', 'Thriving', 'Growing', 'Completed'];

export const MyPlantsPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPlantForGrowth, setSelectedPlantForGrowth] = useState(null);

  const navigate = useNavigate();

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const data = await api.getPlants({
        filter: activeFilter,
        search: search.trim(),
        sort: sortBy,
      });
      if (data.success) {
        setPlants(data.plants || []);
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [activeFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlants();
  };

  const handlePlantUpdated = (updatedPlant) => {
    setPlants((prev) =>
      prev.map((p) => (p._id === updatedPlant._id ? { ...p, ...updatedPlant } : p))
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Add Plant Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            My Plants & Trees
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Manage, water, and monitor growth progress for your registered flora
          </p>
        </div>

        <Link to="/plants/add" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Register New Plant (+50 XP)</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by plant name, species, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search
              size={18}
              color="#9ca3af"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </form>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="#6b7280" />
            <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>Sort:</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8125rem' }}
            >
              <option value="newest">Newest Added</option>
              <option value="growth_high">Highest Growth %</option>
              <option value="xp_high">Most XP Earned</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: activeFilter === f ? '#059669' : '#f3f4f6',
                color: activeFilter === f ? '#ffffff' : '#4b5563',
                border: activeFilter === f ? '1px solid #059669' : '1px solid #e5e7eb',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching your registered flora..." />
      ) : plants.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title={search ? 'No plants match your query' : 'No plants registered yet'}
          description={
            search
              ? 'Try searching with a different species or keyword.'
              : 'Add your first plant to begin logging care routines, unlocking badges, and earning XP.'
          }
          actionLabel="Register First Plant (+50 XP)"
          onAction={() => navigate('/plants/add')}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {plants.map((plant) => (
            <PlantCard
              key={plant._id}
              plant={plant}
              onUpdate={handlePlantUpdated}
              onOpenGrowthModal={(p) => setSelectedPlantForGrowth(p)}
            />
          ))}
        </div>
      )}

      {/* Growth Log Modal */}
      {selectedPlantForGrowth && (
        <GrowthLogModal
          isOpen={!!selectedPlantForGrowth}
          onClose={() => setSelectedPlantForGrowth(null)}
          plant={selectedPlantForGrowth}
          onGrowthAdded={() => {
            fetchPlants();
          }}
        />
      )}
    </div>
  );
};
