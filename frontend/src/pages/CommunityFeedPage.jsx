import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/community/PostCard';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Users, PlusCircle, Sparkles, Filter, MessageCircle, Heart } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Community Posts' },
  { id: 'plantation', label: '🌱 New Plantations' },
  { id: 'growth', label: '📈 Growth Milestones' },
  { id: 'care', label: '💧 Care Routines' },
  { id: 'achievement', label: '🏆 Badges & Levels' },
];

export const CommunityFeedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await api.getCommunityFeed(selectedCategory);
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedCategory]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0e382c' }}>
            Green Gamers Community Feed
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Connect with fellow planters, exchange care techniques, and celebrate urban greening
          </p>
        </div>

        {isAuthenticated && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <PlusCircle size={18} /> Share Milestone (+15 XP)
          </button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: selectedCategory === cat.id ? '#059669' : '#ffffff',
              color: selectedCategory === cat.id ? '#ffffff' : '#4b5563',
              border: selectedCategory === cat.id ? '1px solid #059669' : '1px solid #e5e7eb',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed Stream */}
      {loading ? (
        <LoadingSpinner text="Loading community plantation stories..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No posts in this category yet"
          description="Be the first to share your plant growth milestone or care story with the community!"
          actionLabel="Share First Milestone (+15 XP)"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={fetchFeed} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};
