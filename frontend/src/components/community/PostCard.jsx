import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LevelBadge } from '../common/LevelBadge';
import { Heart, MessageCircle, Share2, Send, Tag, Sparkles } from 'lucide-react';

export const PostCard = ({ post, onPostUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toastInfo('Please log in', 'Log in to like and support community plantation posts.');
      return;
    }

    try {
      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));

      const data = await api.likePost(post._id);
      if (data.success) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(post.likesCount);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      toastInfo('Please log in', 'Log in to join the discussion.');
      return;
    }

    try {
      setSubmittingComment(true);
      const data = await api.addComment(post._id, commentText);
      if (data.success) {
        setComments(data.comments);
        setCommentText('');
        toastSuccess('Comment Added! 💬', 'Your response has been published.');
      }
    } catch (err) {
      toastError('Could not post comment', err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toastSuccess('Link Copied! 🔗', 'Post URL copied to clipboard.');
      }
      const data = await api.sharePost(post._id);
      if (data.success) {
        setSharesCount(data.sharesCount);
      }
    } catch (err) {
      toastSuccess('Shared!', 'Post link ready to share.');
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '24px',
      }}
    >
      {/* Post Author Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={
              post.user?.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={post.user?.name || 'User'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0e382c', margin: 0 }}>
                {post.user?.name || 'Green Gamer'}
              </h4>
              <LevelBadge level={post.user?.level || 1} title={post.user?.levelTitle} size="sm" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              {post.user?.college || 'Green Campus'} •{' '}
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Plant Tag */}
        {post.plantTag && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #d1fae5',
            }}
          >
            <Tag size={12} /> {post.plantTag}
          </span>
        )}
      </div>

      {/* Post Photo */}
      {post.image && (
        <div style={{ width: '100%', maxHeight: '420px', backgroundColor: '#000', overflow: 'hidden' }}>
          <img
            src={post.image}
            alt="Community update"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '420px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Caption & Content */}
      <div style={{ padding: '16px 20px' }}>
        <p style={{ fontSize: '0.9375rem', color: '#1f2937', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {post.caption}
        </p>

        {/* Action Bar (Like, Comment, Share) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #f3f4f6',
            marginTop: '16px',
            paddingTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Like Button */}
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isLiked ? '#dc2626' : '#4b5563',
                transition: 'transform 0.15s ease',
              }}
            >
              <Heart size={18} fill={isLiked ? '#dc2626' : 'none'} />
              <span>{likesCount} Likes</span>
            </button>

            {/* Comment Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#4b5563',
              }}
            >
              <MessageCircle size={18} />
              <span>{comments.length} Comments</span>
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            <Share2 size={16} />
            <span>Share ({sharesCount})</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div
            style={{
              marginTop: '16px',
              borderTop: '1px solid #f3f4f6',
              paddingTop: '16px',
            }}
          >
            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Write a supportive comment or care advice..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.875rem' }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submittingComment || !commentText.trim()}
              >
                <Send size={14} />
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {comments.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
                  No comments yet. Be the first to encourage this planter! 🌱
                </p>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      backgroundColor: '#f8faf9',
                      padding: '10px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <img
                      src={
                        comment.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={comment.userName}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0e382c' }}>
                          {comment.userName}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#374151', marginTop: '2px' }}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
